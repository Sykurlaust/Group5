import type { Request, Response, NextFunction } from "express"
import { firebaseAuth, firestore } from "../config/firebase.js"

const FORCED_ADMIN_EMAIL = "admin@gcrenting.com"
const normalizeEmail = (email: string) => email.trim().toLowerCase()

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string
    email: string
    role: string
  }
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" })
    return
  }

  const token = authHeader.split("Bearer ")[1]

  try {
    const decoded = await firebaseAuth.verifyIdToken(token)
    const normalizedEmail = normalizeEmail(decoded.email ?? "")
    const mustForceAdmin = normalizedEmail === FORCED_ADMIN_EMAIL

    const userDoc = await firestore.collection("users").doc(decoded.uid).get()
    const userData = userDoc.data()

    const role = mustForceAdmin ? "admin" : (userData?.role ?? "guest")

    if (mustForceAdmin && userData?.role !== "admin") {
      await firestore.collection("users").doc(decoded.uid).set(
        {
          role: "admin",
          email: normalizedEmail,
        },
        { merge: true },
      )
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? "",
      role,
    }

    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}
