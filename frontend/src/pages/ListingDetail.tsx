import { collection, doc, getDoc, getDocs, limit, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import ApplyCard from "../components/ApplyCard"
import ContactLandlordCard from "../components/ContactLandlordCard"
import Footer from "../components/Footer"
import Header from "../components/Header"
import SimilarListings from "../components/SimilarListings"
import type { SimilarListing } from "../components/SimilarListings"
import { db } from "../lib/firebase"

type ListingDetailData = {
  id: string
  title: string
  price: number | null
  currency: string
  bedrooms: number | null
  area: number | null
  type: string
  location: string
  municipality: string
  floor: string
  phone: string
  source: string
  availableFrom: string
  rentalPeriod: string
  deposit: string
  totalMoveInCost: string
  landlordName: string
  landlordImage: string
  description: string
  image: string
  url: string
}

type SimilarCandidate = SimilarListing & {
  type: string
  location: string
  municipality: string
  clicks: number
}

const ListingDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<ListingDetailData | null>(null)
  const [similarListings, setSimilarListings] = useState<SimilarListing[]>([])
  const [similarLoading, setSimilarLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Main listing fetch for the detail page.
    const loadListing = async () => {
      if (!id) {
        setError("Listing not found.")
        setLoading(false)
        return
      }

      try {
        const snapshot = await getDoc(doc(db, "listings", id))
        if (!snapshot.exists()) {
          setError("Listing not found.")
          return
        }

        const data = snapshot.data()
        setListing(mapDetailListingFromDoc(snapshot.id, data))
      } catch (loadError) {
        console.error("Failed to load listing:", loadError)
        setError("Could not load listing.")
      } finally {
        setLoading(false)
      }
    }

    void loadListing()
  }, [id])

  useEffect(() => {
    // Similar listings are fetched separately so this section remains reusable.
    const loadSimilarListings = async () => {
      if (!listing) {
        return
      }

      setSimilarLoading(true)
      try {
        const listingsSnapshot = await getDocs(query(collection(db, "listings"), limit(40)))
        const candidates = listingsSnapshot.docs
          .map((doc) => mapSimilarCandidateFromDoc(doc.id, doc.data()))
          .filter((candidate) => candidate.id !== listing.id)

        const ranked = candidates
          .map((candidate) => ({
            listing: candidate,
            score: calculateSimilarityScore(candidate, listing),
          }))
          .sort((a, b) => {
            if (b.score === a.score) {
              return b.listing.clicks - a.listing.clicks
            }
            return b.score - a.score
          })
          .slice(0, 4)
          .map((entry) => ({
            id: entry.listing.id,
            title: entry.listing.title,
            price: entry.listing.price,
            currency: entry.listing.currency,
            bedrooms: entry.listing.bedrooms,
            area: entry.listing.area,
            image: entry.listing.image,
            url: entry.listing.url,
          }))

        setSimilarListings(ranked)
      } catch (similarError) {
        console.error("Failed to load similar listings:", similarError)
        setSimilarListings([])
      } finally {
        setSimilarLoading(false)
      }
    }

    void loadSimilarListings()
  }, [listing])

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <Link className="mb-6 inline-flex items-center font-semibold text-emerald-700 hover:underline" to="/listings">
          ← Back to listings
        </Link>

        {loading ? (
          <div className="mt-6 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            Loading listing...
          </div>
        ) : error || !listing ? (
          <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {error || "Listing not found."}
          </div>
        ) : (
          <>
            <article className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm">
              <div className="h-72 w-full bg-gray-200 md:h-[420px]">
                {listing.image ? (
                  <img alt={listing.title} className="h-full w-full object-cover" src={listing.image} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8">
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="space-y-8">
                    <section>
                      <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                        {listing.title}
                      </h1>
                      <div className="mt-4 flex items-end gap-1">
                        <p className="text-4xl font-bold text-emerald-700">
                          {formatPriceAmount(listing.price, listing.currency)}
                        </p>
                        {listing.price !== null && (
                          <span className="pb-1 text-sm font-medium text-emerald-700/80">/month</span>
                        )}
                      </div>
                    </section>

                    {hasFacts(listing) && (
                      <section>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                          {listing.bedrooms !== null && (
                            <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bedrooms</p>
                              <p className="mt-2 text-base font-semibold text-gray-900">
                                {formatBedrooms(listing.bedrooms)}
                              </p>
                            </article>
                          )}

                          {listing.area !== null && (
                            <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Area</p>
                              <p className="mt-2 text-base font-semibold text-gray-900">{formatArea(listing.area)}</p>
                            </article>
                          )}

                          {listing.floor && (
                            <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Floor</p>
                              <p className="mt-2 text-base font-semibold text-gray-900">{listing.floor}</p>
                            </article>
                          )}

                        </div>
                      </section>
                    )}

                    {listing.description && (
                      <section>
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
                        <p className="text-base leading-8 text-gray-700">{listing.description}</p>
                      </section>
                    )}

                    {(listing.source || listing.url) && (
                      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
                        <p className="text-sm text-gray-600">
                          {listing.source ? `Source: ${formatSource(listing.source)}` : "Source: External listing"}
                        </p>

                        {listing.url && (
                          <button
                            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                            onClick={() => window.open(listing.url, "_blank", "noopener,noreferrer")}
                            type="button"
                          >
                            View original listing
                          </button>
                        )}
                      </section>
                    )}
                  </div>

                  <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                    <ApplyCard
                      availableFrom={listing.availableFrom || "Available now"}
                      deposit={listing.deposit || "Contact for details"}
                      monthlyRent={formatMonthlyRent(listing.price, listing.currency)}
                      onApply={() => navigate("/login")}
                      rentalPeriod={listing.rentalPeriod || "Flexible rental"}
                      totalMoveInCost={listing.totalMoveInCost || "Contact for details"}
                    />

                    <ContactLandlordCard
                      landlordImage={listing.landlordImage}
                      landlordName={listing.landlordName || "Property owner"}
                      onMessage={() => navigate("/login")}
                    />
                  </aside>
                </div>
              </div>
            </article>

            <SimilarListings listings={similarListings} loading={similarLoading} />
          </>
        )}
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

const mapDetailListingFromDoc = (id: string, data: Record<string, unknown>): ListingDetailData => {
  const title = readString(data.title) || "Untitled listing"
  const extracted = extractLocationParts(title)

  return {
    id,
    title,
    price: parsePrice(data.price),
    currency: readString(data.currency) || "€",
    bedrooms: readNullableNumber(data.bedrooms),
    area: readNullableNumber(data.area),
    type: readString(data.type) || detectPropertyType(title),
    location: readString(data.location) || extracted.location,
    municipality: readString(data.municipality) || extracted.municipality,
    floor: readString(data.floor),
    phone: readString(data.phone),
    source: readString(data.source),
    availableFrom: readString(data.availableFrom),
    rentalPeriod: readString(data.rentalPeriod),
    deposit: readString(data.deposit),
    totalMoveInCost: readString(data.totalMoveInCost),
    landlordName: readString(data.landlordName) || readString(data.ownerName) || readString(data.contactName),
    landlordImage: readString(data.landlordImage) || readString(data.ownerImage),
    description: readString(data.description),
    image: readString(data.image),
    url: readString(data.url),
  }
}

const mapSimilarCandidateFromDoc = (id: string, data: Record<string, unknown>): SimilarCandidate => {
  const title = readString(data.title) || "Untitled listing"
  const extracted = extractLocationParts(title)

  return {
    id,
    title,
    price: parsePrice(data.price),
    currency: readString(data.currency) || "€",
    bedrooms: readNullableNumber(data.bedrooms),
    area: readNullableNumber(data.area),
    image: readString(data.image),
    url: readString(data.url),
    type: readString(data.type) || detectPropertyType(title),
    location: readString(data.location) || extracted.location,
    municipality: readString(data.municipality) || extracted.municipality,
    clicks: readNumberWithDefault(data.clicks, 0),
  }
}

const readNumberWithDefault = (value: unknown, fallback: number) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback
  }
  if (typeof value !== "string") {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const formatPriceAmount = (price: number | null, currency: string) => {
  if (price === null) {
    return "Price on request"
  }
  return `${currency || "€"}${price.toLocaleString()}`
}

const formatBedrooms = (bedrooms: number) => {
  return bedrooms === 1 ? "1 bedroom" : `${bedrooms} bedrooms`
}

const formatArea = (area: number) => `${area} m²`

const formatMonthlyRent = (price: number | null, currency: string) => {
  if (price === null) {
    return "Contact for pricing"
  }
  return `${currency || "€"}${price.toLocaleString()}/month`
}

const hasFacts = (listing: ListingDetailData) => {
  return listing.bedrooms !== null || listing.area !== null || Boolean(listing.floor)
}

const formatSource = (source: string) => {
  const normalized = source.trim().toLowerCase()
  if (!normalized) return source
  if (normalized === "lobstr") return "Lobstr"
  if (normalized === "idealista") return "Idealista"
  return source
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

const calculateSimilarityScore = (candidate: SimilarCandidate, current: ListingDetailData) => {
  let score = 0

  if (candidate.location && current.location && candidate.location === current.location) {
    score += 4
  }
  if (candidate.municipality && current.municipality && candidate.municipality === current.municipality) {
    score += 3
  }
  if (candidate.type && current.type && candidate.type === current.type) {
    score += 2
  }

  if (candidate.price !== null && current.price !== null) {
    const difference = Math.abs(candidate.price - current.price)
    if (difference <= 200) score += 3
    else if (difference <= 400) score += 2
    else if (difference <= 700) score += 1
  }

  return score
}

export default ListingDetail
