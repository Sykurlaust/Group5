import { Link } from "react-router-dom"

type AccountRequiredModalProps = {
  onClose: () => void
}

const AccountRequiredModal = ({ onClose }: AccountRequiredModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#047857]/10 text-[#047857]">
          <span className="text-2xl">🔐</span>
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-[#1f1f1f]">You are not logged in</h2>
        <p className="mt-3 text-sm text-gray-500">
          Log in or sign up to favorite homes, message landlords, and keep track of the rentals you love.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            to="/login"
            className="w-full rounded-full bg-[#047857] px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
            onClick={onClose}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            onClick={onClose}
          >
            Sign up
          </Link>
          <Link
            to="/login"
            className="w-full rounded-full border border-dashed border-[#047857]/40 px-5 py-3 text-sm font-semibold text-[#047857] hover:bg-[#047857]/5"
            onClick={onClose}
          >
            Login / Sign up portal
          </Link>
          <button
            type="button"
            className="text-sm font-semibold text-gray-400"
            onClick={onClose}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountRequiredModal
