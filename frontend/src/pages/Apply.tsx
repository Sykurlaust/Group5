import { useMemo, useState } from "react"
import type { FormEvent } from "react"
import { Helmet } from "react-helmet-async"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useAuth } from "../context/AuthContext"
import { db } from "../lib/firebase"

type ApplyFormState = {
  applicantDisplayName: string
  applicantPhone: string
  currentCity: string
  monthlyIncome: string
  preferredMoveInDate: string
  motivation: string
}

const initialFormState: ApplyFormState = {
  applicantDisplayName: "",
  applicantPhone: "",
  currentCity: "",
  monthlyIncome: "",
  preferredMoveInDate: "",
  motivation: "",
}


const Apply = () => {
  const { profile, firebaseUser } = useAuth()
  const [formState, setFormState] = useState<ApplyFormState>(() => ({
    ...initialFormState,
    applicantDisplayName: profile?.displayName ?? firebaseUser?.displayName ?? "",
    applicantPhone: profile?.phone ?? "",
  }))
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const canSubmit = useMemo(() => {
    return (
      formState.applicantDisplayName.trim().length >= 2 &&
      formState.applicantPhone.trim().length >= 7 &&
      formState.currentCity.trim().length >= 2 &&
      Number(formState.monthlyIncome) > 0 &&
      formState.preferredMoveInDate.trim().length > 0 &&
      formState.motivation.trim().length >= 20
    )
  }, [formState])

  const submissionBlocked = submitting || !firebaseUser

  const handleChange = (field: keyof ApplyFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firebaseUser) {
      setErrorMessage("You must be logged in to submit an application.")
      return
    }

    setSubmitting(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      await addDoc(collection(db, "applications"), {
        userId: firebaseUser.uid,
        userEmail: firebaseUser.email ?? "",
        applicantDisplayName: formState.applicantDisplayName.trim(),
        applicantPhone: formState.applicantPhone.trim(),
        currentCity: formState.currentCity.trim(),
        monthlyIncome: Number(formState.monthlyIncome),
        preferredMoveInDate: formState.preferredMoveInDate,
        motivation: formState.motivation.trim(),
        status: "pending",
        createdAt: serverTimestamp(),
      })

      setSuccessMessage("Application submitted successfully. Our team will review it soon.")
      setFormState((prev) => ({
        ...initialFormState,
        applicantDisplayName: prev.applicantDisplayName,
        applicantPhone: prev.applicantPhone,
      }))
    } catch (error) {
      console.error("Failed to submit renter application", error)
      setErrorMessage("Could not submit your application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Helmet>
        <title>Apply | GC-Renting</title>
      </Helmet>
      <Header />

      <main className="mx-auto w-full max-w-4xl px-6 pb-16 pt-10">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-semibold md:text-3xl">Apply to be a landlord</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill out this form and your application will be stored in our database for review.
          </p>

          {!firebaseUser && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Please sign in to submit your rental application.
            </div>
          )}

          <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">
                Full name
                <input
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  onChange={handleChange("applicantDisplayName")}
                  placeholder="Your full name"
                  value={formState.applicantDisplayName}
                />
              </label>

              <label className="text-sm font-semibold text-gray-700">
                Phone number
                <input
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  onChange={handleChange("applicantPhone")}
                  placeholder="+34 600 000 000"
                  value={formState.applicantPhone}
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-gray-700">
                Current city
                <input
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  onChange={handleChange("currentCity")}
                  placeholder="Las Palmas"
                  value={formState.currentCity}
                />
              </label>

              <label className="text-sm font-semibold text-gray-700">
                Monthly income (EUR)
                <input
                  className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                  min="0"
                  onChange={handleChange("monthlyIncome")}
                  placeholder="1800"
                  type="number"
                  value={formState.monthlyIncome}
                />
              </label>
            </div>

            <label className="text-sm font-semibold text-gray-700">
              Preferred move-in date
              <input
                className="mt-2 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                onChange={handleChange("preferredMoveInDate")}
                type="date"
                value={formState.preferredMoveInDate}
              />
            </label>

            <label className="text-sm font-semibold text-gray-700">
              Why should you be approved? (minimum 20 characters)
              <textarea
                className="mt-2 min-h-36 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                onChange={handleChange("motivation")}
                placeholder="Write your landlord profile, experience, and why you are a good fit..."
                value={formState.motivation}
              />
            </label>

            {errorMessage && <p className="text-sm font-medium text-red-700">{errorMessage}</p>}
            {successMessage && <p className="text-sm font-medium text-[#047857]">{successMessage}</p>}

            <button
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition hover:bg-[#036c50] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={submissionBlocked || !canSubmit}
              type="submit"
            >
              {submitting ? "Submitting..." : firebaseUser ? "Submit application" : "Sign in to apply"}
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Apply
