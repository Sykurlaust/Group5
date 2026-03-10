import { Timestamp } from "firebase-admin/firestore"
import { firestore } from "../config/firebase.js"
import type { User, CreateUserData } from "../models/user.model.js"

const usersCollection = firestore.collection("users")

export const findUserByUid = async (uid: string): Promise<User | null> => {
  const doc = await usersCollection.doc(uid).get()
  if (!doc.exists) return null
  return doc.data() as User
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  const now = Timestamp.now()

  const user: User = {
    uid: data.uid,
    email: data.email,
    displayName: data.displayName,
    photoURL: data.photoURL ?? null,
    phone: data.phone ?? null,
    role: data.role ?? "guest",
    verified: false,
    createdAt: now,
    updatedAt: now,
  }

  await usersCollection.doc(data.uid).set(user)
  return user
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
