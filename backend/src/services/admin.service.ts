import { firestore, firebaseAuth } from "../config/firebase.js"
import type { User, UserRole } from "../models/user.model.js"
import { Timestamp } from "firebase-admin/firestore"

const usersCollection = firestore.collection("users")

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
