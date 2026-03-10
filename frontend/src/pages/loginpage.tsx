import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { auth, googleProvider, facebookProvider } from "../services/firebase"
import PageLayout from "../components/PageLayout"
import AuthPanel from "../components/AuthPanel"
import FormInput from "../components/FormInput"
import SocialAuthButtons from "../components/SocialAuthButtons"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useAuth } from "../context/AuthContext"

const loginFeatures = ["Save favourites", "Contact landlords", "Get verified (MVP later)"]

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { firebaseUser, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && firebaseUser) {
      navigate("/home", { replace: true })
    }
  }, [authLoading, firebaseUser, navigate])

  const isBusy = isProcessing || authLoading

  const getReadableError = (error: unknown): string => {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          return "Incorrect email or password."
        case "auth/user-not-found":
          return "No account found with that email."
        case "auth/invalid-email":
          return "Please enter a valid email address."
        case "auth/popup-closed-by-user":
          return "Login popup was closed before completing."
        default:
          return "Authentication failed. Please try again."
      }
    }
    return "Something went wrong. Please try again."
  }

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsProcessing(true)
    setAuthError(null)

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      setEmail("")
      setPassword("")
    } catch (error) {
      setAuthError(getReadableError(error))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsProcessing(true)
      setAuthError(null)
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      setAuthError(getReadableError(error))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      setIsProcessing(true)
      setAuthError(null)
      await signInWithPopup(auth, facebookProvider)
    } catch (error) {
      setAuthError(getReadableError(error))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <PageLayout>
      <main className="mx-auto mt-12 max-w-6xl px-6 pb-16">
        <section className="mx-auto grid gap-10 lg:grid-cols-[1fr,1.1fr]">
          <AuthPanel
            eyebrow="Welcome back"
            title="Login to GC-Renting"
            description="Access your saved properties, messages, and your profile."
            features={loginFeatures}
          />

          <div className="rounded-[40px] border border-black/5 bg-white p-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">Log in</h2>
            <p className="mt-2 text-sm text-gray-500">Use your email and password.</p>

            {authError && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {authError}
              </div>
            )}

            <form className="mt-8 space-y-5" onSubmit={handleEmailLogin}>
              <FormInput
                label="Email"
                id="login-email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FormInput
                label="Password"
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" className="h-4 w-4" />
                  Remember me
                </label>
                <button type="button" className="text-sm font-semibold text-[#047857]">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" fullWidth disabled={isBusy}>
                {isBusy ? "Logging in..." : "Login"}
              </Button>

              <SocialAuthButtons
                onGoogleClick={handleGoogleLogin}
                onFacebookClick={handleFacebookLogin}
                disabled={isBusy}
              />

              <p className="pt-2 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <Link className="font-semibold text-[#047857]" to="/signup">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </PageLayout>
  )
}

export default Login
