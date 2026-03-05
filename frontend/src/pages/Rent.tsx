import { collection, getDocs, limit, query } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent, MouseEvent } from "react"
import AccountRequiredModal from "../components/AccountRequiredModal"
import Footer from "../components/Footer"
import Header from "../components/Header"
import PropertyModal from "../components/PropertyModal"
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
}

const initialFilters: FilterState = {
  propertyType: "",
  municipality: "",
  location: "",
  maxPrice: "",
}

type Property = {
  id: number
  title: string
  type: string
  municipality: string
  location: string
  price: number
  currency: string
  description: string
  image: string
  url: string
  bedrooms: number
  area: number
  images?: string[]
}

const Carousel = ({ items }: { items: Property[] }) => {
  const ITEMS_PER_SLIDE = 6
  const [slideIdx, setSlideIdx] = useState(0)
  const [selected, setSelected] = useState<Property | null>(null)
  const [isLoggedIn] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showAuthModal, setShowAuthModal] = useState(false)

  const slides = Math.max(1, Math.ceil(items.length / ITEMS_PER_SLIDE))
  const start = slideIdx * ITEMS_PER_SLIDE
  const currentItems = items.slice(start, start + ITEMS_PER_SLIDE)

  useEffect(() => {
    if (slideIdx >= slides) {
      setSlideIdx(0)
    }
  }, [slideIdx, slides])

  const showPrev = () => setSlideIdx((s) => (s - 1 + slides) % slides)
  const showNext = () => setSlideIdx((s) => (s + 1) % slides)

  const toggleFavorite = (property: Property, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!isLoggedIn) {
      setShowAuthModal(true)
      return
    }
    setFavorites((prev) =>
      prev.includes(property.id) ? prev.filter((id) => id !== property.id) : [...prev, property.id],
    )
  }

  const isFavorited = (id: number) => favorites.includes(id)

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-full max-w-5xl">
        <button
          aria-label="previous"
          className="absolute -left-8 top-1/2 -translate-y-1/2 rounded-full p-2 text-2xl text-gray-700 transition-transform duration-150 hover:scale-110 hover:text-black"
          onClick={showPrev}
          type="button"
        >
          ‹
        </button>

        <div className="grid grid-cols-3 gap-6">
          {currentItems.map((property) => (
            <article
              className="group relative cursor-pointer overflow-hidden rounded-[34px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
              key={property.id}
              onClick={() => setSelected(property)}
            >
              <button
                aria-label={isFavorited(property.id) ? "Remove favorite" : "Add favorite"}
                className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm transition hover:scale-105"
                onClick={(event) => toggleFavorite(property, event)}
                type="button"
              >
                {isFavorited(property.id) ? (
                  <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.554L18.9 24 12 20.013 5.1 24l1.2-8.696L.6 9.75l7.732-1.732z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                )}
              </button>

              <div className="rounded-t-[34px] bg-gray-200 p-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#3f37f0]">
                  <span>For rent</span>
                  <span>›</span>
                </div>
                <div className="mt-4 h-40 overflow-hidden rounded-2xl">
                  <img
                    alt={property.title}
                    className="h-full w-full object-cover"
                    src={property.image || "https://placehold.co/640x360?text=No+Image"}
                  />
                </div>
              </div>

              <div className="rounded-b-[34px] bg-[#047857] px-6 py-4 text-white">
                <p className="line-clamp-2 text-lg font-semibold">{property.title}</p>
                <p className="text-sm text-white/80">
                  {property.location}
                  {property.municipality ? `, ${property.municipality}` : ""}
                </p>
                <p className="mt-3 text-xl font-semibold">
                  {property.currency || "€"}
                  {property.price.toLocaleString()}/month
                </p>
              </div>
            </article>
          ))}

          {Array.from({ length: Math.max(0, ITEMS_PER_SLIDE - currentItems.length) }).map((_, index) => (
            <div
              className="flex flex-col items-center justify-center rounded-[34px] border border-dashed border-gray-200 bg-white p-6 text-center shadow-sm"
              key={`empty-${index}`}
            >
              <p className="text-sm font-semibold text-gray-700">No more properties on this slide</p>
            </div>
          ))}
        </div>

        <button
          aria-label="next"
          className="absolute -right-8 top-1/2 -translate-y-1/2 rounded-full p-2 text-2xl text-gray-700 transition-transform duration-150 hover:scale-110 hover:text-black"
          onClick={showNext}
          type="button"
        >
          ›
        </button>
      </div>

      {selected && <PropertyModal onClose={() => setSelected(null)} property={selected} />}
      {showAuthModal && <AccountRequiredModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

const Rent = () => {
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
            id: Number.parseInt(doc.id, 10) || index + 1,
            title: title || `Listing ${index + 1}`,
            type,
            municipality,
            location,
            price: readNumber(data.price),
            currency: readString(data.currency) || "€",
            description: readString(data.description),
            image,
            url: readString(data.url),
            bedrooms: readNumber(data.bedrooms),
            area: readNumber(data.area),
            images: image ? [image] : undefined,
          } satisfies Property
        })

        setAllProperties(mapped)
        setDisplayProperties(mapped)
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
    setDisplayProperties(allProperties)
  }

  const handleSubmitFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const filtered = allProperties.filter((property) => matchesFilters(property, filterValues))
    setDisplayProperties(filtered)
  }

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
          </div>

          <form
            className="rounded-[40px] border border-black/5 bg-white px-8 py-6 shadow-sm"
            onSubmit={handleSubmitFilters}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              <label className="space-y-2 text-sm font-semibold text-gray-500">
                Property type
                <div className="relative rounded-[18px] border border-black/10">
                  <select
                    className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
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
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    ⌄
                  </span>
                </div>
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-500">
                Municipality
                <div className="relative rounded-[18px] border border-black/10">
                  <select
                    className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
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
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    ⌄
                  </span>
                </div>
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-500">
                Location
                <div className="relative rounded-[18px] border border-black/10">
                  <select
                    className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
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
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    ⌄
                  </span>
                </div>
              </label>

              <label className="space-y-2 text-sm font-semibold text-gray-500">
                Max. Price
                <div className="relative rounded-[18px] border border-black/10">
                  <select
                    className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
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
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    ⌄
                  </span>
                </div>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
              <button
                className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-semibold transition hover:bg-gray-50 hover:shadow-sm"
                onClick={handleResetFilters}
                type="button"
              >
                Clear
              </button>
              <button
                className="rounded-full bg-[#047857] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-95 hover:shadow-lg"
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
          ) : (
            <Carousel items={displayProperties} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

const readString = (value: unknown) => (typeof value === "string" ? value : "")

const readNumber = (value: unknown) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
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

const priceMatches = (price: number, range: string) => {
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

export default Rent
