import { NavLink } from "react-router-dom"
import { useAdminSidebar } from "../context/AdminSidebarContext"
import { cn } from "./cn"

const navItems = [
  { label: "Renter Dashboard", to: "/dashboard/renter" },
  { label: "Landlord Dashboard", to: "/dashboard/landlord" },
]

const sidebarBase =
  "fixed inset-y-0 left-0 z-40 w-72 border-r border-black/5 bg-white/95 p-5 shadow-xl shadow-black/10 backdrop-blur transition-transform duration-500 ease-in-out"

const AdminSidebar = () => {
  const { closeSidebar, isSidebarOpen } = useAdminSidebar()

  return (
    <>
      <aside
        className={cn(
          sidebarBase,
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:-translate-x-[calc(100%-18px)]",
          "lg:hover:translate-x-0",
        )}
      >
        <div className="absolute right-[3px] top-1/2 hidden h-16 w-2 -translate-y-1/2 rounded-full bg-[#047857] shadow-sm lg:block" />
        <div className="flex items-center justify-between pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#047857]">Admin</p>
            <p className="text-xl font-semibold text-[#1f1f1f]">GC-Renting</p>
          </div>
          <button
            className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold text-gray-600 lg:hidden"
            onClick={closeSidebar}
            type="button"
          >
            Close
          </button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "block rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-[#047857] text-white shadow-md shadow-[#047857]/30"
                    : "text-gray-600 hover:bg-[#047857]/10 hover:text-[#047857]",
                )
              }
              key={item.to}
              onClick={closeSidebar}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {isSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={closeSidebar}
          type="button"
        />
      )}
    </>
  )
}

export default AdminSidebar
