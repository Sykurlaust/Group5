import Header from "../components/Header"
import Footer from "../components/Footer"

function Privacy() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
      <Header />

      <main className="px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#047857]">
            Privacy Policy
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Group 5 Privacy Policy</h1>

          <div className="mt-6 space-y-6 text-base leading-8 text-gray-600">
            <p>
              This app uses Google and Facebook login for authentication. We only collect the
              profile information provided by the selected login provider that is necessary to sign
              users in and operate the app.
            </p>
            <p>
              We do not sell personal data. Information is used only for account access, basic user
              identification, and improving the experience inside this project.
            </p>
            <p>
              We retain personal data only as long as required to provide services. Users can
              request deletion via the Data Deletion page or contact us directly at
              <span className="font-semibold"> info@gcrenting.com</span>.
            </p>
            <p>
              For more details on cookies, third‑party services, or data rights please refer to
              [insert full policy here]. This text is representative; legal teams typically
              provide the full version.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Privacy
