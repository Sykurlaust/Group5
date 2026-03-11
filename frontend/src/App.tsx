import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "./admin/layout/AppLayout"
import AdminDashboard from "./admin/pages/AdminDashboard"
import LandlordDashboard from "./admin/pages/LandlordDashboard"
import RenterDashboard from "./admin/pages/RenterDashboard"
import ScrollToTop from "./components/ScrollToTop"
import RequireAuth from "./components/RequireAuth"
import RequireRole from "./components/RequireRole"
import Account from "./pages/Account"
import AboutUs from "./pages/AboutUs"
import Apply from "./pages/Apply"
import Contact from "./pages/Contact"
import DataDeletion from "./pages/DataDeletion"
import Home from "./pages/Home"
import ListingDetail from "./pages/ListingDetail"
import Listings from "./pages/Listings"
import Login from "./pages/loginpage"
import MessagesPage from "./pages/MessagesPage"
import Privacy from "./pages/Privacy"
import Rent from "./pages/Rent"
import Settings from "./pages/Settings"
import Signup from "./pages/signuppage"
import Terms from "./pages/Terms"
import { useAuth } from "./context/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route
          path="/favorited"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["tenant", "admin"]} redirectTo="/account">
                <RenterDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/messages"
          element={
            <RequireAuth>
              <MessagesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/apply"
          element={
            <RequireAuth>
              <Apply />
            </RequireAuth>
          }
        />
        <Route
          path="/account"
          element={
            <RequireAuth>
              <Account />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<DashboardLanding />} />
          <Route
            path="admin"
            element={
              <RequireRole allowedRoles={["admin"]} redirectTo="/dashboard">
                <AdminDashboard />
              </RequireRole>
            }
          />
          <Route
            path="landlord"
            element={
              <RequireRole allowedRoles={["landlord", "admin"]} redirectTo="/dashboard">
                <LandlordDashboard />
              </RequireRole>
            }
          />
          <Route path="renter" element={<Navigate replace to="/favorited" />} />
          <Route path="favorited" element={<Navigate replace to="/favorited" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

const DashboardLanding = () => {
  const { loading, profile } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Redirecting to your workspace...
      </div>
    )
  }

  const role = profile?.role ?? "guest"

  if (role === "admin") {
    return <Navigate replace to="/dashboard/admin" />
  }

  if (role === "landlord") {
    return <Navigate replace to="/dashboard/landlord" />
  }

  if (role === "tenant") {
    return <Navigate replace to="/favorited" />
  }

  return <Navigate replace to="/home" />
}
