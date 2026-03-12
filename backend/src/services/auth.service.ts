import { Timestamp } from "firebase-admin/firestore"
import { firestore } from "../config/firebase.js"
import type { User, CreateUserData } from "../models/user.model.js"

const usersCollection = firestore.collection("users")
const FORCED_ADMIN_EMAIL = "admin@gcrenting.com"

const normalizeEmail = (email: string) => email.trim().toLowerCase()

const resolveRoleForEmail = (email: string, requestedRole?: User["role"]): User["role"] => {
  if (normalizeEmail(email) === FORCED_ADMIN_EMAIL) {
    return "admin"
  }

  return requestedRole ?? "tenant"
}

export const findUserByUid = async (uid: string): Promise<User | null> => {
  const doc = await usersCollection.doc(uid).get()
  if (!doc.exists) return null
  return doc.data() as User
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const now = Timestamp.now()

  const user: User = {
    uid: data.uid,
    email: normalizeEmail(data.email),
    displayName: data.displayName,
    photoURL: data.photoURL ?? null,
    phone: data.phone ?? null,
    role: resolveRoleForEmail(data.email, data.role),
    verified: false,
    createdAt: now,
    updatedAt: now,
  }

  await usersCollection.doc(data.uid).set(user)
  return user
}

export const ensureForcedAdminRole = async (uid: string, email: string): Promise<User | null> => {
  const docRef = usersCollection.doc(uid)
  const snapshot = await docRef.get()

  if (!snapshot.exists) {
    return null
  }

  const current = snapshot.data() as User
  const normalizedEmail = normalizeEmail(email)
  const mustBeAdmin = normalizedEmail === FORCED_ADMIN_EMAIL

  if (!mustBeAdmin) {
    return current
  }

  if (current.role === "admin" && normalizeEmail(current.email) === normalizedEmail) {
    return current
  }

  const updates: Partial<User> = {
    role: "admin",
    email: normalizedEmail,
    updatedAt: Timestamp.now(),
  }

  await docRef.update(updates)
  const updated = await docRef.get()
  return updated.data() as User
}

export const updateUser = async (
  uid: string,
  data: Partial<Pick<User, "displayName" | "phone" | "photoURL">>,
): Promise<User | null> => {
  const docRef = usersCollection.doc(uid)
  const doc = await docRef.get()

  if (!doc.exists) return null

  const updates = {
    ...data,
    updatedAt: Timestamp.now(),
  }

  await docRef.update(updates)

  const updated = await docRef.get()
  return updated.data() as User
}
