import { Link } from "react-router-dom"

function DataDeletion() {
  return (
    <main className="min-h-screen bg-[#f5f5f0] px-6 py-16 text-[#1f1f1f]">
      <section className="mx-auto max-w-3xl rounded-[32px] border border-black/5 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#2dbe8b]">Data Deletion</p>
        <h1 className="mt-4 text-4xl font-semibold">Request Data Deletion</h1>
        <p className="mt-6 text-base leading-8 text-gray-600">
          If you would like your account data removed from this project, email
          <span className="font-semibold"> diogojrxavier15@gmail.com</span> with the subject line
          <span className="font-semibold"> Data Deletion Request</span>.
        </p>
        <p className="mt-4 text-base leading-8 text-gray-600">
          Once we verify the request, we will delete the related account information associated with
          your login from this project within a reasonable time.
        </p>
        <p className="mt-4 text-base leading-8 text-gray-600">
          This page exists to provide a clear public deletion process for users who sign in through
          third-party authentication providers.
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

export default DataDeletion
