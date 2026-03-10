import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header>
            <h1 className="sr-only">GC-Renting</h1>
            <div className="border-b border-[#047857] bg-[#047857] text-white shadow-sm">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-6 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-lg font-semibold text-white">
                            GC
                        </div>
                        <div>
                            <p className="text-lg font-semibold tracking-wide text-white">GC-Renting</p>
                            <p className="text-xs uppercase text-white/70">Premium Rentals</p>
                        </div>
                    </div>
                    <nav className="flex flex-1 items-center justify-center gap-6 text-sm font-semibold">
                        <Link className="text-white/80 transition-colors hover:text-white" to="/home">
                            Home
                        </Link>
                        <Link className="text-white/80 transition-colors hover:text-white" to="/rent">
                            Rent
                        </Link>
                        <Link className="text-white/80 transition-colors hover:text-white" to="/about">
                            About Us
                        </Link>
                        <Link className="text-white/80 transition-colors hover:text-white" to="/contact">
                            Contact
                        </Link>
                    </nav>
                    <div className="flex flex-1 items-center justify-end gap-3">
                        <div className="relative w-48">
                            <label htmlFor="site-search" className="sr-only">Search</label>
                            <input
                                id="site-search"
                                type="search"
                                className="w-full rounded-full border border-white/30 bg-white/10 py-2 pl-4 pr-9 text-sm text-white placeholder:text-white/70 focus:border-white/60"
                                placeholder="Search..."
                                aria-label="Search"
                            />
                        </div>
                        <Link
                            className="rounded-full border border-white bg-white px-4 py-2 text-sm font-semibold text-[#047857] transition-colors hover:bg-[#e5f3ef]"
                            to="/login"
                        >
                            Log in
                        </Link>
                        <Link
                            className="rounded-full border border-white/70 bg-transparent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                            to="/signup"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
