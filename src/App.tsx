import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"

function App() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
      <Header />
      <Home />
      <Footer />
    </div>
  )
}

export default App