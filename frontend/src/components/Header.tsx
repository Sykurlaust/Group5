import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import { ChevronDown, LogOut, Settings as SettingsIcon, UserCircle2 } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo from "./Logo.jsx"
import { useAuth } from "../context/AuthContext"
import { subscribeUnreadConversationCount } from "../lib/chat"

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
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
    const [unreadMessageCount, setUnreadMessageCount] = useState(0)
    const profileMenuRef = useRef<HTMLDivElement | null>(null)
    const { firebaseUser, profile, logout, loading: authLoading } = useAuth()
    const isAuthenticated = Boolean(firebaseUser)
    const accountDisplayName = profile?.displayName ?? firebaseUser?.displayName ?? firebaseUser?.email ?? ""
    const accountInitials = useMemo(() => {
        if (!accountDisplayName) return "GC"
        const parts = accountDisplayName.trim().split(/\s+/)
        const initials = parts.map((part) => part[0]?.toUpperCase()).filter(Boolean)
        return (initials[0] ?? "G") + (initials[1] ?? initials[0] ?? "C")
    }, [accountDisplayName])
    const roleLabel = profile?.role ?? "guest"
    const isAdmin = profile?.role === "admin"

    useEffect(() => {
        setSearchValue(currentSearchParam)
    }, [currentSearchParam])

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsProfileMenuOpen(false)
    }, [location.pathname, location.search])

    useEffect(() => {
        if (!isProfileMenuOpen) {
            return
        }

        const handleDocumentClick = (event: MouseEvent) => {
            if (!profileMenuRef.current) {
                return
            }
            const targetNode = event.target as Node
            if (!profileMenuRef.current.contains(targetNode)) {
                setIsProfileMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleDocumentClick)
        return () => document.removeEventListener("mousedown", handleDocumentClick)
    }, [isProfileMenuOpen])

    useEffect(() => {
        if (!firebaseUser) {
            setUnreadMessageCount(0)
            return
        }

        const unsubscribe = subscribeUnreadConversationCount(
            firebaseUser.uid,
            (count) => setUnreadMessageCount(count),
            (error) => {
                console.error("Failed to subscribe unread message count", error)
                setUnreadMessageCount(0)
            },
        )

        return () => unsubscribe()
    }, [firebaseUser])

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

    const handleLogout = async () => {
        try {
            await logout()
            setIsMobileMenuOpen(false)
            navigate("/home")
        } catch (error) {
            console.error("Failed to log out", error)
        }
    }

    const renderDesktopAuthActions = () => {
        if (authLoading) {
            return <span className="text-sm text-white/80">Checking session...</span>
        }

        if (!isAuthenticated) {
            return (
                <>
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
                </>
            )
        }

        return (
            <div className="flex items-center gap-3">
                <Link
                    className="inline-flex h-11 w-[110px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                    to="/favorites"
                >
                    Favorited
                </Link>
                <Link
                    className="relative inline-flex h-11 w-[104px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                    to="/messages"
                >
                    Messages
                    {unreadMessageCount > 0 && (
                        <span className="absolute right-2 top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-semibold text-white">
                            {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                        </span>
                    )}
                </Link>
                <Link
                    className="inline-flex h-11 w-[104px] shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                    to="/apply"
                >
                    Apply
                </Link>

                <div className="relative" ref={profileMenuRef}>
                    <button
                        aria-expanded={isProfileMenuOpen}
                        aria-haspopup="menu"
                        className="group flex h-12 items-center gap-3 rounded-full border border-white/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        type="button"
                    >
                        {profile?.photoURL ? (
                            <img
                                alt={accountDisplayName || "Profile"}
                                className="h-9 w-9 rounded-full object-cover"
                                src={profile.photoURL}
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
                                {accountInitials}
                            </div>
                        )}
                        <span className="max-w-[140px] truncate text-sm font-semibold">{accountDisplayName || "Account"}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isProfileMenuOpen && (
                        <div className="absolute right-0 z-50 mt-3 w-72 rounded-[28px] border border-black/5 bg-white p-2 text-[#1f1f1f] shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                            <div className="rounded-2xl px-4 pb-3 pt-3">
                                <p className="truncate text-sm font-semibold text-gray-900">{accountDisplayName || "Your account"}</p>
                                <p className="mt-0.5 text-xs uppercase tracking-wide text-gray-400">{roleLabel}</p>
                            </div>
                            <p className="px-4 pb-1 pt-1 text-sm font-medium text-gray-400">Account</p>

                            {isAdmin && (
                                <Link
                                    className="block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-[#047857]/10 hover:text-[#047857]"
                                    to="/dashboard/admin"
                                >
                                    Dashboard
                                </Link>
                            )}
                            <Link
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                to="/account"
                            >
                                <UserCircle2 className="h-5 w-5 text-gray-500" />
                                <span>My Profile</span>
                            </Link>
                            <Link
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                to="/settings"
                            >
                                <SettingsIcon className="h-5 w-5 text-gray-500" />
                                <span>Settings</span>
                            </Link>
                            <div className="my-1 h-px bg-black/5" />
                            <button
                                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                onClick={handleLogout}
                                type="button"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const renderMobileAuthActions = () => {
        if (authLoading) {
            return <p className="text-center text-sm font-semibold text-white/80">Checking session...</p>
        }

        if (!isAuthenticated) {
            return (
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-white px-4 text-sm font-semibold text-[#047857] transition-colors hover:bg-[#e5f3ef]"
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Log in
                    </Link>
                    <Link
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Sign up
                    </Link>
                </div>
            )
        }

        return (
            <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-base font-semibold text-white">
                        {accountInitials}
                    </div>
                    <div>
                        <p className="text-base font-semibold text-white">{accountDisplayName || "Your account"}</p>
                        <p className="text-xs uppercase tracking-wide text-white/70">{roleLabel}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {isAdmin && (
                        <Link
                            className="col-span-2 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-white px-4 text-sm font-semibold text-[#047857] transition-colors hover:bg-[#e5f3ef]"
                            to="/dashboard/admin"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    )}
                    <Link
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                        to="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Account
                    </Link>
                    <Link
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                        to="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Settings
                    </Link>
                    <Link
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-white px-4 text-sm font-semibold text-[#047857] transition-colors hover:bg-[#e5f3ef]"
                        to="/favorites"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Favorited
                    </Link>
                    <Link
                        className="relative inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                        to="/messages"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Messages
                        {unreadMessageCount > 0 && (
                            <span className="absolute right-2 top-2 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-semibold text-white">
                                {unreadMessageCount > 9 ? "9+" : unreadMessageCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                        to="/apply"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Apply
                    </Link>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-[#047857]"
                    >
                        Log out
                    </button>
                </div>
            </div>
        )
    }

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
                            {renderDesktopAuthActions()}
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

                            {renderMobileAuthActions()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
