import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticate.js"
import { findUserByUid, createUser, updateUser } from "../services/auth.service.js"

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" })
      return
    }

    const existing = await findUserByUid(req.user.uid)
    if (existing) {
      res.status(409).json({ error: "User already registered" })
      return
    }

    const { displayName } = req.body
    if (!displayName || typeof displayName !== "string") {
      res.status(400).json({ error: "displayName is required" })
      return
    }

    const user = await createUser({
      uid: req.user.uid,
      email: req.user.email,
      displayName: displayName.trim(),
    })

    res.status(201).json({ user })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ error: "Failed to register user" })
  }
}

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" })
      return
    }

    const user = await findUserByUid(req.user.uid)
    if (!user) {
      res.status(404).json({ error: "User profile not found" })
      return
    }

    res.json({ user })
  } catch (error) {
    console.error("GetMe error:", error)
    res.status(500).json({ error: "Failed to fetch user profile" })
  }
}

export const updateMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" })
      return
    }

    const { displayName, phone, photoURL } = req.body

    const updates: Record<string, string | null> = {}
    if (typeof displayName === "string") updates.displayName = displayName.trim()
    if (typeof phone === "string") updates.phone = phone.trim()
    if (typeof photoURL === "string" || photoURL === null) updates.photoURL = photoURL

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No valid fields to update" })
      return
    }

    const user = await updateUser(req.user.uid, updates)
    if (!user) {
      res.status(404).json({ error: "User profile not found" })
      return
    }

    res.json({ user })
  } catch (error) {
    console.error("UpdateMe error:", error)
    res.status(500).json({ error: "Failed to update user profile" })
  }
}
