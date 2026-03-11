import { Helmet } from "react-helmet-async"
import AdminHighlights from "../components/AdminHighlights"
import AdminStatCard from "../components/AdminStatCard"
import AdminTrafficChart from "../components/AdminTrafficChart"
import DateRangeInput from "../components/DateRangeInput"

const statCards = [
  { helper: "Active landlord accounts", label: "Landlords", value: "42" },
  { helper: "Verified rental applications", label: "Applications", value: "118" },
  { helper: "Listings pending moderation", label: "Reviews", value: "9" },
  { helper: "Avg. response time this week", label: "Support", value: "1h 12m" },
]

const recentActivity = [
  { label: "New landlord onboarding", meta: "Sonia Torres • 2m ago" },
  { label: "Application approved", meta: "Listing #872 • 18m ago" },
  { label: "High traffic alert", meta: "Calle Serrano 102 • 40m ago" },
  { label: "Listing price updated", meta: "Paseo del Prado 12 • 1h ago" },
]

const reviewQueue = [
  { title: "Gran Via Penthouse", owner: "Marcos Luna", priority: "High" },
  { title: "Loft Chamberí", owner: "Patricia Gil", priority: "Medium" },
  { title: "Sevilla Centro Duplex", owner: "Alana Ruiz", priority: "Low" },
]

const AdminDashboard = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | GC-Renting</title>
      </Helmet>

      <div className="w-full space-y-6 pb-10">
        <section className="rounded-[32px] border border-black/5 bg-gradient-to-br from-[#047857] via-[#0a6f58] to-[#0b4d3b] p-6 text-white shadow-[0_25px_60px_rgba(4,120,87,0.35)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Operational Overview</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80">
                Monitor growth, moderation queues, and support load across GC-Renting. Use the quick actions to
                move landlords through onboarding faster.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0b4d3b] transition hover:bg-white/90" type="button">
                  Create Listing
                </button>
                <button className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10" type="button">
                  Invite Landlord
                </button>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-[26px] border border-white/20 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Performance Window</p>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Live</span>
              </div>
              <div className="mt-4">
                <DateRangeInput />
              </div>
              <p className="mt-3 text-xs text-white/70">Stats refresh automatically every hour.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <AdminStatCard helper={stat.helper} key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <AdminTrafficChart title="Platform Visits" />
          <AdminHighlights />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#1f1f1f]">Recent Control Room Activity</h2>
                <p className="text-sm text-gray-500">Automated alerts and manual changes across the platform.</p>
              </div>
              <button className="text-sm font-semibold text-[#047857] hover:underline" type="button">
                View log
              </button>
            </div>

            <ul className="mt-5 space-y-4">
              {recentActivity.map((item) => (
                <li className="flex items-start gap-3" key={item.label}>
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#047857]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f1f1f]">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="text-lg font-semibold text-[#1f1f1f]">Review Queue</h2>
              <p className="text-sm text-gray-500">Listings that need moderation before going live.</p>
            </div>

            <div className="mt-5 space-y-4">
              {reviewQueue.map((entry) => (
                <article
                  className="rounded-2xl border border-black/5 bg-[#f8faf9] px-4 py-3 text-sm"
                  key={entry.title}
                >
                  <div className="flex items-center justify-between text-[#1f1f1f]">
                    <p className="font-semibold">{entry.title}</p>
                    <span
                      className="rounded-full border border-[#047857]/30 px-3 py-1 text-xs font-semibold text-[#047857]"
                    >
                      {entry.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Owner • {entry.owner}</p>
                </article>
              ))}
            </div>

            <button className="mt-6 w-full rounded-full bg-[#047857] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#036c50]" type="button">
              Open moderation workspace
            </button>
          </section>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
