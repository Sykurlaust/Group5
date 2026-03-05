import { Outlet } from "react-router-dom"
import AdminHeader from "../components/AdminHeader"
import AdminSidebar from "../components/AdminSidebar"
import { AdminSidebarProvider } from "../context/AdminSidebarContext"

const AppLayout = () => {
  return (
    <AdminSidebarProvider>
      <div className="min-h-screen bg-[#f5f5f0]">
        <AdminSidebar />
        <div className="lg:pl-72">
          <AdminHeader />
          <main className="mx-auto max-w-[1200px] px-4 pb-8 md:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminSidebarProvider>
  )
}

export default AppLayout
