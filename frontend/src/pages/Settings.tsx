import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import Footer from "../components/Footer"
import Header from "../components/Header"

type SettingToggles = {
  emailNotifications: boolean
  listingAlerts: boolean
  profileVisibility: boolean
}

const STORAGE_KEY = "gc-renting:settings"

const Settings = () => {
  const [settings, setSettings] = useState<SettingToggles>({
    emailNotifications: true,
    listingAlerts: true,
    profileVisibility: false,
  })
  const [savedNotice, setSavedNotice] = useState("")

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }
    try {
      const parsed = JSON.parse(raw) as Partial<SettingToggles>
      setSettings((prev) => ({
        emailNotifications:
          typeof parsed.emailNotifications === "boolean"
            ? parsed.emailNotifications
            : prev.emailNotifications,
        listingAlerts:
          typeof parsed.listingAlerts === "boolean" ? parsed.listingAlerts : prev.listingAlerts,
        profileVisibility:
          typeof parsed.profileVisibility === "boolean"
            ? parsed.profileVisibility
            : prev.profileVisibility,
      }))
    } catch {
      // Keep defaults when persisted value is invalid.
    }
  }, [])

  const updateSetting = (key: keyof SettingToggles) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setSavedNotice("Settings saved")
      return next
    })
  }

  useEffect(() => {
    if (!savedNotice) {
      return
    }
    const timeout = window.setTimeout(() => setSavedNotice(""), 1800)
    return () => window.clearTimeout(timeout)
  }, [savedNotice])

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Helmet>
        <title>Settings | GC-Renting</title>
      </Helmet>
      <Header />

      <main className="mx-auto w-full max-w-4xl px-6 pb-16 pt-10">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Settings</h1>
          <p className="mt-2 text-sm text-gray-600">Control your account preferences and app behavior.</p>

          <div className="mt-6 space-y-4">
            <SettingRow
              checked={settings.emailNotifications}
              description="Receive email updates about account activity and messages."
              label="Email notifications"
              onToggle={() => updateSetting("emailNotifications")}
            />
            <SettingRow
              checked={settings.listingAlerts}
              description="Get alerts when favorited homes change price or availability."
              label="Listing alerts"
              onToggle={() => updateSetting("listingAlerts")}
            />
            <SettingRow
              checked={settings.profileVisibility}
              description="Allow your public profile summary to be visible to sellers."
              label="Profile visibility"
              onToggle={() => updateSetting("profileVisibility")}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-900">Security recommendation</p>
            <p className="mt-1 text-sm text-amber-900/90">
              Use a strong, unique password for your Firebase account and keep your recovery email up to date.
            </p>
          </div>

          {savedNotice && <p className="mt-5 text-sm font-semibold text-[#047857]">{savedNotice}</p>}
        </section>
      </main>

      <Footer />
    </div>
  )
}

type SettingRowProps = {
  label: string
  description: string
  checked: boolean
  onToggle: () => void
}

const SettingRow = ({ label, description, checked, onToggle }: SettingRowProps) => {
  return (
    <article className="flex items-start justify-between gap-4 rounded-2xl border border-black/10 bg-[#f9faf9] p-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      </div>
      <button
        aria-pressed={checked}
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${
          checked ? "bg-[#047857]" : "bg-gray-300"
        }`}
        onClick={onToggle}
        type="button"
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </article>
  )
}

export default Settings
