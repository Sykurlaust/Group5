import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import ListingCard from "../components/ListingCard"
import { db } from "../lib/firebase"

type FeaturedListing = {
  id: string
  title: string
  price: number | null
  currency: string
  bedrooms: number | null
  area: number | null
  image: string
  url: string
  clicks: number
}

const FEATURED_COUNT = 6

const heroImage =
	"src/assets/reiseuhu-W_7-oQmwyuw-unsplash.jpg"

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [featuredError, setFeaturedError] = useState("")

  useEffect(() => {
    const loadFeaturedListings = async () => {
      try {
        const topClicksQuery = query(
          collection(db, "listings"),
          orderBy("clicks", "desc"),
          limit(FEATURED_COUNT * 2),
        )
        const topClicksSnapshot = await getDocs(topClicksQuery)
        const rankedListings = topClicksSnapshot.docs
          .map((doc) => mapListingFromDoc(doc.id, doc.data()))
          .filter((listing) => isApartmentOnlyTitle(listing.title))

        let merged = [...rankedListings]
        if (merged.length < FEATURED_COUNT) {
          const fallbackSnapshot = await getDocs(query(collection(db, "listings"), limit(30)))
          const fallbackListings = fallbackSnapshot.docs
            .map((doc) => mapListingFromDoc(doc.id, doc.data()))
            .filter((listing) => isApartmentOnlyTitle(listing.title))

          const existingIds = new Set(merged.map((listing) => listing.id))
          for (const listing of fallbackListings) {
            if (existingIds.has(listing.id)) {
              continue
            }
            merged.push(listing)
            existingIds.add(listing.id)
          }
        }

        const featured = merged
          .sort((a, b) => b.clicks - a.clicks)
          .slice(0, FEATURED_COUNT)

        setFeaturedListings(featured)
      } catch (error) {
        console.error("Failed to load featured listings:", error)
        setFeaturedError("Could not load featured properties.")
      } finally {
        setLoadingFeatured(false)
      }
    }

    void loadFeaturedListings()
  }, [])

	return (
		<div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
			<Header />
			<main id="home">
			<section className="mx-auto mt-16 grid w-full max-w-7xl gap-12 px-6 grid-cols-2 items-stretch" id="rent">
				<div className="space-y-4 flex flex-col justify-center">
					<p className="text-base font-semibold text-[#1f1f1f]">Rent</p>
					<p className="text-xl leading-relaxed text-[#1f1f1f]">
						Long-term rental properties in Gran Canaria. A great selection of property to rent in the best locations of the island, and professional support for landlords.
					</p>
				</div>
				<div className="relative mx-auto h-80 w-full max-w-none overflow-hidden rounded-[36px]">
					<img alt="Gran Canaria cliffs" className="h-full w-full object-contain" src={heroImage} />
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-[#1f1f1f]">
						<div className="flex flex-col gap-3 text-5xl font-semibold uppercase tracking-tight drop-shadow-sm md:text-6xl">
							<span className="mx-auto rounded-[6px] bg-[#5fd0bb] px-6 py-2">Gran</span>
							<span className="mx-auto rounded-[6px] bg-[#5fd0bb] px-6 py-2">Canaria</span>
						</div>
						<p className="text-xs font-semibold uppercase tracking-[0.5em] text-white drop-shadow-lg">Collection</p>
					</div>
				</div>
			</section>

			<section className="mx-auto mt-16 max-w-6xl px-6 pb-16">
				<div className="text-center">
					<p className="text-sm uppercase tracking-[0.3em] text-gray-500">Featured properties</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#1f1f1f]">Featured Properties – Gran Canaria</h2>
				</div>

        {loadingFeatured ? (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            Loading featured properties...
          </div>
        ) : featuredError ? (
          <div className="mt-10 rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {featuredError}
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
            No featured properties yet.
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
				<div className="mt-12 flex justify-center">
					<div className="h-1 w-36 rounded-full bg-gray-300" />
				</div>
			</section>
		</main>

		<Footer />
		</div>
	)
}

const mapListingFromDoc = (id: string, data: Record<string, unknown>): FeaturedListing => {
  return {
    id,
    title: readString(data.title) || "Untitled listing",
    price: parsePrice(data.price),
    currency: readString(data.currency) || "€",
    bedrooms: readNullableNumber(data.bedrooms),
    area: readNullableNumber(data.area),
    image: readString(data.image),
    url: readString(data.url),
    clicks: readNumberWithDefault(data.clicks, 0),
  }
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

export default Home
