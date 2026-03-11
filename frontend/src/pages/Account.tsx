import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Helmet } from "react-helmet-async"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { storage } from "../lib/firebase"

type AccountFormState = {
  displayName: string
  phone: string
  photoURL: string
}

const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined. Please set it in your .env file.")
  }
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

const Account = () => {
  const { profile, firebaseUser, refreshProfile } = useAuth()

  const initialFormState = useMemo<AccountFormState>(
    () => ({
      displayName: profile?.displayName ?? firebaseUser?.displayName ?? "",
      phone: profile?.phone ?? "",
      photoURL: profile?.photoURL ?? "",
    }),
    [firebaseUser?.displayName, profile?.displayName, profile?.phone, profile?.photoURL],
  )

  const [formState, setFormState] = useState<AccountFormState>(initialFormState)
  const [saving, setSaving] = useState(false)
  const [savePhase, setSavePhase] = useState<"idle" | "uploading" | "saving">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [selectedPhotoName, setSelectedPhotoName] = useState("")
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null)
  const [selectedPhotoPreviewUrl, setSelectedPhotoPreviewUrl] = useState("")

  useEffect(() => {
    setFormState(initialFormState)
    setSelectedPhotoName("")
    setSelectedPhotoFile(null)
    setSelectedPhotoPreviewUrl("")
  }, [initialFormState])

  useEffect(() => {
    if (!selectedPhotoFile) {
      setSelectedPhotoPreviewUrl("")
      return
    }

    const objectUrl = URL.createObjectURL(selectedPhotoFile)
    setSelectedPhotoPreviewUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedPhotoFile])

  const hasChanges = useMemo(() => {
    return (
      formState.displayName.trim() !== initialFormState.displayName.trim() ||
      formState.phone.trim() !== initialFormState.phone.trim() ||
      formState.photoURL.trim() !== initialFormState.photoURL.trim() ||
      selectedPhotoFile !== null
    )
  }, [formState, initialFormState, selectedPhotoFile])

  const accountKind = useMemo(() => {
    const role = (profile?.role ?? "guest").toLowerCase()
    switch (role) {
      case "admin":
        return { label: "Admin", helper: "Full access — manages the entire platform" }
      case "landlord":
        return { label: "Landlord", helper: "Property owner — lists and rents out properties" }
      case "tenant":
        return { label: "Tenant", helper: "Looking to rent a property" }
      default:
        return { label: "Guest", helper: "No account — browsing only" }
    }
  }, [profile?.role])

  const handleChange = (field: keyof AccountFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handlePhotoFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please choose an image file.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Image must be 2MB or smaller.")
      return
    }

    setErrorMessage("")
    setSelectedPhotoFile(file)
    setSelectedPhotoName(file.name)
    setSuccessMessage("")
  }

  const clearPhoto = () => {
    setFormState((prev) => ({ ...prev, photoURL: "" }))
    setSelectedPhotoName("")
    setSelectedPhotoFile(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firebaseUser) {
      setErrorMessage("You must be logged in to update your account.")
      return
    }

    setSaving(true)
    setSavePhase(selectedPhotoFile ? "uploading" : "saving")
    setErrorMessage("")
    setSuccessMessage("")

    try {
      const authToken = await withTimeout(
        firebaseUser.getIdToken(true),
        10000,
        "Could not refresh your session. Please log out and log in again.",
      )

      const uploadedPhotoUrl =
        selectedPhotoFile
          ? await withTimeout(
              uploadProfilePhoto(firebaseUser.uid, selectedPhotoFile),
              20000,
              "Profile image upload timed out. Check your Firebase Storage rules and try again.",
            )
          : formState.photoURL.trim() || null

      const payload = {
        displayName: formState.displayName.trim(),
        phone: formState.phone.trim(),
        photoURL: uploadedPhotoUrl,
      }

      setSavePhase("saving")

      const response = await fetchWithTimeout(`${getApiBaseUrl()}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))
      if (response.status === 401) {
        setErrorMessage("Your session expired. Please log out and log in again.")
        return
      }
      if (!response.ok) {
        setErrorMessage(data?.error ?? "Failed to update account.")
        return
      }

      await refreshProfile()
      setSelectedPhotoFile(null)
      setSelectedPhotoName("")
      setSelectedPhotoPreviewUrl("")
      setSuccessMessage("Account updated successfully.")
    } catch (error) {
      console.error("Failed to update account", error)
      setErrorMessage(error instanceof Error ? error.message : "Could not update your account. Please try again.")
    } finally {
      setSaving(false)
      setSavePhase("idle")
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Helmet>
        <title>Account | GC-Renting</title>
      </Helmet>
      <Header />

      <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-10">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Account</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your profile picture and account information.</p>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
            <p className="text-sm font-semibold text-emerald-900">Account type</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-emerald-800">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs text-white">✓</span>
              <span>{accountKind.label}</span>
            </div>
            <p className="mt-2 text-xs text-emerald-900/80">{accountKind.helper}</p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-gray-700">
              Profile picture
              <input
                accept="image/*"
                className="sr-only"
                id="profile-photo-file"
                onChange={handlePhotoFileChange}
                type="file"
              />
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label
                  className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#047857] bg-[#047857] px-4 text-xs font-semibold text-white transition hover:bg-[#036c50]"
                  htmlFor="profile-photo-file"
                >
                  {selectedPhotoName ? "Choose another picture" : "Choose picture"}
                </label>
                <span className="text-xs text-gray-600">
                  {selectedPhotoName || "No file selected"}
                </span>
              </div>
            </label>

            <div className="flex justify-start">
              <button
                className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                onClick={clearPhoto}
                type="button"
              >
                Remove picture
              </button>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-black/10 bg-[#f9faf9] p-4">
              {selectedPhotoPreviewUrl ? (
                <img
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover"
                  src={selectedPhotoPreviewUrl}
                />
              ) : formState.photoURL.trim() ? (
                <img
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover"
                  src={formState.photoURL.trim()}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#047857]/15 text-sm font-semibold text-[#047857]">
                  {(formState.displayName || "GC").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">Photo preview</p>
                <p className="text-xs text-gray-600">This will appear in your profile dropdown.</p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">
                Display name
                <input
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  onChange={handleChange("displayName")}
                  placeholder="Your name"
                  value={formState.displayName}
                />
              </label>

              <label className="text-sm font-semibold text-gray-700">
                Phone
                <input
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  onChange={handleChange("phone")}
                  placeholder="+34 600 000 000"
                  value={formState.phone}
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-gray-700">
              Email
              <input
                className="mt-2 w-full cursor-not-allowed rounded-xl border border-black/10 bg-gray-100 px-4 py-3 text-sm text-gray-600"
                disabled
                value={profile?.email ?? firebaseUser?.email ?? ""}
              />
            </label>

            {errorMessage && <p className="text-sm font-medium text-red-700">{errorMessage}</p>}
            {successMessage && <p className="text-sm font-medium text-[#047857]">{successMessage}</p>}

            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition hover:bg-[#036c50] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={saving || !hasChanges}
              type="submit"
            >
              {saving
                ? savePhase === "uploading"
                  ? "Uploading picture..."
                  : "Saving account..."
                : hasChanges
                  ? "Save changes"
                  : "No changes to save"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_")

const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
  const timestamp = Date.now()
  const fileRef = ref(storage, `profile-photos/${uid}/${timestamp}-${sanitizeFileName(file.name)}`)
  await uploadBytes(fileRef, file, { contentType: file.type })
  return getDownloadURL(fileRef)
}

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      reject(new Error(timeoutMessage))
    }, timeoutMs)

    promise
      .then((value) => {
        window.clearTimeout(timeoutId)
        resolve(value)
      })
      .catch((error: unknown) => {
        window.clearTimeout(timeoutId)
        reject(error)
      })
  })
}

const fetchWithTimeout = async (url: string, init: RequestInit): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 15000)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Saving account timed out. Please check that backend API is running and try again.")
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export default Account
