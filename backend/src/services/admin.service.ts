import { firestore, firebaseAuth } from "../config/firebase.js"
import type { User, UserRole } from "../models/user.model.js"
import { Timestamp } from "firebase-admin/firestore"

const usersCollection = firestore.collection("users")

export interface AdminDashboardStats {
  landlords: number
  totalApplications: number
  reviews: number
  weeklyVisits: number
  dailyVisitSeries: number[]
  dailyVisitLabels: string[]
}

export type ApplicationStatus = "pending" | "approved" | "declined"

type ApplicationDecisionResult = {
  application: Record<string, unknown>
  updatedUserRole: UserRole | null
}

const buildLastSevenDays = (): Array<{ key: string; label: string }> => {
  const formatter = new Intl.DateTimeFormat("en-GB", { weekday: "short" })
  const now = new Date()

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now)
    date.setDate(now.getDate() - (6 - index))

    return {
      key: date.toISOString().slice(0, 10),
      label: formatter.format(date),
    }
  })
}

const getTotalApplicationsCount = async (): Promise<number> => {
  const snapshot = await firestore.collection("applications").get()
  return snapshot.size
}

export interface AdminCreateUserInput {
  email: string
  password: string
  displayName: string
  role: UserRole
  phone?: string | null
}

export const listUsers = async (
  limit = 20,
  startAfter?: string,
): Promise<{ users: User[]; nextCursor: string | null }> => {
  let query = usersCollection.orderBy("createdAt", "desc").limit(limit)

  if (startAfter) {
    const cursorDoc = await usersCollection.doc(startAfter).get()
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc)
    }
  }

  const snapshot = await query.get()
  const users = snapshot.docs.map((doc) => {
    const data = doc.data() as User
    return { ...data, uid: data.uid ?? doc.id }
  })
  const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : null

  return { users, nextCursor }
}

export const getUserByUid = async (uid: string): Promise<User | null> => {
  const doc = await usersCollection.doc(uid).get()
  if (!doc.exists) return null
  const data = doc.data() as User
  return { ...data, uid: data.uid ?? doc.id }
}

export const updateUserRole = async (uid: string, role: UserRole): Promise<User | null> => {
  const docRef = usersCollection.doc(uid)
  const doc = await docRef.get()
  if (!doc.exists) return null

  await docRef.update({ role, updatedAt: Timestamp.now() })
  const updated = await docRef.get()
  const data = updated.data() as User
  return { ...data, uid: data.uid ?? updated.id }
}

export const updateUserVerified = async (uid: string, verified: boolean): Promise<User | null> => {
  const docRef = usersCollection.doc(uid)
  const doc = await docRef.get()
  if (!doc.exists) return null

  await docRef.update({ verified, updatedAt: Timestamp.now() })
  const updated = await docRef.get()
  const data = updated.data() as User
  return { ...data, uid: data.uid ?? updated.id }
}

export const deleteUser = async (uid: string): Promise<boolean> => {
  const doc = await usersCollection.doc(uid).get()
  if (!doc.exists) return false

  await usersCollection.doc(uid).delete()
  await firebaseAuth.deleteUser(uid)
  return true
}

export const createUserWithRole = async (payload: AdminCreateUserInput): Promise<User> => {
  const now = Timestamp.now()
  const userRecord = await firebaseAuth.createUser({
    email: payload.email,
    password: payload.password,
    displayName: payload.displayName,
    phoneNumber: payload.phone ?? undefined,
  })

  const userDocument: User = {
    uid: userRecord.uid,
    email: userRecord.email ?? payload.email,
    displayName: userRecord.displayName ?? payload.displayName,
    photoURL: userRecord.photoURL ?? null,
    phone: userRecord.phoneNumber ?? payload.phone ?? null,
    role: payload.role,
    verified: userRecord.emailVerified ?? false,
    createdAt: now,
    updatedAt: now,
  }

  await usersCollection.doc(userRecord.uid).set(userDocument)
  return userDocument
}

export const getDashboardStats = async (): Promise<AdminDashboardStats> => {
  const [landlordsSnapshot, totalApplications, reviewsSnapshot, dailyVisitsSnapshot] = await Promise.all([
    usersCollection.where("role", "==", "landlord").get(),
    getTotalApplicationsCount(),
    firestore.collection("reviews").get(),
    firestore.collection("analytics_page_views_daily").orderBy("date", "desc").limit(7).get(),
  ])

  const lastSevenDays = buildLastSevenDays()
  const dailyViewsByDate = new Map<string, number>()

  dailyVisitsSnapshot.docs.forEach((visitDoc) => {
    const data = visitDoc.data() as { date?: string; views?: number }
    if (!data.date) {
      return
    }

    dailyViewsByDate.set(data.date, typeof data.views === "number" ? data.views : 0)
  })

  const dailyVisitSeries = lastSevenDays.map((day) => dailyViewsByDate.get(day.key) ?? 0)

  return {
    landlords: landlordsSnapshot.size,
    totalApplications,
    reviews: reviewsSnapshot.size,
    weeklyVisits: dailyVisitSeries.reduce((sum, views) => sum + views, 0),
    dailyVisitSeries,
    dailyVisitLabels: lastSevenDays.map((day) => day.label),
  }
}

export const updateApplicationStatus = async (
  applicationId: string,
  status: ApplicationStatus,
): Promise<ApplicationDecisionResult | null> => {
  const applicationRef = firestore.collection("applications").doc(applicationId)
  const applicationSnapshot = await applicationRef.get()

  if (!applicationSnapshot.exists) {
    return null
  }

  const applicationData = applicationSnapshot.data() as { userId?: string }
  const nextRole: UserRole = status === "approved" ? "landlord" : "tenant"
  let updatedUserRole: UserRole | null = null

  if (typeof applicationData.userId === "string" && applicationData.userId.length > 0) {
    const userRef = usersCollection.doc(applicationData.userId)
    const userSnapshot = await userRef.get()
    if (userSnapshot.exists) {
      await userRef.update({
        role: nextRole,
        updatedAt: Timestamp.now(),
      })
      updatedUserRole = nextRole
    }
  }

  await applicationRef.update({
    status,
    reviewedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  })

  const updatedSnapshot = await applicationRef.get()
  return {
    application: { id: updatedSnapshot.id, ...(updatedSnapshot.data() as Record<string, unknown>) },
    updatedUserRole,
  }
}
