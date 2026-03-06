import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { db } from "../lib/firebase"

type ListingDetailData = {
  title: string
  price: number | null
  currency: string
  bedrooms: number | null
  area: number | null
  floor: string
  phone: string
  source: string
  description: string
  image: string
  url: string
}

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>()
  const [listing, setListing] = useState<ListingDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
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
        setListing({
          title: readString(data.title) || "Untitled listing",
          price: parsePrice(data.price),
          currency: readString(data.currency) || "€",
          bedrooms: readNullableNumber(data.bedrooms),
          area: readNullableNumber(data.area),
          floor: readString(data.floor),
          phone: readString(data.phone),
          source: readString(data.source),
          description: readString(data.description),
          image: readString(data.image),
          url: readString(data.url),
        })
      } catch (loadError) {
        console.error("Failed to load listing:", loadError)
        setError("Could not load listing.")
      } finally {
        setLoading(false)
      }
    }

    void loadListing()
  }, [id])

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

            <div className="space-y-8 p-6 md:p-8">
              <section>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                  {listing.title}
                </h1>
                <div className="mt-4 flex items-end gap-1">
                  <p className="text-4xl font-bold text-emerald-700">
                    {formatPriceAmount(listing.price, listing.currency)}
                  </p>
                  {listing.price !== null && <span className="pb-1 text-sm font-medium text-emerald-700/80">/month</span>}
                </div>
              </section>

              {hasFacts(listing) && (
                <section>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {listing.bedrooms !== null && (
                      <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bedrooms</p>
                        <p className="mt-2 text-base font-semibold text-gray-900">
                          {formatBedrooms(listing.bedrooms)}
                        </p>
                      </article>
                    )}

                    {listing.area !== null && (
                      <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Area</p>
                        <p className="mt-2 text-base font-semibold text-gray-900">{formatArea(listing.area)}</p>
                      </article>
                    )}

                    {listing.floor && (
                      <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Floor</p>
                        <p className="mt-2 text-base font-semibold text-gray-900">{listing.floor}</p>
                      </article>
                    )}

                    {listing.phone && (
                      <article className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phone</p>
                        <p className="mt-2 text-base font-semibold text-gray-900">{listing.phone}</p>
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
          </article>
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

const hasFacts = (listing: ListingDetailData) => {
  return listing.bedrooms !== null || listing.area !== null || Boolean(listing.floor) || Boolean(listing.phone)
}

const formatSource = (source: string) => {
  const normalized = source.trim().toLowerCase()
  if (!normalized) return source
  if (normalized === "lobstr") return "Lobstr"
  if (normalized === "idealista") return "Idealista"
  return source
}

export default ListingDetail
