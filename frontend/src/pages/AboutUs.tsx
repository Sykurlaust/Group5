import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import lukasImage from '../assets/lukasface/Lukasface.png'

const AboutUs: React.FC = () => {
	const teamMembers = [
		{
			name: 'Emily',
			role: 'CEO & Founder',
			image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
		},
		{
			name: 'Diogo',
			role: 'Head of Operations',
			image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
		},
		{
		
	name: 'Lukas',
	role: 'Property Manager',
	image: lukasImage
},
		{
			name: 'Angel',
			role: 'Customer Relations',
			image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
		}
	]

	const values = [
		{
			title: 'Quality Properties',
			description: 'We carefully select and verify each property to ensure the highest standards for our clients.'
		},
		{
			title: 'Trust & Transparency',
			description: 'Building lasting relationships through honest communication and transparent processes.'
		},
		{
			title: 'Excellence',
			description: 'Committed to delivering exceptional service that exceeds expectations every time.'
		},
		{
			title: 'Sustainability',
			description: 'Promoting eco friendly properties and sustainable living practices in Gran Canaria.'
		}
	]

	return (
		<div className="min-h-screen bg-[#f5f5f0]">
			<Header />

			<main className="mx-auto max-w-6xl px-6 py-16">
				{/* Hero Section */}
				<section className="text-center mb-16">
					<h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
						About Us
					</h1>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
						Connecting people with their dream homes in Gran Canaria since 2026
					</p>
				</section>

				{/* Story Section */}
				<section className="mb-16 rounded-[40px] border border-black/5 bg-white px-8 py-12 shadow-sm">
					<div className="grid gap-8 lg:grid-cols-2 items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-900 mb-4">
								Our Story
							</h2>
							<p className="text-gray-600 mb-4">
								Founded in 2026, we started with a simple mission: to make finding the perfect rental property in Gran Canaria easy, transparent, and enjoyable. What began as a small team passionate about real estate has grown into a trusted platform connecting thousands of tenants with their ideal homes.
							</p>
							<p className="text-gray-600">
							We understand that finding a home is more than just a transaction. It is about finding a place where memories are made, where you feel safe, and where you belong. That is why we go the extra mile to ensure every property meets our high standards and every client receives personalized attention.
							</p>
						</div>
						<div className="rounded-[30px] overflow-hidden shadow-lg">
							<img
								src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
								alt="Modern office space"
								className="w-full h-full object-cover"
							/>
						</div>
					</div>
				</section>

				{/* Values Section */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
						Our Values
					</h2>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{values.map((value, index) => (
							<div
								key={index}
								className="rounded-[30px] border border-black/5 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
							>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">
									{value.title}
								</h3>
								<p className="text-gray-600 text-sm">
									{value.description}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Team Section */}
				<section className="mb-16">
					<h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
						Meet Our Team
					</h2>
					<p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
						Dedicated professionals committed to helping you find your perfect home
					</p>
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
						{teamMembers.map((member, index) => (
							<div
								key={index}
								className="text-center group"
							>
								<div className="rounded-[30px] overflow-hidden mb-4 shadow-md group-hover:shadow-lg transition-shadow">
									<img
										src={member.image}
										alt=""
										className="w-full h-64 object-cover"
									/>
								</div>
								<h3 className="text-xl font-semibold text-gray-900">
									{member.name}
								</h3>
								<p className="text-gray-600 text-sm mt-1">
									{member.role}
								</p>
							</div>
						))}
					</div>
				</section>

				{/* Stats Section */}
				<section className="rounded-[40px] border border-black/5 bg-gradient-to-r from-[#047857] to-[#3f37f0] px-8 py-12 shadow-lg text-white">
					<div className="grid gap-8 sm:grid-cols-3 text-center">
						<div>
							<div className="text-4xl font-bold mb-2">500+</div>
							<p className="text-white/90">Properties Listed</p>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">2,500+</div>
							<p className="text-white/90">Happy Clients</p>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">15+</div>
							<p className="text-white/90">Municipalities Covered</p>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	)
}

export default AboutUs
