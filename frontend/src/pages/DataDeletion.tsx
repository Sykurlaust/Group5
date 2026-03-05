import Header from "../components/Header"
import Footer from "../components/Footer"

function DataDeletion() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
      <Header />

      <main className="px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#047857]">
            Data Deletion
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Request Data Deletion</h1>
          <div className="mt-6 space-y-6 text-base leading-8 text-gray-600">
            <p>
              If you would like your account data removed from this project, email
              <span className="font-semibold"> info@gcrenting.com</span> with the subject line
              <span className="font-semibold"> Data Deletion Request</span>.
            </p>
            <p>
              Once we verify the request, we will delete the related account information associated with
              your login from this project within a reasonable time.
            </p>
            <p>
              This page exists to provide a clear public deletion process for users who sign in through
              third-party authentication providers.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default DataDeletion
