import { Helmet } from "react-helmet-async"
import AdminHighlights from "../components/AdminHighlights"
import AdminStatCard from "../components/AdminStatCard"
import AdminTrafficChart from "../components/AdminTrafficChart"

const LandlordDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Landlord Dashboard | GC-Renting</title>
      </Helmet>

      <div className="w-full space-y-6">
        <div className="grid w-full items-stretch gap-4 md:grid-cols-3">
          <AdminStatCard helper="Active property listings" label="Listings" value="9" />
          <AdminStatCard helper="New renter inquiries" label="Leads" value="17" />
          <AdminStatCard helper="Pending verification items" label="Tasks" value="6" />
        </div>

        <div className="grid w-full gap-6">
          <AdminTrafficChart title="Landlord Listing Traffic" />
          <AdminHighlights />
        </div>
      </div>
    </>
  )
}

export default LandlordDashboard
