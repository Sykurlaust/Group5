import { signInWithPopup } from "firebase/auth"
import { Link } from "react-router-dom"
import { useState } from "react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { auth, facebookProvider, googleProvider } from "../services/firebase"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Signed up user:", result.user)
    } catch (error) {
      console.error("Google sign up error:", error)
    }
  }

  const handleFacebookSignup = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider)
      console.log("Facebook sign up user:", result.user)
    } catch (error) {
      console.error("Facebook sign up error:", error)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ name, email, password })
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Header />
      <main className="mx-auto mt-12 max-w-6xl px-6 pb-16">
        <section className="mx-auto grid gap-10 lg:grid-cols-[1fr,1.1fr]">
          <div className="rounded-[40px] bg-[#46a796] p-10 text-white shadow-sm">
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

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Full name</label>
                <input
                  className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#46a796]"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Email</label>
                <input
                  className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#46a796]"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500">Password</label>
                <input
                  className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#46a796]"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                />
              </div>

              <button className="w-full rounded-full bg-[#46a796] px-5 py-3 text-sm font-semibold text-white hover:opacity-90">
                Sign up
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
                    onClick={handleGoogleSignup}
                    className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700"
                  >
                    Continue with Google
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleFacebookSignup}
                  className="w-full rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700"
                >
                  Continue with Facebook
                </button>
              </div>

              <p className="pt-2 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link className="font-semibold text-[#46a796]" to="/login">
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
