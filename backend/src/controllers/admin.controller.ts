import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticate.js"
import { listUsers, getUserByUid, updateUserRole, updateUserVerified, deleteUser } from "../services/admin.service.js"
import type { UserRole } from "../models/user.model.js"

const VALID_ROLES: UserRole[] = ["guest", "tenant", "landlord", "admin"]

export const getUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100)
    const startAfter = typeof req.query.cursor === "string" ? req.query.cursor : undefined

    const result = await listUsers(limit, startAfter)
    res.json(result)
  } catch (error) {
    console.error("getUsers error:", error)
    res.status(500).json({ error: "Failed to list users" })
  }
}

export const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = String(req.params.uid)
    const user = await getUserByUid(uid)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }
    res.json({ user })
  } catch (error) {
    console.error("getUser error:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
}

export const patchUserRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = String(req.params.uid)
    const { role } = req.body

    if (!role || !VALID_ROLES.includes(role as UserRole)) {
      res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(", ")}` })
      return
    }

    const user = await updateUserRole(uid, role as UserRole)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json({ user })
  } catch (error) {
    console.error("patchUserRole error:", error)
    res.status(500).json({ error: "Failed to update role" })
  }
}

export const patchUserVerify = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = String(req.params.uid)
    const { verified } = req.body

    if (typeof verified !== "boolean") {
      res.status(400).json({ error: "verified must be a boolean" })
      return
    }

    const user = await updateUserVerified(uid, verified)
    if (!user) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.json({ user })
  } catch (error) {
    console.error("patchUserVerify error:", error)
    res.status(500).json({ error: "Failed to update verification" })
  }
}

export const removeUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const uid = String(req.params.uid)

    if (req.user?.uid === uid) {
      res.status(400).json({ error: "Cannot delete your own account" })
      return
    }

    const deleted = await deleteUser(uid)
    if (!deleted) {
      res.status(404).json({ error: "User not found" })
      return
    }

    res.status(204).send()
  } catch (error) {
    console.error("removeUser error:", error)
    res.status(500).json({ error: "Failed to delete user" })
  }
}
