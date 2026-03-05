import type { CSSProperties, KeyboardEvent } from "react"
import { useNavigate } from "react-router-dom"
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
  const canOpenDetail = Boolean(listing.id)

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

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleOpenDetail()
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
    <article
      className={`h-[430px] overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
        canOpenDetail ? "cursor-pointer" : "cursor-default"
      }`}
      onClick={handleOpenDetail}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="relative h-56 w-full bg-gray-200">
        {listing.image ? (
          <img
            alt={titleText}
            className="h-full w-full object-cover"
            src={listing.image}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-500">
            No image available
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.25em] text-indigo-600">
          FOR RENT
        </span>

        <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        </span>
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
          <span className="rounded-full border border-[#047857] px-3 py-1 text-xs font-semibold text-[#047857]">
            View
          </span>
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
