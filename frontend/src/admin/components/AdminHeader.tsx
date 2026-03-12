import { Link } from "react-router-dom"

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-20 bg-[#f5f5f0]/95 px-4 pb-4 pt-4 backdrop-blur md:px-8">
      <div className="mx-auto w-full max-w-[1120px] rounded-[28px] border border-black/5 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#047857]">
                Account
              </p>
              <p className="text-lg font-semibold text-[#1f1f1f]">Favorited</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              className="rounded-full bg-[#047857] px-4 py-2 text-center text-sm font-semibold text-white shadow-md shadow-[#047857]/30 transition hover:bg-[#036c50]"
              to="/home"
            >
              Back to Public Site
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
