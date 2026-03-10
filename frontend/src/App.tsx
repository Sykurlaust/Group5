import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "./admin/layout/AppLayout"
import LandlordDashboard from "./admin/pages/LandlordDashboard"
import RenterDashboard from "./admin/pages/RenterDashboard"
import ScrollToTop from "./components/ScrollToTop"
import RequireAuth from "./components/RequireAuth"
import AboutUs from "./pages/AboutUs"
import Contact from "./pages/Contact"
import DataDeletion from "./pages/DataDeletion"
import Home from "./pages/Home"
import ListingDetail from "./pages/ListingDetail"
import Listings from "./pages/Listings"
import Login from "./pages/loginpage"
import MessagesPage from "./pages/MessagesPage"
import Privacy from "./pages/Privacy"
import Rent from "./pages/Rent"
import Signup from "./pages/signuppage"
import Terms from "./pages/Terms"

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
        <Route path="/messages" element={<MessagesPage />} />

        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <AppLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate replace to="/dashboard/renter" />} />
          <Route path="renter" element={<RenterDashboard />} />
          <Route path="landlord" element={<LandlordDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
