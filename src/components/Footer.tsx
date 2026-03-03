const Footer = () => {
	return (
		<footer className="mt-16 border-t border-black/5 bg-white" id="contact">
			<div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-4">
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2dbe8b] font-semibold text-white">
							GC
						</div>
						<div>
							<p className="font-semibold">GC-Renting</p>
							<p className="text-xs uppercase text-gray-500">Premium Rentals</p>
						</div>
					</div>
					<div className="flex gap-3 text-xl text-gray-600">
						<span>IG</span>
						<span>FB</span>
						<span>IN</span>
					</div>
				</div>
				<div className="space-y-2 text-sm">
					<p className="font-semibold text-gray-600">Company</p>
					<p>About</p>
					<p>Team</p>
					<p>Careers</p>
				</div>
				<div className="space-y-2 text-sm">
					<p className="font-semibold text-gray-600">Explore</p>
					<p>Home</p>
					<p>Buy</p>
					<p>Rent</p>
				</div>
				<div>
					<p className="font-semibold text-gray-600">Contact</p>
					<form className="mt-4 space-y-3">
						<input className="w-full rounded-[20px] border border-black/10 px-4 py-2 text-sm" placeholder="Enter your name" />
						<input className="w-full rounded-[20px] border border-black/10 px-4 py-2 text-sm" placeholder="Enter your email address" />
						<textarea className="h-24 w-full rounded-[20px] border border-black/10 px-4 py-2 text-sm" placeholder="Message" />
						<button className="w-full rounded-[20px] bg-[#2dbe8b] py-2 text-sm font-semibold text-white">Submit</button>
					</form>
				</div>
			</div>
		</footer>
	)
}

export default Footer
