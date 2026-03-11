import { firestore, firebaseAuth } from "../config/firebase.js"
import type { User, UserRole } from "../models/user.model.js"
import { Timestamp } from "firebase-admin/firestore"

const usersCollection = firestore.collection("users")

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
  const users = snapshot.docs.map((doc) => doc.data() as User)
  const nextCursor = snapshot.docs.length === limit ? snapshot.docs[snapshot.docs.length - 1].id : null

  return { users, nextCursor }
}

export const getUserByUid = async (uid: string): Promise<User | null> => {
  const doc = await usersCollection.doc(uid).get()
  if (!doc.exists) return null
  return doc.data() as User
}

export const updateUserRole = async (uid: string, role: UserRole): Promise<User | null> => {
  const docRef = usersCollection.doc(uid)
  const doc = await docRef.get()
  if (!doc.exists) return null

  await docRef.update({ role, updatedAt: Timestamp.now() })
  const updated = await docRef.get()
  return updated.data() as User
}

export const updateUserVerified = async (uid: string, verified: boolean): Promise<User | null> => {
  const docRef = usersCollection.doc(uid)
  const doc = await docRef.get()
  if (!doc.exists) return null

  await docRef.update({ verified, updatedAt: Timestamp.now() })
  const updated = await docRef.get()
  return updated.data() as User
}

export const deleteUser = async (uid: string): Promise<boolean> => {
  const doc = await usersCollection.doc(uid).get()
  if (!doc.exists) return false

  await usersCollection.doc(uid).delete()
  await firebaseAuth.deleteUser(uid)
  return true
}
