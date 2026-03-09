import { collection, getDocs, limit, query } from "firebase/firestore"
import { ArrowUpDown, Building2, ChevronDown, Euro, MapPin } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { useSearchParams } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import ListingCard from "../components/ListingCard"
import { db } from "../lib/firebase"

type MunicipalityConfig = {
  name: string
  locations: string[]
}

const priceRanges = [
  "Any price",
  "Up to €600",
  "€600 - €800",
  "€800 - €1,000",
  "€1,000 - €1,200",
  "€1,200+",
]

type FilterState = {
  propertyType: string
  municipality: string
  location: string
  maxPrice: string
  sortOrder: SortOrder
}

const initialFilters: FilterState = {
  propertyType: "",
  municipality: "",
  location: "",
  maxPrice: "",
  sortOrder: "none",
}

type SortOrder = "none" | "price-asc" | "price-desc"

type Property = {
  id: string
  title: string
  type: string
  municipality: string
  location: string
  price: number | null
  currency: string
  description: string
  image: string
  url: string
  bedrooms: number | null
  area: number | null
  floor: string
  phone: string
}

const Rent = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get("search")?.trim() ?? ""
  const [filterValues, setFilterValues] = useState<FilterState>({ ...initialFilters })
  const [allProperties, setAllProperties] = useState<Property[]>([])
  const [displayProperties, setDisplayProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const listingsQuery = query(collection(db, "listings"), limit(30))
        const snapshot = await getDocs(listingsQuery)

        const mapped = snapshot.docs.map((doc, index) => {
          const data = doc.data()
          const title = readString(data.title)
          const { location, municipality } = extractLocationParts(title)
          const type = detectPropertyType(title)
          const image = readString(data.image)

          return {
            id: doc.id || `listing-${index + 1}`,
            title: title || `Listing ${index + 1}`,
            type,
            municipality,
            location,
            price: parsePrice(data.price),
            currency: readString(data.currency) || "€",
            description: readString(data.description),
            image,
            url: readString(data.url),
            bedrooms: readNullableNumber(data.bedrooms),
            area: readNullableNumber(data.area),
            floor: readString(data.floor),
            phone: readString(data.phone),
          } satisfies Property
        })

        const apartmentsOnly = mapped.filter((property) => isApartmentOnlyTitle(property.title))
        setAllProperties(apartmentsOnly)
      } catch (fetchError) {
        console.error("Failed to fetch rent listings:", fetchError)
        setError("Could not load listings from Firestore.")
      } finally {
        setLoading(false)
      }
    }

    void loadProperties()
  }, [])

  const municipalities = useMemo<MunicipalityConfig[]>(() => {
    const map = new Map<string, Set<string>>()
    for (const property of allProperties) {
      if (!property.municipality) {
        continue
      }
      if (!map.has(property.municipality)) {
        map.set(property.municipality, new Set())
      }
      if (property.location) {
        map.get(property.municipality)?.add(property.location)
      }
    }
    return Array.from(map.entries()).map(([name, locations]) => ({
      name,
      locations: Array.from(locations).sort((a, b) => a.localeCompare(b)),
    }))
  }, [allProperties])

  const propertyTypes = useMemo(() => {
    return Array.from(new Set(allProperties.map((property) => property.type).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    )
  }, [allProperties])

  const selectedMunicipality =
    municipalities.find((municipality) => municipality.name === filterValues.municipality) ?? null

  useEffect(() => {
    if (!selectedMunicipality) {
      return
    }
    if (selectedMunicipality.locations.includes(filterValues.location)) {
      return
    }
    setFilterValues((prev) => ({ ...prev, location: selectedMunicipality.locations[0] ?? "" }))
  }, [filterValues.location, selectedMunicipality])

  const handleSelectChange = (field: keyof FilterState) => (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    if (field === "municipality" && value === "") {
      setFilterValues((prev) => ({ ...prev, municipality: "", location: "" }))
      return
    }
    setFilterValues((prev) => ({ ...prev, [field]: value }))
  }

  const handleResetFilters = () => {
    setFilterValues({ ...initialFilters })
    setSearchParams({})
  }

  const handleSubmitFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    const filtered = allProperties
      .filter((property) => matchesFilters(property, filterValues))
      .filter((property) => matchesSearchQuery(property, searchQuery))
    setDisplayProperties(sortByPrice(filtered, filterValues.sortOrder))
  }, [allProperties, filterValues, searchQuery])

  return (
    <div className="min-h-screen bg-[#f5f5f0] font-['Space_Grotesk'] text-[#1f1f1f]">
      <Header />

      <main className="mx-auto max-w-6xl px-6">
        <section className="mb-12 mt-12">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-semibold">Find your property</h1>
            <p className="text-lg text-gray-600">
              Search through our available rental properties in Gran Canaria
            </p>
            {searchQuery && (
              <p className="mt-3 text-sm font-medium text-[#047857]">
                Results for: "{searchQuery}"
              </p>
            )}
          </div>

          <form
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
            onSubmit={handleSubmitFilters}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <label className="space-y-2 text-sm font-medium text-gray-600">
                Property type
                <div className="relative">
                  <Building2
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    onChange={handleSelectChange("propertyType")}
                    value={filterValues.propertyType}
                  >
                    <option value="">Property type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-600">
                Municipality
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    onChange={handleSelectChange("municipality")}
                    value={filterValues.municipality}
                  >
                    <option value="">Municipality</option>
                    {municipalities.map((municipality) => (
                      <option key={municipality.name} value={municipality.name}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-600">
                Location
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    onChange={handleSelectChange("location")}
                    value={filterValues.location}
                  >
                    <option value="">Location</option>
                    {(selectedMunicipality?.locations ?? []).map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-600">
                Max. Price
                <div className="relative">
                  <Euro
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    onChange={handleSelectChange("maxPrice")}
                    value={filterValues.maxPrice}
                  >
                    <option value="">Max. Price</option>
                    {priceRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </label>

              <label className="space-y-2 text-sm font-medium text-gray-600">
                Sort by price
                <div className="relative">
                  <ArrowUpDown
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-300 bg-white pl-10 pr-10 text-sm text-gray-700 transition-colors hover:border-gray-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                    onChange={handleSelectChange("sortOrder")}
                    value={filterValues.sortOrder}
                  >
                    <option value="none">Default</option>
                    <option value="price-asc">Low to high</option>
                    <option value="price-desc">High to low</option>
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                onClick={handleResetFilters}
                type="button"
              >
                Clear
              </button>
              <button
                className="inline-flex h-12 items-center rounded-xl bg-emerald-700 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 hover:shadow-md"
                type="submit"
              >
                Search
              </button>
            </div>
          </form>
        </section>

        <section className="pb-16">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-semibold">Available Properties</h2>
            <p className="text-gray-600">Browse the latest rental listings</p>
          </div>

          {loading ? (
            <div className="rounded-[34px] border border-black/5 bg-white p-10 text-center text-lg shadow-sm">
              Loading listings...
            </div>
          ) : error ? (
            <div className="rounded-[34px] border border-red-200 bg-red-50 p-10 text-center text-lg text-red-700 shadow-sm">
              {error}
            </div>
          ) : displayProperties.length === 0 ? (
            <div className="rounded-[34px] border border-black/5 bg-white p-10 text-center text-lg shadow-sm">
              No apartments match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProperties.map((property) => (
                <ListingCard key={property.id} listing={property} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

const readString = (value: unknown) => (typeof value === "string" ? value : "")

const readNullableNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null
  }
  if (typeof value !== "string") {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const parsePrice = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value) : null
  }

  if (typeof value !== "string") {
    return null
  }

  const cleaned = value
    .toLowerCase()
    .replace(/\/\s*month|per\s*month|monthly|\/\s*mes|al\s*mes/g, "")
    .replace(/[^\d.,]/g, "")
    .trim()

  if (!cleaned) {
    return null
  }

  const digits = cleaned.replace(/[.,]/g, "")
  if (!digits) {
    return null
  }

  const parsed = Number.parseInt(digits, 10)
  return Number.isNaN(parsed) ? null : parsed
}

const detectPropertyType = (title: string) => {
  const lower = title.toLowerCase()
  if (lower.includes("studio")) return "Studio"
  if (lower.includes("villa")) return "Villa"
  if (lower.includes("penthouse")) return "Penthouse"
  if (lower.includes("townhouse") || lower.includes("town house")) return "Townhouse"
  if (lower.includes("rural")) return "Rural house"
  if (lower.includes("flat") || lower.includes("apartment")) return "Apartment"
  return "Apartment"
}

const extractLocationParts = (title: string) => {
  const parts = title
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
  const municipality = parts.length > 0 ? parts[parts.length - 1] : ""
  const location = parts.length > 1 ? parts[parts.length - 2] : ""
  return { location, municipality }
}

const priceMatches = (price: number | null, range: string) => {
  if (price === null) {
    return range === "Any price"
  }

  switch (range) {
    case "Any price":
      return true
    case "Up to €600":
      return price <= 600
    case "€600 - €800":
      return price >= 600 && price <= 800
    case "€800 - €1,000":
      return price >= 800 && price <= 1000
    case "€1,000 - €1,200":
      return price >= 1000 && price <= 1200
    case "€1,200+":
      return price >= 1200
    default:
      return true
  }
}

const matchesFilters = (property: Property, filters: FilterState) => {
  if (filters.propertyType && property.type !== filters.propertyType) return false
  if (filters.municipality && property.municipality !== filters.municipality) return false
  if (filters.location && property.location !== filters.location) return false
  if (filters.maxPrice && !priceMatches(property.price, filters.maxPrice)) return false
  return true
}

const matchesSearchQuery = (property: Property, searchQuery: string) => {
  const normalized = searchQuery.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  const searchableFields = [
    property.title,
    property.description,
    property.type,
    property.municipality,
    property.location,
    property.floor,
    property.phone,
    property.bedrooms === null ? "" : String(property.bedrooms),
    property.area === null ? "" : String(property.area),
  ]

  return searchableFields.some((field) => field.toLowerCase().includes(normalized))
}

const sortByPrice = (properties: Property[], sortOrder: SortOrder) => {
  if (sortOrder === "none") {
    return properties
  }

  const sorted = [...properties]
  sorted.sort((a, b) => {
    if (a.price === null && b.price === null) return 0
    if (a.price === null) return 1
    if (b.price === null) return -1
    return sortOrder === "price-asc" ? a.price - b.price : b.price - a.price
  })
  return sorted
}

const isApartmentOnlyTitle = (title: string) => {
  if (!title) {
    return false
  }

  const normalized = title.toLowerCase()
  const includesApartmentType = normalized.includes("flat") || normalized.includes("apartment")
  const excludedType =
    normalized.includes("house") ||
    normalized.includes("villa") ||
    normalized.includes("chalet") ||
    normalized.includes("detached") ||
    normalized.includes("semi-detached")

  return includesApartmentType && !excludedType
}

export default Rent
