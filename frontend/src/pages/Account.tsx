import { useEffect, useMemo, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"
import { Helmet } from "react-helmet-async"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { resolveUserRole, useAuth } from "../context/AuthContext"
import { getApiBaseUrl } from "../lib/apiClient"

type AccountFormState = {
  displayName: string
  phone: string
  photoURL: string
}

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const MAX_PROFILE_IMAGE_DIMENSION = 640
const MAX_PROFILE_IMAGE_DATA_URL_CHARS = 700_000
const API_BASE_URL = getApiBaseUrl()


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
    const role = resolveUserRole(profile?.email ?? firebaseUser?.email ?? "", profile?.role)
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

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setErrorMessage("Please choose a PNG, JPG, or WEBP image.")
      return
    }

    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      setErrorMessage("Image must be 5MB or smaller.")
      return
    }

    setErrorMessage("")
    setSelectedPhotoFile(file)
    setSelectedPhotoName(file.name)
    setSuccessMessage("")
  }

  const clearPhoto = () => {
    if (saving) return
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
              buildProfilePhotoDataUrl(selectedPhotoFile),
              15000,
              "Image processing timed out. Please choose a smaller picture and try again.",
            )
          : formState.photoURL.trim() || null

      const payload = {
        displayName: formState.displayName.trim(),
        phone: formState.phone.trim(),
        photoURL: uploadedPhotoUrl,
      }

      setSavePhase("saving")

      const response = await withTimeout(
        fetch(`${API_BASE_URL}/auth/me`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }),
        10000,
        "Request timed out",
      )

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
      setErrorMessage(toFriendlyErrorMessage(error))
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
                disabled={saving}
                id="profile-photo-file"
                onChange={handlePhotoFileChange}
                type="file"
              />
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <label
                  className={`inline-flex h-10 items-center justify-center rounded-full border border-[#047857] px-4 text-xs font-semibold text-white transition ${
                    saving
                      ? "cursor-not-allowed bg-[#047857]/70"
                      : "cursor-pointer bg-[#047857] hover:bg-[#036c50]"
                  }`}
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
                disabled={saving}
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
                  ? "Processing picture..."
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

const toFriendlyErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error instanceof TypeError && error.message.toLowerCase().includes("fetch")) {
      return "Could not save account changes because the backend API is unreachable. Check VITE_API_BASE_URL and make sure the backend is running."
    }
    return error.message
  }

  return "Could not update your account. Please try again."
}

const readFileAsDataUrl = async (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "")
    reader.onerror = () => reject(new Error("Could not read selected image file."))
    reader.readAsDataURL(file)
  })
}

const loadImage = async (src: string): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error("Could not process selected image file."))
    img.src = src
  })
}

const buildProfilePhotoDataUrl = async (file: File): Promise<string> => {
  const sourceDataUrl = await readFileAsDataUrl(file)
  const image = await loadImage(sourceDataUrl)

  const sourceWidth = image.naturalWidth || image.width
  const sourceHeight = image.naturalHeight || image.height
  const maxSourceDimension = Math.max(sourceWidth, sourceHeight) || 1
  const scale = Math.min(1, MAX_PROFILE_IMAGE_DIMENSION / maxSourceDimension)
  const targetWidth = Math.max(1, Math.round(sourceWidth * scale))
  const targetHeight = Math.max(1, Math.round(sourceHeight * scale))

  const canvas = document.createElement("canvas")
  canvas.width = targetWidth
  canvas.height = targetHeight

  const context = canvas.getContext("2d")
  if (!context) {
    return sourceDataUrl
  }

  context.drawImage(image, 0, 0, targetWidth, targetHeight)

  let output = canvas.toDataURL("image/jpeg", 0.85)
  if (output.length > MAX_PROFILE_IMAGE_DATA_URL_CHARS) {
    output = canvas.toDataURL("image/jpeg", 0.65)
  }

  if (output.length > MAX_PROFILE_IMAGE_DATA_URL_CHARS) {
    throw new Error("Selected image is too large after optimization. Please choose a smaller image.")
  }

  return output
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


export default Account
