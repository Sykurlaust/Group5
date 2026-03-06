import admin from "firebase-admin"
import { readFileSync } from "node:fs"
import path from "node:path"
import { env } from "./env.js"

const serviceAccountPath = path.resolve(env.firebaseServiceAccountPath)
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

export const firebaseAuth = admin.auth()
export const firestore = admin.firestore()
