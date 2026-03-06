import type { Request, Response, NextFunction } from "express"
import { firebaseAuth, firestore } from "../config/firebase.js"

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

    const userDoc = await firestore.collection("users").doc(decoded.uid).get()
    const userData = userDoc.data()

    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? "",
      role: userData?.role ?? "guest",
    }

    next()
  } catch {
    res.status(401).json({ error: "Invalid or expired token" })
  }
}
