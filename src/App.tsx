import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Rent from "./pages/Rent"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rent" element={<Rent />} />
      </Routes>
    </Router>
  )
}

export default App