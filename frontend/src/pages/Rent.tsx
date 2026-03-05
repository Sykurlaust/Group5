import { useEffect, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { onAuthStateChanged, type User } from "firebase/auth"
import Header from "../components/Header"
import Footer from "../components/Footer"
import PropertyModal from "../components/PropertyModal"
import AccountRequiredModal from "../components/AccountRequiredModal"
import { auth } from "../services/firebase"


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

const imageQueries: Record<string, string> = {
	"Apartment": "apartment,building,architecture",
	"Penthouse": "penthouse,roof,architecture",
	"Villa": "villa,house,architecture",
	"Townhouse": "townhouse,building",
	"Rural house": "rural,house,architecture",
	"Studio": "studio,apartment,building",
}

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
	propertyType: "",
	municipality: "",
	location: "",
	maxPrice: "",
}

type Property = {
	id: number
	title: string
	type: string
	municipality: string
	location: string
	price: number
	images: string[]
}

type CarouselProps = {
	items?: Property[]
	isLoggedIn: boolean
	onRequireAccount: () => void
}

const Carousel = ({ items, isLoggedIn, onRequireAccount }: CarouselProps) => {
	const ITEMS_PER_SLIDE = 6
	const [slideIdx, setSlideIdx] = useState(0)

	// determine data source
	const properties = items || []

	const slides = Math.max(1, Math.ceil(properties.length / ITEMS_PER_SLIDE))

	// ensure slideIdx stays valid when properties change
	useEffect(() => {
		if (slideIdx >= Math.ceil(properties.length / ITEMS_PER_SLIDE)) {
			setSlideIdx(0)
		}
	}, [properties, slideIdx])

	const showPrev = () => setSlideIdx((s) => (s - 1 + slides) % slides)
	const showNext = () => setSlideIdx((s) => (s + 1) % slides)

	// compute items for current slide
	const start = slideIdx * ITEMS_PER_SLIDE
	const currentItems = properties.slice(start, start + ITEMS_PER_SLIDE)

	const [selected, setSelected] = useState<Property | null>(null)

	const [favorites, setFavorites] = useState<number[]>([])

	const toggleFavorite = (p: Property, e?: any) => {
		if (e) e.stopPropagation()
		if (!isLoggedIn) {
			onRequireAccount()
			return
		}
		setFavorites((prev) => (prev.includes(p.id) ? prev.filter((id) => id !== p.id) : [...prev, p.id]))
	}

	const isFavorited = (id: number) => favorites.includes(id)

	return (
		<div className="relative flex items-center justify-center">
			<div className="w-full max-w-5xl relative">
				<button
					aria-label="previous"
					onClick={showPrev}
					className="absolute -left-8 top-1/2 -translate-y-1/2 p-2 text-2xl text-gray-700 hover:text-black hover:scale-110 transition-transform duration-150 rounded-full"
				>
					‹
				</button>

				<div className="grid grid-cols-3 gap-6">
					{currentItems.map((p) => (
						<article
							key={p.id}
							className="relative group rounded-[34px] border border-black/5 bg-white shadow-sm overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)] h-[340px] flex flex-col"
							onClick={() => setSelected(p)}
						>
							<button
								onClick={(e) => toggleFavorite(p, e)}
								aria-label={isFavorited(p.id) ? "Remove favorite" : "Add favorite"}
								className="absolute right-4 top-4 z-30 rounded-full bg-white/90 p-2 text-gray-600 shadow-sm hover:scale-105 transition"
							>
								{isFavorited(p.id) ? (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 text-yellow-400" fill="currentColor">
										<path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.554L18.9 24 12 20.013 5.1 24l1.2-8.696L.6 9.75l7.732-1.732z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}>
										<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
									</svg>
								)}
							</button>
							{/* Top visual area */}
							<div className="relative flex-1 min-h-[200px] rounded-t-[34px] overflow-hidden">
								<img src={p.images[0]} alt={p.title} className="h-full w-full object-cover" />
								<div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 pr-12 text-xs font-semibold uppercase tracking-[0.3em] text-white bg-gradient-to-b from-black/60 to-transparent">
									<span>For rent</span>
									<span>›</span>
								</div>
							</div>
							{/* Footer */}
							<div className="rounded-b-[34px] bg-[#047857] px-6 py-5 text-white min-h-[120px] flex flex-col justify-between">
								<p className="text-lg font-semibold truncate">{p.title}</p>
								<p className="text-sm text-white/80 truncate">{p.location}</p>
								<p className="text-2xl font-semibold">€{p.price}/month</p>
							</div>
						</article>
					))}
					{/* fill empty slots if fewer than ITEMS_PER_SLIDE items in this slide */}
					{Array.from({ length: Math.max(0, ITEMS_PER_SLIDE - currentItems.length) }).map((_, i) => (
						<div
							key={`empty-${i}`}
							className="group rounded-[34px] border border-dashed border-gray-200 bg-white shadow-sm flex flex-col items-center justify-center p-6 text-center h-[340px]"
						>
							<svg
								className="w-12 h-12 text-gray-300 mb-3"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<path d="M12 15V3" />
							</svg>
							<p className="text-sm font-semibold text-gray-700">
								We couldn't find any properties
								<span role="img" aria-label="sad face" className="ml-2">😞</span>
							</p>
							<p className="mt-1 text-xs text-gray-500">Try clearing your filters or check back soon  new listings arrive regularly.</p>
						</div>
					))}
				</div>

				<button
					aria-label="next"
					onClick={showNext}
					className="absolute -right-8 top-1/2 -translate-y-1/2 p-2 text-2xl text-gray-700 hover:text-black hover:scale-110 transition-transform duration-150 rounded-full"
				>
					›
				</button>
			</div>

			{selected && <PropertyModal property={selected} onClose={() => setSelected(null)} />}
		</div>
	)
}

