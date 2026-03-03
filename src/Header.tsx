import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header>
            <div className="border-b border-black/5 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#46a796] text-lg font-semibold text-white">
                            GC
                        </div>
                        <div>
                            <p className="text-lg font-semibold tracking-wide">GC-Renting</p>
                            <p className="text-xs uppercase text-gray-500">Premium Rentals</p>
                        </div>
                    </div>
                    <nav className="flex flex-1 items-center justify-center gap-6 text-sm font-semibold">
                        <a className="text-[#46a796] transition-colors hover:text-[#3a8c78]" href="#home">
                            Home
                        </a>
                        <a className="text-[#46a796] transition-colors hover:text-[#3a8c78]" href="#rent">
                            Rent
                        </a>
                        <a className="text-[#46a796] transition-colors hover:text-[#3a8c78]" href="#contact">
                            Contact
                        </a>
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-3">
                        <div className="relative w-48">
                            <input
                                className="w-full rounded-full border border-black/10 py-2 pl-4 pr-9 text-sm placeholder:text-gray-400"
                                placeholder="Search..."
                            />
                        </div>
                        <Link className="rounded-full border border-[#46a796] px-4 py-2 text-sm font-semibold text-[#46a796] transition-colors hover:bg-[#46a796] hover:text-white" to="/login">
                            Log in
                        </Link>
                        <button className="rounded-full border border-[#46a796] bg-white px-4 py-2 text-sm font-semibold text-[#46a796] transition-colors hover:bg-[#46a796] hover:text-white">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
