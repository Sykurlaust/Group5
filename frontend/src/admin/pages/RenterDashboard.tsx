import { Helmet } from "react-helmet-async"
import AdminHighlights from "../components/AdminHighlights"
import AdminStatCard from "../components/AdminStatCard"
import AdminTrafficChart from "../components/AdminTrafficChart"

const RenterDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Renter Dashboard | GC-Renting</title>
      </Helmet>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <AdminStatCard helper="Properties saved this month" label="Saved Homes" value="28" />
          <AdminStatCard helper="Unread conversations" label="Messages" value="12" />
          <AdminStatCard helper="Upcoming viewings" label="Bookings" value="4" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
          <AdminTrafficChart title="Renter Activity" />
          <AdminHighlights />
        </div>
      </div>
    </>
  )
}

export default RenterDashboard
