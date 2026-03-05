import Header from "../components/Header"
import Footer from "../components/Footer"

function Terms() {
  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f] font-['Space_Grotesk']">
      <Header />

      <main className="px-6 py-16">
        <section className="mx-auto max-w-3xl rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#047857]">
            Terms &amp; Conditions
          </p>
          <h1 className="mt-4 text-4xl font-semibold">Terms and Conditions</h1>

          <div className="mt-6 space-y-6 text-base leading-8 text-gray-600">
            <p>
              Welcome to GC-Renting. These terms and conditions outline the rules and
              regulations for the use of our website. By accessing and using the service, you
              agree to be bound by these terms.
            </p>
            <p>
              Users must be at least 18 years old or have parental consent to register. All
              content provided on the site is for informational purposes only and may change
              without notice.
            </p>
            <p>
              We reserve the right to modify or terminate the service for any reason, without
              prior notice, at any time. We also reserve the right to refuse service to anyone
              for any reason at any time.
            </p>
            <p>
              For additional clauses regarding privacy, dispute resolution, user-generated
              content, and governing law, please consult the full document or contact our
              support team. This placeholder is a concise summary; full legal terms should be
              drafted by qualified counsel.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Terms
