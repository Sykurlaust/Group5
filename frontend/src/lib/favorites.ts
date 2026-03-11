import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "./firebase"

export const FAVORITES_UPDATED_EVENT = "gc-renting:favorites-updated"

const favRef = (uid: string, listingId: string) =>
  doc(db, "users", uid, "favorites", listingId)

const favsColRef = (uid: string) =>
  collection(db, "users", uid, "favorites")

const dispatchUpdated = (uid: string) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT, { detail: { uid } }))
  }
}

export const getFavoriteListingIds = async (uid: string): Promise<string[]> => {
  const snap = await getDocs(favsColRef(uid))
  return snap.docs.map((d) => d.id)
}

export const isListingFavorited = async (uid: string, listingId: string): Promise<boolean> => {
  const snap = await getDoc(favRef(uid, listingId))
  return snap.exists()
}

export const toggleFavoriteListing = async (uid: string, listingId: string): Promise<boolean> => {
  const ref = favRef(uid, listingId)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    await deleteDoc(ref)
    dispatchUpdated(uid)
    return false
  }
  await setDoc(ref, { addedAt: serverTimestamp() })
  dispatchUpdated(uid)
  return true
}

