import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

type MunicipalityConfig = {
	name: string
	locations: string[]
}

const propertyTypes = [
	"Apartment",
	"Penthouse",
	"Villa",
	"Townhouse",
	"Rural house",
	"Studio",
]

const municipalities: MunicipalityConfig[] = [
	{
		name: "Las Palmas de Gran Canaria",
		locations: ["Vegueta", "Triana", "Ciudad Jardín", "Las Canteras"],
	},
	{ name: "Telde", locations: ["San Juan", "La Garita", "Salinetas"] },
	{ name: "Santa Brígida", locations: ["Los Olivos", "Monte Lentiscal"] },
	{ name: "Arucas", locations: ["Casco", "Bañaderos", "Cardones"] },
	{ name: "Gáldar", locations: ["Casco", "Sardina", "Barrial"] },
	{ name: "Maspalomas", locations: ["Meloneras", "Playa del Inglés", "San Fernando"] },
	{ name: "Mogán", locations: ["Puerto Rico", "Arguineguín", "Playa de Mogán"] },
	{ name: "Agaete", locations: ["Puerto de las Nieves", "Valle de Agaete"] },
	{ name: "Tejeda", locations: ["Casco", "La Culata"] },
	{ name: "San Bartolomé de Tirajana", locations: ["Fataga", "Tunte"] },
]

const priceRanges = [
	"Any price",
	"Up to €600",
	"€600 - €800",
	"€800 - €1,000",
	"€1,000 - €1,200",
	"€1,200+",
]

type FilterState = {
	propertyType: string
	municipality: string
	location: string
	maxPrice: string
}

const initialFilters: FilterState = {
	propertyType: propertyTypes[0],
	municipality: municipalities[0].name,
	location: municipalities[0].locations[0],
	maxPrice: priceRanges[0],
}

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
	"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"

const Home = () => {
	const [filterValues, setFilterValues] = useState<FilterState>(() => ({ ...initialFilters }))
	const selectedMunicipality =
		municipalities.find((entry) => entry.name === filterValues.municipality) ?? municipalities[0]

	useEffect(() => {
		if (selectedMunicipality.locations.includes(filterValues.location)) {
			return
		}
		setFilterValues((prev) => ({ ...prev, location: selectedMunicipality.locations[0] }))
	}, [filterValues.location, filterValues.municipality, selectedMunicipality])

	const handleSelectChange = (field: keyof FilterState) => (event: ChangeEvent<HTMLSelectElement>) => {
		setFilterValues((prev) => ({ ...prev, [field]: event.target.value }))
	}

	const handleResetFilters = () => setFilterValues({ ...initialFilters })

	const handleSubmitFilters = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		// TODO: replace console output with real filtering once backend/search is wired
		console.table(filterValues)
	}

	return (
		<div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
			<Header />
			<main id="home">
			<section className="mx-auto mt-10 max-w-6xl px-6">
				<form className="rounded-[40px] border border-black/5 bg-white px-8 py-6 shadow-sm" onSubmit={handleSubmitFilters}>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
						<label className="space-y-2 text-sm font-semibold text-gray-500">
							Property type
							<div className="relative rounded-[18px] border border-black/10">
								<select
									className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
									value={filterValues.propertyType}
									onChange={handleSelectChange("propertyType")}
								>
									{propertyTypes.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
								<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">⌄</span>
							</div>
						</label>
						<label className="space-y-2 text-sm font-semibold text-gray-500">
							Municipality
							<div className="relative rounded-[18px] border border-black/10">
								<select
									className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
									value={filterValues.municipality}
									onChange={handleSelectChange("municipality")}
								>
									{municipalities.map((municipality) => (
										<option key={municipality.name} value={municipality.name}>
											{municipality.name}
										</option>
									))}
								</select>
								<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">⌄</span>
							</div>
						</label>
						<label className="space-y-2 text-sm font-semibold text-gray-500">
							Location
							<div className="relative rounded-[18px] border border-black/10">
								<select
									className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
									value={filterValues.location}
									onChange={handleSelectChange("location")}
								>
									{selectedMunicipality.locations.map((locationOption) => (
										<option key={locationOption} value={locationOption}>
											{locationOption}
										</option>
									))}
								</select>
								<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">⌄</span>
							</div>
						</label>
						<label className="space-y-2 text-sm font-semibold text-gray-500">
							Max. Price
							<div className="relative rounded-[18px] border border-black/10">
								<select
									className="w-full appearance-none rounded-[18px] bg-transparent px-4 py-3 text-sm text-gray-700 focus:outline-none"
									value={filterValues.maxPrice}
									onChange={handleSelectChange("maxPrice")}
								>
									{priceRanges.map((range) => (
										<option key={range} value={range}>
											{range}
										</option>
									))}
								</select>
								<span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">⌄</span>
							</div>
						</label>
					</div>
					<div className="mt-6 flex flex-wrap items-center justify-end gap-4">
						<button
							className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-semibold"
							onClick={handleResetFilters}
							type="button"
						>
							Clear
						</button>
						<button className="rounded-full bg-[#46a796] px-5 py-2 text-sm font-semibold text-white" type="submit">
							Search
						</button>
					</div>
				</form>
			</section>

			<section className="mx-auto mt-16 grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-[1.1fr,1fr] lg:items-stretch" id="rent">
				<div className="space-y-4">
					<p className="text-base font-semibold text-[#1f1f1f]">Rent</p>
					<p className="text-xl leading-relaxed text-[#1f1f1f]">
						Long-term rental properties in Gran Canaria. A great selection of property to rent in the best locations of the island, and professional support for landlords.
					</p>
				</div>
				<div className="relative mx-auto h-80 w-full max-w-none overflow-hidden rounded-[36px] sm:h-96 lg:h-[420px]">
					<img alt="Gran Canaria cliffs" className="h-full w-full object-cover" src={heroImage} />
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
