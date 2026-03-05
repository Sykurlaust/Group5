import { collection, getDocs, limit, query } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import ListingCard from "../components/ListingCard"
import { db } from "../lib/firebase"
import type { Listing } from "../types/listing"

const ITEMS_PER_PAGE = 9

const Listings = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"none" | "price-asc" | "price-desc">("none")
  const [minBedrooms, setMinBedrooms] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const listingsQuery = query(collection(db, "listings"), limit(30))
        const snapshot = await getDocs(listingsQuery)

        const fetchedListings = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            url: readString(data.url),
            title: readString(data.title),
            price: readNumber(data.price),
            currency: readString(data.currency),
            bedrooms: readNumber(data.bedrooms),
            area: readNumber(data.area),
            floor: readString(data.floor),
            description: readString(data.description),
            image: readString(data.image),
            phone: readString(data.phone),
          } satisfies Listing
        })

        setListings(fetchedListings)
      } catch (fetchError) {
        console.error("Failed to load listings:", fetchError)
        setError("Could not load listings from Firestore.")
      } finally {
        setLoading(false)
      }
    }

    void fetchListings()
  }, [])

  const filteredListings = useMemo(() => {
    const minBedroomsValue = minBedrooms.trim() === "" ? null : Number(minBedrooms)
    const maxPriceValue = maxPrice.trim() === "" ? null : Number(maxPrice)
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return listings
      .filter((listing) => {
        if (!normalizedSearch) {
          return true
        }
        return (
          listing.title.toLowerCase().includes(normalizedSearch) ||
          listing.description.toLowerCase().includes(normalizedSearch)
        )
      })
      .filter((listing) => (minBedroomsValue === null ? true : listing.bedrooms >= minBedroomsValue))
      .filter((listing) => (maxPriceValue === null ? true : listing.price <= maxPriceValue))
      .sort((a, b) => {
        if (sortOrder === "price-asc") {
          return a.price - b.price
        }
        if (sortOrder === "price-desc") {
          return b.price - a.price
        }
        return 0
      })
  }, [listings, searchTerm, minBedrooms, maxPrice, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE))

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortOrder, minBedrooms, maxPrice])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredListings.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, filteredListings])

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10">
        <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold">Property Listings</h1>
          <p className="mt-2 text-sm text-gray-500">Browse rentals pulled from Firestore.</p>

          <div className="mt-6 grid gap-3 md:grid-cols-4">
            <input
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#047857]"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search title or description"
              value={searchTerm}
            />

            <select
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#047857]"
              onChange={(event) =>
                setSortOrder(event.target.value as "none" | "price-asc" | "price-desc")
              }
              value={sortOrder}
            >
              <option value="none">Sort: default</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>

            <input
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#047857]"
              min="0"
              onChange={(event) => setMinBedrooms(event.target.value)}
              placeholder="Min bedrooms"
              type="number"
              value={minBedrooms}
            />

            <input
              className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-[#047857]"
              min="0"
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="Max price"
              type="number"
              value={maxPrice}
            />
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-xl border border-black/5 bg-white p-8 text-center shadow-sm">
            Loading listings...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {error}
          </div>
        ) : (
          <>
            <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </section>

            {filteredListings.length === 0 && (
              <div className="mt-8 rounded-xl border border-black/5 bg-white p-8 text-center shadow-sm">
                No listings matched your search and filters.
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => page - 1)}
                type="button"
              >
                Previous
              </button>
              <p className="text-sm font-semibold text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <button
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => page + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </>
        )}
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

export default Listings