// Generate 150 properties covering various combinations
const generateProperties = (): Property[] => {
	const properties: Property[] = []
	let id = 0
	const priceBases = [550, 650, 850, 1050, 1250, 1450] // bases for different ranges

	for (let i = 0; i < 150; i++) {
		const typeIdx = i % propertyTypes.length
		const muniIdx = Math.floor(i / propertyTypes.length) % municipalities.length
		const muni = municipalities[muniIdx]
		const locIdx = Math.floor(i / (propertyTypes.length * municipalities.length)) % muni.locations.length
		const loc = muni.locations[locIdx]
		const priceBaseIdx = i % priceBases.length
		const price = priceBases[priceBaseIdx]

		properties.push({
			id: id++,
			title: `${propertyTypes[typeIdx]} in ${loc}, ${muni.name}`,
			type: propertyTypes[typeIdx],
			municipality: muni.name,
			location: loc,
			price: price,
			images: [
				`https://loremflickr.com/400/300/${imageQueries[propertyTypes[typeIdx]]}?random=${id * 3}`,
				`https://loremflickr.com/400/300/${imageQueries[propertyTypes[typeIdx]]}?random=${id * 3 + 1}`,
				`https://loremflickr.com/400/300/${imageQueries[propertyTypes[typeIdx]]}?random=${id * 3 + 2}`,
			],
		})
	}
	return properties
}

const Rent = () => {
	const [user, setUser] = useState<User | null>(auth.currentUser)
	const [showAccountModal, setShowAccountModal] = useState(false)
	const [filterValues, setFilterValues] = useState<FilterState>(() => ({ ...initialFilters }))
	// all properties from backend / placeholders
	const allProperties = generateProperties()
	const [displayProperties, setDisplayProperties] = useState<Property[]>(allProperties)
	const selectedMunicipality =
		municipalities.find((entry) => entry.name === filterValues.municipality) ?? null

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser)
		})
		return unsubscribe
	}, [])

	useEffect(() => {
		if (user) {
			setShowAccountModal(false)
		}
	}, [user])

	useEffect(() => {
		if (!selectedMunicipality) return
		if (selectedMunicipality.locations.includes(filterValues.location)) return
		setFilterValues((prev) => ({ ...prev, location: selectedMunicipality.locations[0] }))
	}, [filterValues.location, filterValues.municipality, selectedMunicipality])

	const handleSelectChange = (field: keyof FilterState) => (event: ChangeEvent<HTMLSelectElement>) => {
		const value = event.target.value
		// if municipality cleared, also clear location
		if (field === "municipality" && value === "") {
			setFilterValues((prev) => ({ ...prev, municipality: "", location: "" }))
			return
		}
		setFilterValues((prev) => ({ ...prev, [field]: value }))
	}

	const handleResetFilters = () => {
		setFilterValues({ ...initialFilters })
		setDisplayProperties(allProperties)
	}

	const priceMatches = (price: number, range: string) => {
		switch (range) {
			case "Any price":
				return true
			case "Up to €600":
				return price <= 600
			case "€600 - €800":
				return price >= 600 && price <= 800
			case "€800 - €1,000":
				return price >= 800 && price <= 1000
			case "€1,000 - €1,200":
				return price >= 1000 && price <= 1200
			case "€1,200+":
				return price >= 1200
			default:
				return true
		}
	}

	const matchesFilters = (p: Property, f: FilterState) => {
		if (f.propertyType && p.type !== f.propertyType) return false
		if (f.municipality && p.municipality !== f.municipality) return false
		if (f.location && p.location !== f.location) return false
		if (f.maxPrice && !priceMatches(p.price, f.maxPrice)) return false
		return true
	}

	const handleSubmitFilters = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const filtered = allProperties.filter((p) => matchesFilters(p, filterValues))
		setDisplayProperties(filtered)
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
										<option value="">Property type</option>
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
										<option value="">Municipality</option>
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
										<option value="">Location</option>
										{selectedMunicipality
											? selectedMunicipality.locations.map((locationOption) => (
												  <option key={locationOption} value={locationOption}>
													  {locationOption}
												  </option>
											  ))
											: null}
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
										<option value="">Max. Price</option>
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
								className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2 text-sm font-semibold hover:shadow-sm hover:bg-gray-50 transition"
								onClick={handleResetFilters}
								type="button"
							>
								Clear
							</button>
							<button className="rounded-full bg-[#047857] px-5 py-2 text-sm font-semibold text-white hover:opacity-95 hover:shadow-lg transition" type="submit">
								Search
							</button>
						</div>
					</form>
				</section>

				<section className="pb-16">
					<div className="mb-8 text-center">
						<h2 className="text-2xl font-semibold mb-2">Available Properties</h2>
						<p className="text-gray-600">Browse the latest rental listings</p>
					</div>

					{/* Carousel: shows one property at a time with wrap-around arrows */}
					<Carousel
						items={displayProperties}
						isLoggedIn={Boolean(user)}
						onRequireAccount={() => setShowAccountModal(true)}
					/>
				</section>
			</main>

			<Footer />
			{showAccountModal && <AccountRequiredModal onClose={() => setShowAccountModal(false)} />}
		</div>
	)
}

export default Rent
