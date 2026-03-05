import { signInWithPopup } from "firebase/auth"
import { Link } from "react-router-dom"
import { auth, googleProvider, facebookProvider } from "../services/firebase"
import PageLayout from "../components/PageLayout"
import AuthPanel from "../components/AuthPanel"
import FormInput from "../components/FormInput"
import SocialAuthButtons from "../components/SocialAuthButtons"
import Button from "../components/Button"
import { useState } from "react"

const loginFeatures = ["Save favourites", "Contact landlords", "Get verified (MVP later)"]

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Logged in user:", result.user)
    } catch (error) {
      console.error("Google login error:", error)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      console.log("Facebook user:", result.user)
    } catch (error) {
      console.error("Facebook login error:", error)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, password })
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

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
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

              <Button type="submit" fullWidth>
                Login
              </Button>

              <SocialAuthButtons
                onGoogleClick={handleGoogleLogin}
                onFacebookClick={handleFacebookLogin}
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
