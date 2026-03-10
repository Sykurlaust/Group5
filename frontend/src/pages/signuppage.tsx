import { FirebaseError } from "firebase/app"
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { auth, facebookProvider, googleProvider } from "../services/firebase"
import { useAuth } from "../context/AuthContext"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const { firebaseUser, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && firebaseUser) {
      navigate("/home", { replace: true })
    }
  }, [authLoading, firebaseUser, navigate])

  const isDisabled = useMemo(() => isProcessing || authLoading, [authLoading, isProcessing])

  const translateError = (error: unknown): string => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/email-already-in-use":
          return "This email is already linked to an account."
        case "auth/invalid-email":
          return "Please enter a valid email."
        case "auth/weak-password":
          return "Password must be at least 6 characters long."
        case "auth/popup-closed-by-user":
          return "The popup closed before finishing. Please try again."
        default:
          return "Unable to complete signup. Please try again."
      }
    }
    return "Unexpected error. Please try again."
  }

  const handleEmailSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsProcessing(true)
    setErrorMessage(null)
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
      if (credential.user && name.trim()) {
        await updateProfile(credential.user, { displayName: name.trim() })
      }
    } catch (error) {
      setErrorMessage(translateError(error))
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePopupSignup = async (provider: typeof googleProvider | typeof facebookProvider) => {
    try {
      setIsProcessing(true)
      setErrorMessage(null)
      await signInWithPopup(auth, provider)
    } catch (error) {
      setErrorMessage(translateError(error))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Header />
      <main className="mx-auto mt-12 max-w-6xl px-6 pb-16">
        <section className="mx-auto grid gap-10 lg:grid-cols-[1fr,1.1fr]">
          <div className="rounded-[40px] bg-[#047857] p-10 text-white shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Join us</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">Sign up for GC-Renting</h1>
            <p className="mt-4 text-lg text-white/80">
              Create your account to save favourites, contact landlords, and manage your profile.
            </p>

            <div className="mt-10 grid gap-3 text-sm text-white/90">
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                Save favourites
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                Contact landlords
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full bg-white/90" />
                Build your renter profile
              </div>
            </div>
          </div>

          <div className="rounded-[40px] border border-black/5 bg-white p-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">Sign up</h2>
            <p className="mt-2 text-sm text-gray-500">Create your account with your details.</p>

            {errorMessage && (
              <div className="mt-6 rounded-3xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleEmailSignup}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Full name</label>
                <input
                  className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <input
                  className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Password</label>
                <input
                  className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                className="w-full rounded-full bg-[#047857] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isDisabled}
              >
                {isDisabled ? "Working..." : "Sign up"}
              </button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs uppercase tracking-[0.3em] text-gray-400">or</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative z-10 w-full">
                  <button
                    type="button"
                    onClick={() => handlePopupSignup(googleProvider)}
                    disabled={isDisabled}
                    className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Continue with Google
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => handlePopupSignup(facebookProvider)}
                  disabled={isDisabled}
                  className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue with Facebook
                </button>
              </div>

              <p className="pt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link className="font-semibold text-[#047857]" to="/login">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Signup
