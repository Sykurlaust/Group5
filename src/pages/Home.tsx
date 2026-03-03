type FilterConfig = {
	label: string
	placeholder: string
}

const filters: FilterConfig[] = [
	{ label: "Property type", placeholder: "Any property" },
	{ label: "Municipality", placeholder: "All municipalities" },
	{ label: "Location", placeholder: "Artenara" },
	{ label: "Max. Price", placeholder: "Any price" },
]

type FeaturedProperty = {
	id: number
	tag: string
	title: string
	location: string
	price: string
}

const featuredProperties: FeaturedProperty[] = [
	{ id: 1, tag: "New", title: "Oceanview Duplex", location: "Las Palmas", price: "€1,450/mo" },
	{ id: 2, tag: "New", title: "Garden Villa", location: "Telde", price: "€1,320/mo" },
	{ id: 3, tag: "New", title: "Historic Loft", location: "Arucas", price: "€1,180/mo" },
	{ id: 4, tag: "New", title: "Coastal Retreat", location: "Maspalomas", price: "€1,560/mo" },
	{ id: 5, tag: "New", title: "Mountain Hideout", location: "Tejeda", price: "€1,040/mo" },
	{ id: 6, tag: "New", title: "City Penthouse", location: "Gáldar", price: "€1,610/mo" },
]

const heroImage =
	"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"

const Home = () => {
	return (
		<main id="home">
			<section className="mx-auto mt-10 max-w-6xl px-6">
				<div className="rounded-[40px] border border-black/5 bg-white px-8 py-6 shadow-sm">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
						{filters.map((filter) => (
							<div key={filter.label} className="space-y-2">
								<p className="text-sm font-semibold text-gray-500">{filter.label}</p>
								<div className="flex items-center justify-between rounded-[18px] border border-black/10 px-4 py-3 text-sm">
									<span className="text-gray-700">{filter.placeholder}</span>
									<span className="text-gray-400">⌄</span>
								</div>
							</div>
						))}
					</div>
					<div className="mt-6 flex flex-wrap items-center justify-end gap-4">
						<button className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-semibold">Filter</button>
						<button className="flex items-center gap-2 rounded-full bg-[#2dbe8b] px-5 py-2 text-sm font-semibold text-white">
							<span role="img" aria-label="search">

							</span>
							Search
						</button>
					</div>
				</div>
			</section>

			<section className="mx-auto mt-12 grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr,1.1fr]" id="rent">
				<div>
					<p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">Rent</p>
					<h1 className="mt-4 text-4xl font-semibold leading-tight text-[#1f1f1f]">
						Long-term rental properties in Gran Canaria.
					</h1>
					<p className="mt-4 text-lg text-gray-600">
						A great selection of property to rent in the best locations of the island, and professional support for landlords.
					</p>
				</div>
				<div className="relative overflow-hidden rounded-[40px]">
					<img alt="Gran Canaria coast" className="h-full w-full object-cover" src={heroImage} />
					<div className="absolute bottom-8 left-8 rounded-[30px] bg-white/85 px-8 py-5 text-[#1f1f1f]">
						<p className="text-sm uppercase tracking-[0.5em] text-gray-500">GC</p>
						<p className="text-4xl font-semibold">GC-Renting</p>
						<p className="mt-1 text-xs uppercase tracking-[0.4em] text-gray-400">Premium Rentals</p>
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
							<div className="rounded-b-[34px] bg-[#2dbe8b] px-6 py-6 text-white">
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
	)
}

export default Home
