import type { CSSProperties, MouseEvent } from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { FAVORITES_UPDATED_EVENT, isListingFavorited, toggleFavoriteListing } from "../lib/favorites"
import { incrementListingClicks } from "../lib/listingClicks"

type ListingCardData = {
  id: string | number
  url: string
  title: string
  price: number | null
  currency?: string
  bedrooms?: number | null
  area?: number | null
  image?: string
}

type ListingCardProps = {
  listing: ListingCardData
  onCardClick?: (listingId: string) => void | Promise<void>
}

const ListingCard = ({ listing, onCardClick }: ListingCardProps) => {
  const navigate = useNavigate()
  const { firebaseUser } = useAuth()
  const canOpenDetail = Boolean(listing.id)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    if (!firebaseUser?.uid || !listing.id) {
      setIsFavorited(false)
      return
    }

    void isListingFavorited(firebaseUser.uid, String(listing.id)).then(setIsFavorited)

    const handleFavoritesUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ uid?: string }>
      if (customEvent.detail?.uid !== firebaseUser.uid) {
        return
      }
      void isListingFavorited(firebaseUser.uid, String(listing.id)).then(setIsFavorited)
    }

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated)
    return () => window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavoritesUpdated)
  }, [firebaseUser?.uid, listing.id])

  const handleOpenDetail = () => {
    if (!canOpenDetail) {
      return
    }
    const trackClick = onCardClick ?? incrementListingClicks
    void Promise.resolve(trackClick(String(listing.id))).catch((error: unknown) => {
      console.error("Could not increment listing clicks:", error)
    })
    navigate(`/listings/${listing.id}`)
  }

  const handleViewClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    handleOpenDetail()
  }

  const handleFavoriteToggle = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (!listing.id) {
      return
    }
    if (!firebaseUser?.uid) {
      navigate("/login")
      return
    }
    if (isToggling) return
    setIsToggling(true)
    try {
      const nextState = await toggleFavoriteListing(firebaseUser.uid, String(listing.id))
      setIsFavorited(nextState)
    } finally {
      setIsToggling(false)
    }
  }

  const titleText = listing.title || "Untitled listing"
  const bedroomsText = typeof listing.bedrooms === "number" ? `${listing.bedrooms} bedrooms` : "Bedrooms n/a"
  const areaText = typeof listing.area === "number" ? `${listing.area} m²` : "Area n/a"
  const priceText =
    listing.price === null
      ? "Price on request"
      : `${listing.currency || "€"}${listing.price.toLocaleString()}/month`

  return (
    <article className="h-[430px] overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative h-56 w-full bg-gray-200">
        {listing.image ? (
          <img
            alt=""
            className="h-full w-full object-cover"
            decoding="async"
            height={224}
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            src={listing.image}
            width={400}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
            No image available
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-indigo-600">
          FOR RENT
        </span>

        <button
          aria-label={isFavorited ? "Remove from favorited homes" : "Add to favorited homes"}
          className={`absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
            isFavorited ? "bg-amber-400 text-amber-900" : "bg-white/90 text-gray-600 hover:bg-white"
          }`}
          onClick={handleFavoriteToggle}
          disabled={isToggling}
          type="button"
        >
          <svg className="h-5 w-5" fill={isFavorited ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </button>
      </div>

      <div className="flex h-[206px] flex-col p-5">
        <h2 className="text-lg font-semibold text-[#1f1f1f]" style={twoLineClampStyle}>
          {titleText}
        </h2>

        <p className="mt-3 truncate text-sm text-gray-600">
          {bedroomsText} • {areaText}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <p className="text-lg font-semibold text-[#047857]">{priceText}</p>
          <button
            className="inline-flex items-center justify-center rounded-full border border-emerald-700 bg-white px-6 py-2 text-xs font-semibold text-emerald-700 transition-colors duration-200 hover:bg-emerald-700 hover:text-white"
            disabled={!canOpenDetail}
            onClick={handleViewClick}
            type="button"
          >
            View
          </button>
        </div>
      </div>
    </article>
  )
}

const twoLineClampStyle: CSSProperties = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
}

export default ListingCard
