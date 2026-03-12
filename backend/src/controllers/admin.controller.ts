import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticate.js"
import {
  listUsers,
  getUserByUid,
  updateUserRole,
  updateUserVerified,
  deleteUser,
  createUserWithRole,
  getDashboardStats,
  updateApplicationStatus,
} from "../services/admin.service.js"
import type { UserRole } from "../models/user.model.js"

const VALID_ROLES: UserRole[] = ["guest", "tenant", "landlord", "admin"]
const VALID_APPLICATION_STATUSES = ["pending", "approved", "declined"] as const

const normalizeRole = (role: unknown): UserRole | null => {
  if (typeof role !== "string") {
    return null
  }
  const normalized = role.toLowerCase().trim()
  return VALID_ROLES.includes(normalized as UserRole) ? (normalized as UserRole) : null
}

export const createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const displayName = typeof req.body?.displayName === "string" ? req.body.displayName.trim() : ""
    const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : ""
    const password = typeof req.body?.password === "string" ? req.body.password : ""
    const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : undefined
    const role = normalizeRole(req.body?.role) ?? "tenant"

    if (!displayName) {
      res.status(400).json({ error: "displayName is required" })
      return
    }

    if (!email || !email.includes("@")) {
      res.status(400).json({ error: "A valid email is required" })
      return
    }

    if (password.trim().length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters" })
      return
    }

    const user = await createUserWithRole({
      displayName,
      email,
      password: password.trim(),
      phone: phone && phone.length > 0 ? phone : undefined,
      role,
    })

    res.status(201).json({ user })
  } catch (error) {
    console.error("createUser error:", error)
    const firebaseCode = typeof (error as { code?: string })?.code === "string" ? (error as { code?: string }).code : null
    if (firebaseCode === "auth/email-already-exists") {
      res.status(409).json({ error: "Email already exists" })
      return
    }
    res.status(500).json({ error: "Failed to create user" })
  }
}

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

export const getStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const stats = await getDashboardStats()
    res.json(stats)
  } catch (error) {
    console.error("getStats error:", error)
    res.status(500).json({ error: "Failed to load dashboard statistics" })
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
    const normalizedRole = normalizeRole(req.body?.role)

    if (!normalizedRole) {
      res.status(400).json({ error: `role must be one of: ${VALID_ROLES.join(", ")}` })
      return
    }

    const user = await updateUserRole(uid, normalizedRole)
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

export const patchApplicationStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const applicationId = String(req.params.applicationId)
    const status = typeof req.body?.status === "string" ? req.body.status.trim().toLowerCase() : ""

    if (!VALID_APPLICATION_STATUSES.includes(status as (typeof VALID_APPLICATION_STATUSES)[number])) {
      res.status(400).json({ error: "status must be one of: pending, approved, declined" })
      return
    }

    const updated = await updateApplicationStatus(
      applicationId,
      status as "pending" | "approved" | "declined",
    )

    if (!updated) {
      res.status(404).json({ error: "Application not found" })
      return
    }

    res.json(updated)
  } catch (error) {
    console.error("patchApplicationStatus error:", error)
    res.status(500).json({ error: "Failed to update application status" })
  }
}

