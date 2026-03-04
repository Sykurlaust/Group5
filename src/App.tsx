import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Login from "./pages/loginpage"
<<<<<<< Updated upstream
=======
import Rent from "./pages/Rent"
import AboutUs from "./pages/AboutUs"
import Privacy from "./pages/Privacy"
import DataDeletion from "./pages/DataDeletion"
import ScrollToTop from "./components/ScrollToTop"
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
<<<<<<< Updated upstream
=======
        <Route path="/rent" element={<Rent />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      </Routes>
    </Router>
  )
}

export default App
