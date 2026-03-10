import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "./Logo.jsx"

const navLinks = [
    { label: "Home", to: "/home" },
    { label: "Rent", to: "/rent" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
]

const Header = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const currentSearchParam = useMemo(
        () => new URLSearchParams(location.search).get("search") ?? "",
        [location.search],
    )
    const [searchValue, setSearchValue] = useState(currentSearchParam)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        setSearchValue(currentSearchParam)
    }, [currentSearchParam])

    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [location.pathname, location.search])

    const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const query = searchValue.trim()
        setIsMobileMenuOpen(false)
        if (!query) {
            navigate("/rent")
            return
        }
        navigate(`/rent?search=${encodeURIComponent(query)}`)
    }

    const renderSearchForm = (inputId: string, className = "") => (
        <form
            aria-label="Search rental listings"
            className={`relative m-0 flex w-full items-stretch rounded-xl border border-white/30 bg-white/10 p-1 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] backdrop-blur-sm ${className}`}
            onSubmit={handleSearchSubmit}
            role="search"
        >
            <label className="sr-only" htmlFor={inputId}>
                Search listings
            </label>
            <input
                aria-label="Search listings"
                className="relative m-0 block w-full flex-auto rounded-lg border border-solid border-transparent bg-transparent bg-clip-padding px-3 py-2 text-sm font-normal leading-[1.5] text-white outline-none transition duration-200 ease-in-out placeholder:text-white/75 focus:z-[3] focus:border-white/60 focus:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)] focus:outline-none"
                id={inputId}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search"
                type="search"
                value={searchValue}
            />
            <button
                aria-label="Search"
                className="input-group-text flex items-center whitespace-nowrap rounded-lg px-3 py-2 text-center text-base font-normal text-white/85 transition duration-200 ease-in-out hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                type="submit"
            >
                <svg
                    aria-hidden="true"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        clipRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        fillRule="evenodd"
                    />
                </svg>
            </button>
        </form>
    )

    return (
        <header>
            <h1 className="sr-only">GC-Renting</h1>
            <div className="border-b border-[#047857] bg-[#047857] text-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4 py-3 lg:py-4">
                        <Link className="shrink-0" to="/home" aria-label="Go to homepage">
                            <Logo
                                className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]"
                                variant="navbar"
                                width="clamp(146px, 15vw, 218px)"
                            />
                        </Link>

                        <div className="hidden min-w-0 flex-1 items-center justify-end gap-4 lg:flex">
                            <nav className="flex items-center gap-6 text-sm font-semibold xl:text-base">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        className="whitespace-nowrap text-white/80 transition-colors hover:text-white"
                                        to={link.to}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            {renderSearchForm("site-search", "max-w-[320px] xl:max-w-[350px]")}

                            <Link
                                className="inline-flex h-11 w-[104px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white bg-white px-3 text-sm font-semibold text-[#047857] transition-colors hover:bg-[#e5f3ef] xl:h-12 xl:w-[112px]"
                                to="/login"
                            >
                                Log in
                            </Link>
                            <Link
                                className="inline-flex h-11 w-[104px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857] xl:h-12 xl:w-[112px]"
                                to="/signup"
                            >
                                Sign up
                            </Link>
                        </div>

                        <button
                            aria-controls="mobile-header-menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            type="button"
                        >
                            <svg
                                aria-hidden="true"
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                {isMobileMenuOpen ? (
                                    <path d="M6 6l12 12M18 6L6 18" />
                                ) : (
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    <div
                        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out lg:hidden ${
                            isMobileMenuOpen ? "max-h-[520px] pb-4 opacity-100" : "max-h-0 opacity-0"
                        }`}
                        id="mobile-header-menu"
                    >
                        <div className="space-y-3 rounded-2xl border border-white/20 bg-white/5 p-3">
                            {renderSearchForm("mobile-site-search")}

                            <nav className="grid grid-cols-2 gap-2 text-sm font-semibold sm:grid-cols-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        className="rounded-xl border border-white/20 px-3 py-2 text-center text-white/90 transition-colors hover:bg-white/15 hover:text-white"
                                        to={link.to}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-white px-4 text-sm font-semibold text-[#047857] transition-colors hover:bg-[#e5f3ef]"
                                    to="/login"
                                >
                                    Log in
                                </Link>
                                <Link
                                    className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                                    to="/signup"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
