import { Helmet } from "react-helmet-async"
import { doc, getDoc, type DocumentData, type QueryDocumentSnapshot } from "firebase/firestore"
import { useEffect, useMemo, useState } from "react"
import type { FormEvent } from "react"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { useAuth } from "../context/AuthContext"
import { db } from "../lib/firebase"
import { getFavoriteListingIds } from "../lib/favorites"

type SellerListing = {
  id: string
  title: string
  sellerName: string
  sellerImage: string
  phone: string
  accountType: "admin" | "renter"
}

type StoredMessage = {
  listingId: string
  sellerName: string
  accountType: "admin" | "renter"
  message: string
  createdAt: string
}

const Messages = () => {
  const { firebaseUser } = useAuth()
  const [listings, setListings] = useState<SellerListing[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedListingId, setSelectedListingId] = useState("")
  const [messageText, setMessageText] = useState("")
  const [notice, setNotice] = useState("")

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === selectedListingId) ?? null,
    [listings, selectedListingId],
  )

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setListings([])
      setLoading(false)
      return
    }

    const loadSellerListings = async () => {
      setLoading(true)
      try {
        const favoriteIds = await getFavoriteListingIds(firebaseUser.uid)
        if (favoriteIds.length === 0) {
          setListings([])
          setSelectedListingId("")
          return
        }

        const snapshots = await Promise.all(
          favoriteIds.map((id: string) => getDoc(doc(db, "listings", id))),
        )
        const nextListings = snapshots
          .filter(
            (snapshot): snapshot is QueryDocumentSnapshot<DocumentData> => snapshot.exists(),
          )
          .map((snapshot: QueryDocumentSnapshot<DocumentData>) => {
            const data = snapshot.data()
            const sellerName =
              readString(data.landlordName) || readString(data.ownerName) || readString(data.contactName) || "Property Seller"
            const roleRaw = readString(data.accountType) || readString(data.sellerRole) || readString(data.role)
            const accountType: "admin" | "renter" = roleRaw.toLowerCase() === "admin" ? "admin" : "renter"

            return {
              id: snapshot.id,
              title: readString(data.title) || "Untitled listing",
              sellerName,
              sellerImage: readString(data.landlordImage) || readString(data.ownerImage),
              phone: readString(data.phone),
              accountType,
            } satisfies SellerListing
          })

        const order = new Map(favoriteIds.map((id: string, index: number) => [id, index]))
        nextListings.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
        setListings(nextListings)

        setSelectedListingId((current) => {
          if (current && nextListings.some((listing) => listing.id === current)) {
            return current
          }
          return nextListings[0]?.id ?? ""
        })
      } finally {
        setLoading(false)
      }
    }

    void loadSellerListings()
  }, [firebaseUser?.uid])

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!firebaseUser?.uid || !selectedListing || !messageText.trim()) {
      return
    }

    const storageKey = `gc-renting:messages:${firebaseUser.uid}`
    const existing = readStoredMessages(storageKey)
    const nextMessage: StoredMessage = {
      listingId: selectedListing.id,
      sellerName: selectedListing.sellerName,
      accountType: selectedListing.accountType,
      message: messageText.trim(),
      createdAt: new Date().toISOString(),
    }

    window.localStorage.setItem(storageKey, JSON.stringify([nextMessage, ...existing]))
    setMessageText("")
    setNotice(`Message sent to ${selectedListing.sellerName}.`)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#1f1f1f]">
      <Helmet>
        <title>Messages | GC-Renting</title>
      </Helmet>
      <Header />

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-10">
        <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold md:text-3xl">Messages</h1>
          <p className="mt-2 text-sm text-gray-600">
            Contact the seller account for your favorited homes. Sellers can be admin accounts or renter accounts.
          </p>

          {loading ? (
            <div className="mt-6 rounded-2xl border border-black/10 bg-[#f9faf9] p-6 text-center text-sm text-gray-600">
              Loading seller information...
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-black/10 bg-[#f9faf9] p-6 text-sm text-gray-700">
              You do not have any favorited homes yet. Add favorites first to start messaging a seller.
            </div>
          ) : (
            <form className="mt-6 space-y-5" onSubmit={handleSendMessage}>
              <label className="block text-sm font-semibold text-gray-700" htmlFor="seller-select">
                Choose a home seller
              </label>
              <select
                id="seller-select"
                className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                onChange={(event) => setSelectedListingId(event.target.value)}
                value={selectedListingId}
              >
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title} - {listing.sellerName}
                  </option>
                ))}
              </select>

              {selectedListing && (
                <article className="rounded-2xl border border-black/10 bg-[#f9faf9] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      {selectedListing.sellerImage ? (
                        <img
                          alt={selectedListing.sellerName}
                          className="h-14 w-14 rounded-full object-cover"
                          src={selectedListing.sellerImage}
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#047857]/15 text-sm font-semibold text-[#047857]">
                          {selectedListing.sellerName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-base font-semibold text-gray-900">{selectedListing.sellerName}</p>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {selectedListing.accountType === "admin" ? "Admin account" : "Renter account"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{selectedListing.phone ? `Phone: ${selectedListing.phone}` : "Phone: not provided"}</p>
                  </div>
                </article>
              )}

              <label className="block text-sm font-semibold text-gray-700" htmlFor="message-text">
                Your message
              </label>
              <textarea
                id="message-text"
                className="min-h-40 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-[#047857]"
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Hi, I am interested in this home. Is it still available?"
                value={messageText}
              />

              {notice && <p className="text-sm font-medium text-[#047857]">{notice}</p>}

              <button
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#047857] px-6 text-sm font-semibold text-white transition hover:bg-[#036c50] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!selectedListing || messageText.trim().length === 0}
                type="submit"
              >
                Send message
              </button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

const readString = (value: unknown) => (typeof value === "string" ? value : "")

const readStoredMessages = (storageKey: string): StoredMessage[] => {
  const raw = window.localStorage.getItem(storageKey)
  if (!raw) {
    return []
  }
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((entry): entry is StoredMessage => {
      if (typeof entry !== "object" || entry === null) {
        return false
      }
      const candidate = entry as Partial<StoredMessage>
      return (
        typeof candidate.listingId === "string" &&
        typeof candidate.sellerName === "string" &&
        (candidate.accountType === "admin" || candidate.accountType === "renter") &&
        typeof candidate.message === "string" &&
        typeof candidate.createdAt === "string"
      )
    })
  } catch {
    return []
  }
}

export default Messages
