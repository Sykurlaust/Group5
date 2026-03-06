import Header from "./Header"
import Footer from "./Footer"

interface PageLayoutProps {
  children: React.ReactNode
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default PageLayout
