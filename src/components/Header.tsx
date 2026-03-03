import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header>
            <div className="bg-[#2dbe8b] text-white text-sm">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="m4.5 6 7.5 6 7.5-6"
                            />
                        </svg>
                        <a className="underline" href="mailto:info@gc-renting.com">
                            info@gc-renting.com
                        </a>
                    </div>
                    <div className="flex items-center gap-4 text-lg">
                        <span>IG</span>
                        <span>FB</span>
                        <span>IN</span>
                    </div>
                </div>
            </div>
            <div className="border-b border-black/5 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2dbe8b] text-lg font-semibold text-white">
                            GC
                        </div>
                        <div>
                            <p className="text-lg font-semibold tracking-wide">GC-Renting</p>
                            <p className="text-xs uppercase text-gray-500">Premium Rentals</p>
                        </div>
                    </div>
                    <nav className="flex flex-1 items-center justify-center gap-6 text-sm font-semibold">
                        <Link className="text-[#2dbe8b]" to="/home">
                            Home
                        </Link>
                        <Link className="text-gray-700" to="/rent">
                            Rent
                        </Link>
                        <Link className="text-gray-700" to="/about">
                            About Us
                        </Link>
                        <Link className="text-gray-700" to="/contact">
                            Contact
                        </Link>
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-3">
                        <div className="relative w-48">
                            <input
                                className="w-full rounded-full border border-black/10 py-2 pl-4 pr-9 text-sm placeholder:text-gray-400"
                                placeholder="Search..."
                            />
                        </div>
                        <Link
                            className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"
                            to="/login"
                        >
                            Log in
                        </Link>
                        <button className="rounded-full border border-[#2dbe8b] bg-white px-4 py-2 text-sm font-semibold text-[#2dbe8b]">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
