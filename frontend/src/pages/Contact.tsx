import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

const Contact = () => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		subject: 'general',
		message: ''
	})

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Form submitted:', formData)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		})
	}

	return (
		<div className="min-h-screen bg-[#f5f5f0]">
			<Header />
			
			<main className="mx-auto max-w-6xl px-6 py-16">
				<div className="grid gap-8 lg:grid-cols-2">
					<div className="relative overflow-hidden rounded-3xl bg-[#047857] p-8 text-white shadow-lg">
						<div className="relative z-10 space-y-6">
							<div>
								<h2 className="text-2xl font-bold">Contact Information</h2>
								<p className="mt-2 text-sm text-white/90">
									Say something to start a live chat!
								</p>
							</div>

							<div className="space-y-6 pt-8">

								<div className="flex items-center gap-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
									</svg>
									<span>+1012 3456 789</span>
								</div>


								<div className="flex items-center gap-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
									<span>demo@gmail.com</span>
								</div>


								<div className="flex items-center gap-4">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
									<span>Las Palmas de Gran Canaria</span>
								</div>
							</div>


							<div className="flex gap-4 pt-12">
								<button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30">
									<span className="text-sm font-semibold">IG</span>
								</button>
								<button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30">
									<span className="text-sm font-semibold">FB</span>
								</button>
								<button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30">
									<span className="text-sm font-semibold">YT</span>
								</button>
							</div>
						</div>


						<div className="absolute bottom-0 right-0 h-40 w-40 translate-x-8 translate-y-8 rounded-full bg-white/10"></div>
						<div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/5"></div>
					</div>


					<div className="rounded-3xl bg-white p-8 shadow-sm">
						<form onSubmit={handleSubmit} className="space-y-6">

							<div className="grid gap-6 sm:grid-cols-2">
								<div>
									<label htmlFor="firstName" className="mb-2 block text-xs font-medium text-gray-600">
										First Name
									</label>
									<input
										id="firstName"
										type="text"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										placeholder="John"
										className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-[#047857] focus:outline-none"
										required
									/>
								</div>
								<div>
									<label htmlFor="lastName" className="mb-2 block text-xs font-medium text-gray-600">
										Last Name
									</label>
									<input
										id="lastName"
										type="text"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										placeholder="Doe"
										className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-[#047857] focus:outline-none"
										required
									/>
								</div>
							</div>


							<div className="grid gap-6 sm:grid-cols-2">
								<div>
									<label htmlFor="email" className="mb-2 block text-xs font-medium text-gray-600">
										Email
									</label>
									<input
										id="email"
										type="email"
										name="email"
										value={formData.email}
										onChange={handleChange}
										placeholder="example@email.com"
										className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-[#047857] focus:outline-none"
										required
									/>
								</div>
								<div>
									<label htmlFor="phone" className="mb-2 block text-xs font-medium text-gray-600">
										Phone Number
									</label>
									<input
										id="phone"
										type="tel"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										placeholder="+1 012 3456 789"
										className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-[#047857] focus:outline-none"
										required
									/>
								</div>
							</div>


							<fieldset>
								<legend className="mb-4 text-sm font-semibold">Select Subject?</legend>
								<div className="grid gap-3 sm:grid-cols-2">
									<label className="flex items-center gap-2">
										<input
											type="radio"
											name="subject"
											value="general"
											checked={formData.subject === 'general'}
											onChange={handleChange}
											className="h-4 w-4 text-[#047857]"
										/>
										<span className="text-sm">General Inquiry</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="radio"
											name="subject"
											value="rental"
											checked={formData.subject === 'rental'}
											onChange={handleChange}
											className="h-4 w-4 text-[#047857]"
										/>
										<span className="text-sm">Rental Inquiry</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="radio"
											name="subject"
											value="support"
											checked={formData.subject === 'support'}
											onChange={handleChange}
											className="h-4 w-4 text-[#047857]"
										/>
										<span className="text-sm">Support</span>
									</label>
									<label className="flex items-center gap-2">
										<input
											type="radio"
											name="subject"
											value="other"
											checked={formData.subject === 'other'}
											onChange={handleChange}
											className="h-4 w-4 text-[#047857]"
										/>
										<span className="text-sm">Other</span>
									</label>
								</div>
							</fieldset>


							<div>
								<label htmlFor="message" className="mb-2 block text-xs font-medium text-gray-600">
									Message
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									placeholder="Write your message..."
									rows={4}
									className="w-full border-b border-gray-300 px-0 py-2 text-sm focus:border-[#047857] focus:outline-none"
									required
								/>
							</div>


							<div className="flex justify-end pt-4">
								<button
									type="submit"
									className="rounded-full bg-[#047857] px-8 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#036c50]"
								>
									Send Message
								</button>
							</div>
						</form>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	)
}

export default Contact
