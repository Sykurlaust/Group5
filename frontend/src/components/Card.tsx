type CardProps = {
  title: string
  description: string
  imageUrl: string
  href: string
}

function Card({ title, description, imageUrl, href }: CardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="
        group block 
        rounded-[28px]
        border border-black/5
        bg-white
        p-8
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_16px_50px_rgba(0,0,0,0.12)]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-black/20
      "
    >
      {/* Logo container */}
      <div className="flex items-center justify-center">
        <img
          src={imageUrl}
          alt={title}
          className="
            h-14 w-auto
            object-contain
            transition-transform
            duration-300
            group-hover:scale-[1.03]
          "
        />
      </div>

      {/* Text */}
      <h2 className="mt-8 text-2xl font-semibold tracking-tight text-gray-900">
        {title}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>

      {/* Subtle “Learn more” affordance (optional but very Apple-like) */}
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-900">
        Learn more
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </a>
  )
}

export default Card