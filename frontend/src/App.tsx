import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import AppLayout from "./admin/layout/AppLayout"
import LandlordDashboard from "./admin/pages/LandlordDashboard"
import RenterDashboard from "./admin/pages/RenterDashboard"
import ScrollToTop from "./components/ScrollToTop"
import AboutUs from "./pages/AboutUs"
import Contact from "./pages/Contact"
import DataDeletion from "./pages/DataDeletion"
import Home from "./pages/Home"
import Login from "./pages/loginpage"
import Privacy from "./pages/Privacy"
import Rent from "./pages/Rent"
import Signup from "./pages/signuppage"

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
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />

        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<Navigate replace to="/dashboard/renter" />} />
          <Route path="renter" element={<RenterDashboard />} />
          <Route path="landlord" element={<LandlordDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
