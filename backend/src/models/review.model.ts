import { Timestamp } from "firebase-admin/firestore"

export interface Review {
  id: string
  listingId: string
  userId: string
  userName: string
  userPhoto: string | null
  rating: number
  title: string
  comment: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CreateReviewData {
  listingId: string
  userId: string
  userName: string
  userPhoto: string | null
  rating: number
  title: string
  comment: string
}

export interface UpdateReviewData {
  rating?: number
  title?: string
  comment?: string
}
