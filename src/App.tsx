import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import Contact from "./pages/Contact"
import Login from "./pages/loginpage"
import Privacy from "./pages/Privacy"
import DataDeletion from "./pages/DataDeletion"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
      </Routes>
    </Router>
  )
}

export default App
