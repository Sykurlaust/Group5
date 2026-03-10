import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import RenterDashboard from "./admin/pages/RenterDashboard"
import ScrollToTop from "./components/ScrollToTop"
import RequireAuth from "./components/RequireAuth"
import Account from "./pages/Account"
import AboutUs from "./pages/AboutUs"
import Apply from "./pages/Apply"
import Contact from "./pages/Contact"
import DataDeletion from "./pages/DataDeletion"
import Home from "./pages/Home"
import ListingDetail from "./pages/ListingDetail"
import Listings from "./pages/Listings"
import Login from "./pages/loginpage"
import Messages from "./pages/Messages"
import Privacy from "./pages/Privacy"
import Rent from "./pages/Rent"
import Settings from "./pages/Settings"
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

        <Route
          path="/favorited"
          element={
            <RequireAuth>
              <RenterDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/messages"
          element={
            <RequireAuth>
              <Messages />
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

        <Route path="/dashboard" element={<Navigate replace to="/favorited" />} />
        <Route path="/dashboard/favorited" element={<Navigate replace to="/favorited" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
