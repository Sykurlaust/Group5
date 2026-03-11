import { Timestamp, FieldValue } from "firebase-admin/firestore"
import { firestore } from "../config/firebase.js"
import type { Review, CreateReviewData, UpdateReviewData } from "../models/review.model.js"

const reviewsCollection = firestore.collection("reviews")

export const getReviews = async (
  limit = 20,
  startAfter?: string,
): Promise<{ reviews: Review[]; nextCursor: string | null }> => {
  let q = reviewsCollection.orderBy("createdAt", "desc").limit(limit)

  if (startAfter) {
    const cursorDoc = await reviewsCollection.doc(startAfter).get()
    if (cursorDoc.exists) q = q.startAfter(cursorDoc)
  }

  const snapshot = await q.get()
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Review)
  const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : null
  return { reviews, nextCursor }
}

export const getReviewById = async (id: string): Promise<Review | null> => {
  const doc = await reviewsCollection.doc(id).get()
  if (!doc.exists) return null
  return { id: doc.id, ...doc.data() } as Review
}

export const getUserReviewForListing = async (
  userId: string,
  listingId: string,
): Promise<Review | null> => {
  const snapshot = await reviewsCollection
    .where("userId", "==", userId)
    .where("listingId", "==", listingId)
    .limit(1)
    .get()

  if (snapshot.empty) return null
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as Review
}

export const getMyReviews = async (userId: string): Promise<Review[]> => {
  const snapshot = await reviewsCollection
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get()
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Review)
}

export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const now = Timestamp.now()
  const docRef = await reviewsCollection.add({
    ...data,
    createdAt: now,
    updatedAt: now,
  })

  await updateListingRating(data.listingId)

  const created = await docRef.get()
  return { id: created.id, ...created.data() } as Review
}

export const updateReview = async (id: string, data: UpdateReviewData): Promise<Review | null> => {
  const docRef = reviewsCollection.doc(id)
  const doc = await docRef.get()
  if (!doc.exists) return null

  await docRef.update({ ...data, updatedAt: Timestamp.now() })

  const listingId = doc.data()?.listingId
  if (listingId) await updateListingRating(listingId)

  const updated = await docRef.get()
  return { id: updated.id, ...updated.data() } as Review
}

export const deleteReview = async (id: string): Promise<boolean> => {
  const doc = await reviewsCollection.doc(id).get()
  if (!doc.exists) return false

  const listingId = doc.data()?.listingId
  await reviewsCollection.doc(id).delete()

  if (listingId) await updateListingRating(listingId)
  return true
}

const updateListingRating = async (listingId: string) => {
  const snapshot = await reviewsCollection.where("listingId", "==", listingId).get()
  const count = snapshot.docs.length

  if (count === 0) {
    await firestore.collection("listings").doc(listingId).update({
      averageRating: FieldValue.delete(),
      reviewCount: 0,
    })
    return
  }

  const total = snapshot.docs.reduce((sum, doc) => sum + (doc.data().rating ?? 0), 0)
  const average = Math.round((total / count) * 10) / 10

  await firestore.collection("listings").doc(listingId).update({
    averageRating: average,
    reviewCount: count,
  })
}
