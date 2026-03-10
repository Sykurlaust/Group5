interface SocialAuthButtonsProps {
  onGoogleClick: () => void
  onFacebookClick: () => void
  disabled?: boolean
}

const SocialAuthButtons = ({ onGoogleClick, onFacebookClick, disabled = false }: SocialAuthButtonsProps) => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs uppercase tracking-[0.3em] text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative z-10 w-full">
          <button
            type="button"
            onClick={onGoogleClick}
            disabled={disabled}
            className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue with Google
          </button>
        </div>
        <button
          type="button"
          onClick={onFacebookClick}
          disabled={disabled}
          className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue with Facebook
        </button>
      </div>
    </>
  )
}

export default SocialAuthButtons
