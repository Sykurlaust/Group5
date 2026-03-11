import { collection, getDocs, limit, orderBy, query } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import HomepageSupportChatbot from "../components/HomepageSupportChatbot"
import ListingCard from "../components/ListingCard"
import heroImage from "../assets/reiseuhu-W_7-oQmwyuw-unsplash-hero.jpg"
import { db } from "../lib/firebase"

type HomeReview = {
  id: string
  userName: string
  userPhoto: string | null
  rating: number
  title: string
  comment: string
}

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

const FEATURED_COUNT = 3

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [featuredError, setFeaturedError] = useState("")
  const [homeReviews, setHomeReviews] = useState<HomeReview[]>([])

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

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(4))
        const snap = await getDocs(q)
        setHomeReviews(
          snap.docs.map((d) => {
            const data = d.data()
            return {
              id: d.id,
              userName: typeof data.userName === "string" ? data.userName : "Anonymous",
              userPhoto: typeof data.userPhoto === "string" ? data.userPhoto : null,
              rating: typeof data.rating === "number" ? data.rating : 5,
              title: typeof data.title === "string" ? data.title : "",
              comment: typeof data.comment === "string" ? data.comment : "",
            }
          }),
        )
      } catch {
        // ignore
      }
    }

    const timeoutId = window.setTimeout(() => {
      void loadReviews()
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [])

	return (
		<div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
			<Header />
      <HomepageSupportChatbot />
			<main id="home">
			<section className="mx-auto mt-10 grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:mt-14 lg:grid-cols-2 lg:gap-12" id="rent">
				<div className="order-2 space-y-4 lg:order-1">
					<p className="text-base font-semibold text-[#1f1f1f]">Rent</p>
					<p className="max-w-[26ch] text-3xl leading-relaxed text-[#1f1f1f] sm:text-4xl">
						Long-term rental properties in Gran Canaria. A great selection of property to rent in the best locations of the island, and professional support for landlords.
					</p>
				</div>
				<div className="relative order-1 mx-auto h-64 w-full overflow-hidden rounded-[28px] sm:h-80 lg:order-2 lg:h-[26rem]">
					<img
            alt="Gran Canaria cliffs"
            className="h-full w-full object-cover"
            decoding="async"
            fetchPriority="high"
            height={900}
            loading="eager"
            src={heroImage}
            width={1200}
          />
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-[#1f1f1f]">
						<div className="flex flex-col gap-3 text-4xl font-semibold uppercase tracking-tight drop-shadow-sm sm:text-5xl">
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

      {/* Reviews section */}
      <section className="mx-auto mt-8 max-w-6xl px-6 pb-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Testimonials</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#1f1f1f]">What our tenants say</h2>
        </div>

        {homeReviews.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white px-8 py-14 text-center shadow-sm">
            <span className="text-4xl">💬</span>
            <p className="text-lg font-semibold text-[#1f1f1f]">No reviews yet</p>
            <p className="max-w-xs text-sm text-gray-500">Be the first to share your experience finding a home in Gran Canaria.</p>
            <Link
              to="/reviews"
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-8 text-sm font-semibold text-white transition hover:bg-[#036c50]"
            >
              Write the first review
            </Link>
          </div>
        ) : (
          <>
            <div className={`mt-10 grid gap-6 ${
              homeReviews.length === 1 ? "grid-cols-1 max-w-sm mx-auto" :
              homeReviews.length === 2 ? "sm:grid-cols-2 max-w-2xl mx-auto" :
              homeReviews.length === 3 ? "sm:grid-cols-2 lg:grid-cols-3" :
              "sm:grid-cols-2 lg:grid-cols-4"
            }`}>
              {homeReviews.map((review) => (
                <article key={review.id} className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-amber-400" : "text-gray-200"}>★</span>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-[#1f1f1f]">{review.title}</p>
                  <p className="line-clamp-3 text-sm text-gray-600">{review.comment}</p>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    {review.userPhoto ? (
                      <img
                        alt={review.userName}
                        className="h-8 w-8 rounded-full object-cover"
                        decoding="async"
                        height={32}
                        loading="lazy"
                        src={review.userPhoto}
                        width={32}
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#047857] text-xs font-semibold text-white">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-700">{review.userName}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                to="/reviews"
                className="inline-flex h-11 items-center justify-center rounded-full border border-[#047857] px-8 text-sm font-semibold text-[#047857] transition hover:bg-[#047857] hover:text-white"
              >
                See all reviews
              </Link>
            </div>
          </>
        )}
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
