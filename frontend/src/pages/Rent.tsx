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

const Rent = () => {
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

			<main className="mx-auto max-w-6xl px-6">
				<section className="mt-12 mb-12">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-semibold mb-3">Find your property</h1>
						<p className="text-lg text-gray-600">Search through our available rental properties in Gran Canaria</p>
					</div>

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

				<section className="pb-16">
					<div className="mb-8">
						<h2 className="text-2xl font-semibold mb-2">Available Properties</h2>
						<p className="text-gray-600">Browse the latest rental listings</p>
					</div>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{Array.from({ length: 6 }).map((_, idx) => (
							<div
								key={idx}
								className="relative rounded-[34px] overflow-hidden shadow-sm bg-white hover:shadow-md transition-shadow"
							>
								<div className="h-40 bg-gray-200" />
								<div className="h-24 bg-[#46a796]" />
								<span className="absolute top-2 left-2 bg-[#3f37f0] text-white text-xs px-2 py-1 rounded">
									For rent
								</span>
								<div className="absolute right-2 top-2 text-white font-bold">
									&rsaquo;
								</div>
							</div>
						))}
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default Rent