import { Outlet } from "react-router-dom"
import "flatpickr/dist/flatpickr.min.css"
import "swiper/css"
import AdminHeader from "../components/AdminHeader"
import AdminSidebar from "../components/AdminSidebar"
import { AdminSidebarProvider } from "../context/AdminSidebarContext"

const AppLayout = () => {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen overflow-x-hidden bg-[#f5f5f0]">
        <AdminSidebar />
        <div>
          <AdminHeader />
          <main className="mx-auto w-full max-w-[1120px] px-4 pb-8 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}

export default AppLayout
