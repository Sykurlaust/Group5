import { useState } from "react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // MVP: just log it for now
    console.log({ email, password })
  }

  return (
    <main className="mx-auto mt-12 max-w-6xl px-6 pb-16">
      <section className="mx-auto grid gap-10 lg:grid-cols-[1fr,1.1fr]">
        {/* Left info card */}
        <div className="rounded-[40px] bg-[#2dbe8b] p-10 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Welcome back</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Login to GC-Renting</h1>
          <p className="mt-4 text-lg text-white/80">
            Access your saved properties, messages, and your profile.
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
              Get verified (MVP later)
            </div>
          </div>
        </div>

        {/* Right form */}
        <div className="rounded-[40px] border border-black/5 bg-white p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-[#1f1f1f]">Log in</h2>
          <p className="mt-2 text-sm text-gray-500">Use your email and password.</p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-500">Email</label>
              <input
                className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#2dbe8b]"
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
                className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#2dbe8b]"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="h-4 w-4" />
                Remember me
              </label>

              <button type="button" className="text-sm font-semibold text-[#2dbe8b]">
                Forgot password?
              </button>
            </div>

            <button className="w-full rounded-full bg-[#2dbe8b] px-5 py-3 text-sm font-semibold text-white">
              Login
            </button>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs uppercase tracking-[0.3em] text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700"
              >
                Continue with Google
              </button>
              <button
                type="button"
                className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700"
              >
                Continue with Facebook
              </button>
            </div>

            <p className="pt-2 text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <button type="button" className="font-semibold text-[#2dbe8b]">
                Sign up
              </button>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Login