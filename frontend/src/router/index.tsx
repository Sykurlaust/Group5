import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"
import AboutUs from "../pages/AboutUs"
import Contact from "../pages/Contact"
import Home from "../pages/Home"
import Login from "../pages/loginpage"
import Rent from "../pages/Rent"

const AppRouter = () => (
  <BrowserRouter>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/rent" element={<Rent />} />
      <Route path="/about" element={<AboutUs />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
