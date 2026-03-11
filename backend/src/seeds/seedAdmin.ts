/**
 * Seed: Admin user
 *
 * Creates or promotes a user to the "admin" role in Firestore.
 * Run with:  npm run seed:admin -- <email> [password]
 *
 * Examples:
 *   npm run seed:admin -- admin@gcrenting.com admin1234
 *   npm run seed:admin -- existing@example.com        (promotes existing user)
 */

import { firestore, firebaseAuth } from "../config/firebase.js"
import { Timestamp } from "firebase-admin/firestore"

const input = process.argv[2]
const password = process.argv[3]

if (!input) {
  console.error("❌  Usage: npm run seed:admin -- <email> [password]")
  process.exit(1)
}

async function run() {
  let uid: string
  let email: string

  try {
    if (input.includes("@")) {
      const userRecord = await firebaseAuth.getUserByEmail(input)
      uid = userRecord.uid
      email = userRecord.email ?? input
      console.log(`✅  Found existing user: ${email} (uid: ${uid})`)
    } else {
      const userRecord = await firebaseAuth.getUser(input)
      uid = userRecord.uid
      email = userRecord.email ?? ""
      console.log(`✅  Found user by uid: ${uid} (email: ${email})`)
    }
  } catch {
    // User does not exist — create them if a password was provided
    if (!password) {
      console.error(`❌  User "${input}" not found. Provide a password as second argument to create it.`)
      console.error(`    npm run seed:admin -- ${input} <password>`)
      process.exit(1)
    }

    if (password.length < 6) {
      console.error("❌  Password must be at least 6 characters.")
      process.exit(1)
    }

    const newUser = await firebaseAuth.createUser({
      email: input,
      password,
      displayName: "Admin",
    })
    uid = newUser.uid
    email = input
    console.log(`✅  Created new Firebase Auth user: ${email} (uid: ${uid})`)
  }

  const docRef = firestore.collection("users").doc(uid)
  const doc = await docRef.get()

  if (!doc.exists) {
    // User logged in via Firebase Auth but never hit the backend register endpoint
    console.warn("⚠️  No Firestore profile found — creating one now...")
    const userRecord = await firebaseAuth.getUser(uid)
    await docRef.set({
      uid,
      email,
      displayName: userRecord.displayName ?? email.split("@")[0],
      photoURL: userRecord.photoURL ?? null,
      phone: userRecord.phoneNumber ?? null,
      role: "admin",
      verified: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    console.log(`🎉  Admin profile created for ${email}`)
  } else {
    await docRef.update({
      role: "admin",
      verified: true,
      updatedAt: Timestamp.now(),
    })
    console.log(`🎉  User ${email} is now an admin!`)
  }

  process.exit(0)
}

run()
