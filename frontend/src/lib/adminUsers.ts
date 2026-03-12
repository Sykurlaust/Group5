import type { UserRole } from "../context/AuthContext"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore"
import { db } from "./firebase"
import { callAuthenticatedEndpoint } from "./apiClient"

interface FirestoreTimestampLike {
  seconds: number
  nanoseconds: number
}

export interface AdminUserRecord {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  phone: string | null
  role: UserRole
  verified: boolean
  createdAt?: FirestoreTimestampLike | string
  updatedAt?: FirestoreTimestampLike | string
}

export interface AdminUserListResponse {
  users: AdminUserRecord[]
  nextCursor: string | null
}

export interface AdminDashboardStats {
  landlords: number
  totalApplications: number
  reviews: number
  weeklyVisits: number
  dailyVisitSeries: number[]
  dailyVisitLabels: string[]
}

export interface AdminApplicationRecord {
  id: string
  status: "pending" | "approved" | "declined"
}

export interface AdminApplicationDecisionResponse {
  application: AdminApplicationRecord
  updatedUserRole: UserRole | null
}

export interface CreateAdminUserPayload {
  displayName: string
  email: string
  password: string
  role: UserRole
  phone?: string
}


export const listAdminUsers = async (
  _token: string,
  params: { cursor?: string; limit?: number } = {},
): Promise<AdminUserListResponse> => {
  try {
    const pageLimit = params.limit ?? 50
    const baseQuery = params.cursor
      ? query(collection(db, "users"), orderBy("email"), startAfter(params.cursor), limit(pageLimit))
      : query(collection(db, "users"), orderBy("email"), limit(pageLimit))
    const snap = await getDocs(baseQuery)
    const users: AdminUserRecord[] = snap.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
    } as AdminUserRecord))
    const nextCursor =
      snap.docs.length === pageLimit
        ? ((snap.docs[snap.docs.length - 1].data().email as string) ?? null)
        : null
    return { users, nextCursor }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "Failed to list users")
  }
}

export const createAdminUser = async (
  _token: string,
  _payload: CreateAdminUserPayload,
): Promise<AdminUserRecord> => {
  throw new Error(
    "Creating users requires the backend. Use the Firebase console or deploy the backend server.",
  )
}

export const fetchAdminDashboardStats = async (token: string): Promise<AdminDashboardStats> => {
  const response = await callAuthenticatedEndpoint(token, "/admin/stats")

  if (!response.ok) {
    let message = "Failed to load dashboard statistics"
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) {
        message = body.error
      }
    } catch {
      // Ignore JSON parse failures and keep default message.
    }
    throw new Error(message)
  }

  return (await response.json()) as AdminDashboardStats
}

export const updateAdminApplicationStatus = async (
  token: string,
  applicationId: string,
  status: "pending" | "approved" | "declined",
): Promise<AdminApplicationDecisionResponse> => {
  const response = await callAuthenticatedEndpoint(token, `/admin/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    let message = "Failed to update application status"
    try {
      const body = (await response.json()) as { error?: string }
      if (body.error) {
        message = body.error
      }
    } catch {
      // Keep fallback message
    }
    throw new Error(message)
  }

  return (await response.json()) as AdminApplicationDecisionResponse
}

export const updateAdminUserRole = async (
  _token: string,
  uid: string,
  role: UserRole,
): Promise<AdminUserRecord> => {
  await updateDoc(doc(db, "users", uid), { role })
  const snap = await getDoc(doc(db, "users", uid))
  return { uid, ...snap.data() } as AdminUserRecord
}

export const updateAdminUserVerification = async (
  _token: string,
  uid: string,
  verified: boolean,
): Promise<AdminUserRecord> => {
  await updateDoc(doc(db, "users", uid), { verified })
  const snap = await getDoc(doc(db, "users", uid))
  return { uid, ...snap.data() } as AdminUserRecord
}

export const deleteAdminUser = async (_token: string, _uid: string): Promise<void> => {
  throw new Error(
    "Deleting users requires the backend. Use the Firebase console or deploy the backend server.",
  )
}

