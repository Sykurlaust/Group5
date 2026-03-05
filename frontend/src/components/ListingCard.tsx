import type { Listing } from "../types/listing"

type ListingCardProps = {
  listing: Listing
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <article className="overflow-hidden rounded-xl border border-black/5 bg-white shadow transition hover:shadow-lg">
      <img
        alt={listing.title || "Property image"}
        className="h-48 w-full object-cover"
        src={listing.image || "https://placehold.co/640x360?text=No+Image"}
      />
      <div className="space-y-3 p-4">
        <p className="text-xl font-semibold text-[#047857]">
          {listing.currency || "€"}
          {listing.price.toLocaleString()}
        </p>
        <h2 className="text-lg font-semibold text-[#1f1f1f]">{listing.title}</h2>
        <div className="flex gap-4 text-sm text-gray-600">
          <span>{listing.bedrooms || 0} bedrooms</span>
          <span>{listing.area || 0} m²</span>
        </div>
        <a
          className="inline-block rounded-full border border-[#047857] px-4 py-2 text-sm font-semibold text-[#047857] transition hover:bg-[#047857] hover:text-white"
          href={listing.url}
          rel="noreferrer"
          target="_blank"
        >
          View Original Listing
        </a>
      </div>
    </article>
  )
}

export default ListingCard
