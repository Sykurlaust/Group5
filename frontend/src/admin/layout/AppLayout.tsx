import { Outlet } from "react-router-dom"
import "flatpickr/dist/flatpickr.min.css"
import "swiper/css"
import AdminHeader from "../components/AdminHeader"

const AppLayout = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f5f5f0]">
      <div>
        <AdminHeader />
        <main className="mx-auto w-full max-w-[1120px] px-4 pb-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
