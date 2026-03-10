import ListingCard from "./ListingCard"

export type SimilarListing = {
  id: string
  title: string
  price: number | null
  currency: string
  bedrooms: number | null
  area: number | null
  image: string
  url: string
}

type SimilarListingsProps = {
  listings: SimilarListing[]
  loading: boolean
}

const SimilarListings = ({ listings, loading }: SimilarListingsProps) => {
  return (
    <section className="mt-10">
      <h2 className="mb-5 text-2xl font-semibold text-gray-900">Similar listings</h2>

      {loading ? (
        <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
          Loading similar listings...
        </div>
      ) : listings.length === 0 ? (
        <div className="rounded-3xl border border-black/5 bg-white p-8 text-center shadow-sm">
          No similar listings available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </section>
  )
}

export default SimilarListings
