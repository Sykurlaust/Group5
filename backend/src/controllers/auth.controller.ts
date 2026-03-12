import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticate.js"
import { ensureForcedAdminRole, findUserByUid, createUser, updateUser } from "../services/auth.service.js"

export const register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" })
      return
    }

    const existing = await findUserByUid(req.user.uid)
    if (existing) {
      await ensureForcedAdminRole(req.user.uid, req.user.email)
      res.status(409).json({ error: "User already registered" })
      return
    }

    const { displayName } = req.body

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

    const user = await ensureForcedAdminRole(req.user.uid, req.user.email)
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

    const user = await updateUser(req.user.uid, { displayName, phone, photoURL })
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

