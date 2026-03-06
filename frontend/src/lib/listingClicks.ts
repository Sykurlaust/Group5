import { doc, increment, updateDoc } from "firebase/firestore"
import { db } from "./firebase"

export const incrementListingClicks = async (listingId: string) => {
  if (!listingId) {
    return
  }

  await updateDoc(doc(db, "listings", listingId), {
    clicks: increment(1),
  })
}
