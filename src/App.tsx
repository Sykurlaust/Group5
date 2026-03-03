import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Login from "./pages/loginpage"
import Rent from "./pages/Rent"
import AboutUs from "./pages/AboutUs"
import ScrollToTop from "./components/ScrollToTop"

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </Router>
  )
}

export default App
