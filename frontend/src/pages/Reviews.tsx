import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"
import { useAuth } from "../context/AuthContext"

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api"

type Review = {
  id: string
  userId: string
  userName: string
  userPhoto: string | null
  rating: number
  title: string
  comment: string
  listingId: string
  createdAt: { _seconds: number } | null
}

const StarRating = ({
  value,
  onChange,
}: {
  value: number
  onChange?: (v: number) => void
}) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onChange?.(i + 1)}
        className={`text-2xl transition ${i < value ? "text-amber-400" : "text-gray-300"} ${onChange ? "cursor-pointer hover:text-amber-300" : "cursor-default"}`}
      >
        ★
      </button>
    ))}
  </div>
)

const ReviewCard = ({
  review,
  isOwner,
  isAdmin,
  onEdit,
  onDelete,
}: {
  review: Review
  isOwner: boolean
  isAdmin: boolean
  onEdit: (r: Review) => void
  onDelete: (id: string) => void
}) => (
  <article className="flex flex-col gap-3 rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
    <StarRating value={review.rating} />
    <p className="font-semibold text-[#1f1f1f]">{review.title}</p>
    <p className="text-sm text-gray-600">{review.comment}</p>
    <div className="mt-auto flex items-center justify-between pt-3 border-t border-black/5">
      <div className="flex items-center gap-2">
        {review.userPhoto ? (
          <img src={review.userPhoto} alt={review.userName} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#047857] text-xs font-semibold text-white">
            {review.userName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-xs font-medium text-gray-700">{review.userName}</span>
      </div>
      {(isOwner || isAdmin) && (
        <div className="flex gap-2">
          {isOwner && (
            <button
              onClick={() => onEdit(review)}
              className="text-xs text-[#047857] hover:underline"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => onDelete(review.id)}
            className="text-xs text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  </article>
)

const ReviewForm = ({
  initial,
  onSubmit,
  onCancel,
  loading,
}: {
  initial?: Partial<Review>
  onSubmit: (data: { rating: number; title: string; comment: string; listingId: string }) => void
  onCancel: () => void
  loading: boolean
}) => {
  const [rating, setRating] = useState(initial?.rating ?? 5)
  const [title, setTitle] = useState(initial?.title ?? "")
  const [comment, setComment] = useState(initial?.comment ?? "")

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ rating, title, comment, listingId: "general" })
      }}
      className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm"
    >
      <h3 className="text-lg font-semibold">{initial?.id ? "Edit review" : "Write a review"}</h3>

      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Rating</p>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Title
        <input
          required
          minLength={3}
          maxLength={100}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Comment
        <textarea
          required
          minLength={10}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us about your experience finding a home here..."
          rows={4}
          className="mt-1 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857] resize-none"
        />
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition hover:bg-[#036c50] disabled:opacity-50"
        >
          {loading ? "Saving..." : initial?.id ? "Save changes" : "Submit review"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 px-6 text-sm font-semibold transition hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

const Reviews = () => {
  const { profile, token, loading: authLoading } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Review | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/reviews?limit=50`)
      const data = await res.json()
      setReviews(data.reviews ?? [])
    } catch {
      setError("Failed to load reviews.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void fetchReviews() }, [])

  const handleSubmit = async (data: {
    rating: number
    title: string
    comment: string
    listingId: string
  }) => {
    if (!token || !profile) return
    setSubmitting(true)
    setError(null)

    try {
      if (editing) {
        await fetch(`${API_BASE}/reviews/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ rating: data.rating, title: data.title, comment: data.comment }),
        })
      } else {
        const res = await fetch(`${API_BASE}/reviews/listing/${data.listingId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            rating: data.rating,
            title: data.title,
            comment: data.comment,
            userName: profile.displayName,
            userPhoto: profile.photoURL,
          }),
        })
        if (res.status === 409) {
          setError("You have already reviewed this listing.")
          setSubmitting(false)
          return
        }
        if (!res.ok) {
          const err = await res.json()
          setError(err.error ?? "Failed to submit review.")
          setSubmitting(false)
          return
        }
      }

      setFormOpen(false)
      setEditing(null)
      await fetchReviews()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!window.confirm("Are you sure you want to delete this review?")) return

    try {
      await fetch(`${API_BASE}/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      await fetchReviews()
    } catch {
      setError("Failed to delete review.")
    }
  }

  const openEdit = (review: Review) => {
    setEditing(review)
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setError(null)
  }

  return (
    <>
      <Helmet>
        <title>Reviews | GC-Renting</title>
      </Helmet>
      <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
        <Header />
        <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-gray-500">Testimonials</p>
              <h1 className="mt-1 text-3xl font-semibold">All reviews</h1>
            </div>
            {!authLoading && (
              profile && !formOpen ? (
                <button
                  onClick={() => { setEditing(null); setFormOpen(true) }}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition hover:bg-[#036c50]"
                >
                  + Write a review
                </button>
              ) : !profile && !formOpen ? (
                <Link
                  to="/login"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#047857] px-6 text-sm font-semibold text-[#047857] transition hover:bg-[#047857] hover:text-white"
                >
                  Sign in to write a review
                </Link>
              ) : null
            )}
          </div>

          {formOpen && (
            <div className="mt-8">
              <ReviewForm
                initial={editing ?? undefined}
                onSubmit={handleSubmit}
                onCancel={closeForm}
                loading={submitting}
              />
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 text-center text-sm text-gray-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-black/5 bg-white px-8 py-14 text-center shadow-sm">
              <span className="text-4xl">💬</span>
              <p className="text-lg font-semibold text-[#1f1f1f]">No reviews yet</p>
              {profile ? (
                <>
                  <p className="max-w-xs text-sm text-gray-500">Be the first to share your experience finding a home in Gran Canaria.</p>
                  <button
                    onClick={() => { setEditing(null); setFormOpen(true); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                    className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-8 text-sm font-semibold text-white transition hover:bg-[#036c50]"
                  >
                    Write the first review
                  </button>
                </>
              ) : (
                <>
                  <p className="max-w-xs text-sm text-gray-500">Be the first to share your experience. You need an account to write a review.</p>
                  <Link
                    to="/login"
                    className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-8 text-sm font-semibold text-white transition hover:bg-[#036c50]"
                  >
                    Sign in to write the first review
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isOwner={profile?.uid === review.userId}
                    isAdmin={profile?.role === "admin"}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              {!profile && !authLoading && (
                <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-black/5 bg-white px-8 py-8 text-center shadow-sm">
                  <p className="text-sm font-semibold text-[#1f1f1f]">Did you rent with us? Share your experience</p>
                  <p className="text-sm text-gray-500">You need an account to leave a review.</p>
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition hover:bg-[#036c50]"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 px-6 text-sm font-semibold transition hover:bg-gray-50"
                    >
                      Create account
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Reviews
