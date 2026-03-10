import { Helmet } from "react-helmet-async"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer"
import Header from "../../components/Header"
import ListingCard from "../../components/ListingCard"
import { useAuth } from "../../context/AuthContext"
import { db } from "../../lib/firebase"
import { FAVORITES_UPDATED_EVENT, getFavoriteListingIds } from "../../lib/favorites"

type FavoriteListing = {
  id: string
  title: string
  price: number | null
  currency?: string
  bedrooms?: number | null
  area?: number | null
  image?: string
  url: string
}

const RenterDashboard = () => {
  const { firebaseUser } = useAuth()
  const [favoriteListings, setFavoriteListings] = useState<FavoriteListing[]>([])
  const [loading, setLoading] = useState(false)

  const favoriteCount = useMemo(() => favoriteListings.length, [favoriteListings])

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setFavoriteListings([])
      return
    }

    const loadFavorites = async () => {
      setLoading(true)
      try {
        const favoriteIds = getFavoriteListingIds(firebaseUser.uid)
        if (favoriteIds.length === 0) {
          setFavoriteListings([])
          return
        }

        const docs = await Promise.all(favoriteIds.map((id) => getDoc(doc(db, "listings", id))))
        const nextListings = docs
          .filter((snapshot) => snapshot.exists())
          .map((snapshot) => {
            const data = snapshot.data()
            return {
              id: snapshot.id,
              title: readString(data.title) || "Untitled listing",
              price: parsePrice(data.price),
              currency: readString(data.currency) || "€",
              bedrooms: readNullableNumber(data.bedrooms),
              area: readNullableNumber(data.area),
              image: readString(data.image),
              url: readString(data.url),
            } satisfies FavoriteListing
          })

        const idsInStorageOrder = new Map(favoriteIds.map((id, index) => [id, index]))
        nextListings.sort((a, b) => (idsInStorageOrder.get(a.id) ?? 0) - (idsInStorageOrder.get(b.id) ?? 0))
        setFavoriteListings(nextListings)
      } finally {
        setLoading(false)
      }
    }

    void loadFavorites()

    const handleFavoritesUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ uid?: string }>
      if (customEvent.detail?.uid === firebaseUser.uid) {
        void loadFavorites()
      }
    }

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated)
    return () => window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated)
  }, [firebaseUser?.uid])

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Helmet>
        <title>Favorited | GC-Renting</title>
      </Helmet>
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <div className="w-full space-y-6">
          <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-[#1f1f1f] md:text-3xl">Favorited</h1>
            <p className="mt-2 text-sm text-gray-600">
              You currently have {favoriteCount} home{favoriteCount === 1 ? "" : "s"} in your favorites.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center rounded-full border border-[#047857] bg-[#047857] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#036c50]"
                to="/messages"
              >
                Messages
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-[#047857] px-5 py-2.5 text-sm font-semibold text-[#047857] transition hover:bg-[#047857]/10"
                to="/apply"
              >
                Apply to be a renter
              </Link>
            </div>
          </section>

          {loading ? (
            <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              Loading your favorited homes...
            </div>
          ) : favoriteListings.length === 0 ? (
            <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
              You do not have any favorited listings yet. Browse listings and tap the star icon to save homes.
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favoriteListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </section>
          )}
        </div>
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

export default RenterDashboard
