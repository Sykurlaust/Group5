import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PropertyModal from "../components/PropertyModal"

type FeaturedProperty = {
	id: number
	tag: string
	title: string
	location: string
	municipality: string
	price: number
	type: string
	images?: string[]
}

const featuredProperties: FeaturedProperty[] = [
	{ id: 1, tag: "Featured", title: "Oceanview Duplex", location: "Las Palmas", municipality: "Las Palmas", price: 950, type: "Duplex" },
	{ id: 2, tag: "Featured", title: "Garden Villa", location: "Telde", municipality: "Telde", price: 890, type: "Villa" },
	{ id: 3, tag: "Featured", title: "Historic Loft", location: "Arucas", municipality: "Arucas", price: 780, type: "Loft" },
	{ id: 4, tag: "Featured", title: "Coastal Retreat", location: "Maspalomas", municipality: "San Bartolomé de Tirajana", price: 1050, type: "House" },
	{ id: 5, tag: "Featured", title: "Mountain Hideout", location: "Tejeda", municipality: "Tejeda", price: 720, type: "Cottage" },
	{ id: 6, tag: "Featured", title: "City Penthouse", location: "Gáldar", municipality: "Gáldar", price: 1120, type: "Penthouse" },
]

const featuredImageQueries: Record<string, string> = {
	Duplex: "duplex,building,architecture",
	Villa: "villa,house,architecture",
	Loft: "loft,interior,architecture",
	House: "house,modern,architecture",
	Cottage: "cottage,rustic,house",
	Penthouse: "penthouse,skyline,building",
}

const createFeaturedImages = (type: string, seed: number) => {
	const query = featuredImageQueries[type] ?? "house,architecture"
	return Array.from({ length: 3 }, (_, idx) => `https://loremflickr.com/640/480/${query}?lock=${seed * 3 + idx}`)
}

const featuredPropertiesWithImages: FeaturedProperty[] = featuredProperties.map((property) => ({
	...property,
	images: property.images ?? createFeaturedImages(property.type, property.id),
}))

const heroImage =
	"src/assets/reiseuhu-W_7-oQmwyuw-unsplash.jpg"

const Home = () => {
	const [selectedProperty, setSelectedProperty] = useState<FeaturedProperty | null>(null)
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
					<h2 className="mt-2 text-3xl font-semibold text-[#1f1f1f]">Gran Canaria</h2>
				</div>
				<div className="mt-10 grid gap-8 md:grid-cols-3">
					{featuredPropertiesWithImages.map((property) => (
						<article
							key={property.id}
							onClick={() => setSelectedProperty(property)}
							className="rounded-[34px] border border-black/5 bg-white shadow-sm cursor-pointer hover:shadow-lg transition overflow-hidden flex flex-col"
						>
							<div className="relative h-48 w-full">
								{property.images?.[0] ? (
									<img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />
								) : (
									<div className="h-full w-full bg-gradient-to-b from-gray-200 to-gray-300" />
								)}
								<div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white bg-gradient-to-b from-black/60 to-transparent">
									<span>{property.tag}</span>
									<span>›</span>
								</div>
							</div>
							<div className="rounded-b-[34px] bg-[#047857] px-6 py-6 text-white flex flex-col gap-2 flex-1 justify-between">
								<div>
									<p className="text-lg font-semibold">{property.title}</p>
									<p className="text-sm text-white/80">{property.location}</p>
								</div>
								<p className="text-xl font-semibold">€{property.price.toLocaleString()}/mo</p>
							</div>
						</article>
					))}
				</div>
				<div className="mt-12 flex justify-center">
					<div className="h-1 w-36 rounded-full bg-gray-300" />
				</div>
			</section>
		</main>

		{selectedProperty && (
			<PropertyModal
				property={selectedProperty}
				onClose={() => setSelectedProperty(null)}
			/>
		)}

		<Footer />
		</div>
	)
}

export default Home
