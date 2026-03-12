import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ScrollToTop from "./components/ScrollToTop"
import RequireAuth from "./components/RequireAuth"
import RequireRole from "./components/RequireRole"
import Home from "./pages/Home"
import Rent from "./pages/Rent"
import { useAuth } from "./context/AuthContext"

const AppLayout = lazy(() => import("./admin/layout/AppLayout"))
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"))
const LandlordDashboard = lazy(() => import("./admin/pages/LandlordDashboard"))
const Account = lazy(() => import("./pages/Account"))
const AboutUs = lazy(() => import("./pages/AboutUs"))
const Apply = lazy(() => import("./pages/Apply"))
const Contact = lazy(() => import("./pages/Contact"))
const DataDeletion = lazy(() => import("./pages/DataDeletion"))
const ListingDetail = lazy(() => import("./pages/ListingDetail"))
const Listings = lazy(() => import("./pages/Listings"))
const Login = lazy(() => import("./pages/loginpage"))
const MessagesPage = lazy(() => import("./pages/MessagesPage"))
const Favorites = lazy(() => import("./pages/Favorites"))
const Privacy = lazy(() => import("./pages/Privacy"))
const Signup = lazy(() => import("./pages/signuppage"))
const Reviews = lazy(() => import("./pages/Reviews"))
const Terms = lazy(() => import("./pages/Terms"))

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="flex min-h-[30vh] items-center justify-center text-sm text-gray-500">
            Loading page...
          </div>
        }
      >
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
          <Route path="/reviews" element={<Reviews />} />
          <Route
            path="/favorites"
            element={
              <RequireAuth>
                <Favorites />
              </RequireAuth>
            }
          />
          <Route path="/favorited" element={<Navigate replace to="/favorites" />} />
          <Route path="/favoritos" element={<Navigate replace to="/favorites" />} />
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
          {/* Settings page removed — not used */}

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
            <Route path="renter" element={<Navigate replace to="/favorites" />} />
            <Route path="favorited" element={<Navigate replace to="/favorites" />} />
          </Route>
        </Routes>
      </Suspense>
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
    return <Navigate replace to="/favorites" />
  }

  return <Navigate replace to="/home" />
}
