import { Timestamp } from "firebase-admin/firestore"

export type UserRole = "admin" | "landlord" | "tenant" | "guest"

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  phone: string | null
  role: UserRole
  verified: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CreateUserData {
  uid: string
  email: string
  displayName: string
  photoURL?: string | null
  phone?: string | null
  role?: UserRole
}
