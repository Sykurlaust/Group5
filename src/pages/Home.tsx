import Header from "../components/Header"
import Footer from "../components/Footer"

type FeaturedProperty = {
	id: number
	tag: string
	title: string
	location: string
	price: string
}

const featuredProperties: FeaturedProperty[] = [
	{ id: 1, tag: "Local", title: "Oceanview Duplex", location: "Las Palmas", price: "€950/mo" },
	{ id: 2, tag: "Local", title: "Garden Villa", location: "Telde", price: "€890/mo" },
	{ id: 3, tag: "Local", title: "Historic Loft", location: "Arucas", price: "€780/mo" },
	{ id: 4, tag: "Local", title: "Coastal Retreat", location: "Maspalomas", price: "€1,050/mo" },
	{ id: 5, tag: "Local", title: "Mountain Hideout", location: "Tejeda", price: "€720/mo" },
	{ id: 6, tag: "Local", title: "City Penthouse", location: "Gáldar", price: "€1,120/mo" },
]

const heroImage =
	"src/assets/reiseuhu-W_7-oQmwyuw-unsplash.jpg"

const Home = () => {
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
					{featuredProperties.map((property) => (
						<article key={property.id} className="rounded-[34px] border border-black/5 bg-white shadow-sm">
							<div className="rounded-t-[34px] bg-gray-200 p-4">
								<div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-[#3f37f0]">
									<span>{property.tag}</span>
									<span>›</span>
								</div>
								<div className="mt-16 h-28 rounded-2xl bg-gradient-to-b from-gray-200 to-gray-300" />
							</div>
							<div className="rounded-b-[34px] bg-[#46a796] px-6 py-6 text-white">
								<p className="text-lg font-semibold">{property.title}</p>
								<p className="text-sm text-white/80">{property.location}</p>
								<p className="mt-4 text-xl font-semibold">{property.price}</p>
							</div>
						</article>
					))}
				</div>
				<div className="mt-12 flex justify-center">
					<div className="h-1 w-36 rounded-full bg-gray-300" />
				</div>
			</section>
		</main>
		<Footer />
		</div>
	)
}

export default Home
