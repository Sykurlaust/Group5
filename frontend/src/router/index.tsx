import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import AboutUs from "../pages/AboutUs"
import Contact from "../pages/Contact"
import DataDeletion from "../pages/DataDeletion"
import Home from "../pages/Home"
import Login from "../pages/loginpage"
import Privacy from "../pages/Privacy"
import Terms from "../pages/Terms"
import Rent from "../pages/Rent"
import Signup from "../pages/signuppage"

const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/rent" element={<Rent />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
