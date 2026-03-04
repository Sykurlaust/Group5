import { Link } from "react-router-dom"

function Privacy() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] px-6 py-16 text-[#1f1f1f]">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2dbe8b]">Privacy Policy</p>
        <h1 className="mt-4 text-4xl font-semibold">Group 5 Privacy Policy</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          This app uses Google and Facebook login for authentication. We only collect the profile
          information provided by the selected login provider that is necessary to sign users in and
          operate the app.
        </p>
        <p className="mt-4 text-base leading-8 text-gray-600">
          We do not sell personal data. Information is used only for account access, basic user
          identification, and improving the experience inside this project.
        </p>
        <p className="mt-4 text-base leading-8 text-gray-600">
          If you have any questions about privacy or data handling, contact us at
          <span className="font-semibold"> diogojrxavier15@gmail.com</span>.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-[#2dbe8b] px-6 py-3 text-sm font-semibold text-white"
          to="/home"
        >
          Back to Home
        </Link>
      </section>
    </main>
  )
}

export default Privacy
