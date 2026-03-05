interface FeaturedPropertyCardProps {
  tag: string
  title: string
  location: string
  price: number
  onClick: () => void
}

const FeaturedPropertyCard = ({ tag, title, location, price, onClick }: FeaturedPropertyCardProps) => {
  return (
    <article
      onClick={onClick}
      className="rounded-[34px] border border-black/5 bg-white shadow-sm cursor-pointer hover:shadow-md transition"
    >
      <div className="rounded-t-[34px] bg-gray-200 p-4">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#3f37f0]">
          <span>{tag}</span>
          <span>›</span>
        </div>
        <div className="mt-16 h-28 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-300" />
      </div>
      <div className="rounded-b-[34px] bg-[#047857] px-6 py-6 text-white">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-sm text-white/80">{location}</p>
        <p className="mt-4 text-xl font-semibold">€{price.toLocaleString()}/mo</p>
      </div>
    </article>
  )
}

export default FeaturedPropertyCard
