import type { UserRole } from "../context/AuthContext"
import { callAuthenticatedEndpoint } from "./apiClient"

interface FirestoreTimestampLike {
  seconds: number
  nanoseconds: number
}

export interface AdminUserRecord {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  phone: string | null
  role: UserRole
  verified: boolean
  createdAt?: FirestoreTimestampLike | string
  updatedAt?: FirestoreTimestampLike | string
}

export interface AdminUserListResponse {
  users: AdminUserRecord[]
  nextCursor: string | null
}

export interface CreateAdminUserPayload {
  displayName: string
  email: string
  password: string
  role: UserRole
  phone?: string
}

const readJson = async (response: Response) => {
  const text = await response.text()
  if (!text) {
    return {}
  }
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

const ensureOk = async <T>(response: Response): Promise<T> => {
  const payload = await readJson(response)
  if (!response.ok) {
    const message = typeof (payload as { error?: string })?.error === "string" ? payload.error : "Unexpected server error"
    throw new Error(message)
  }
  return payload as T
}

export const listAdminUsers = async (
  token: string,
  params: { cursor?: string; limit?: number } = {},
): Promise<AdminUserListResponse> => {
  const query = new URLSearchParams()
  if (params.limit) {
    query.set("limit", String(params.limit))
  }
  if (params.cursor) {
    query.set("cursor", params.cursor)
  }

  const qs = query.toString()
  const response = await callAuthenticatedEndpoint(token, `/admin/users${qs ? `?${qs}` : ""}`)
  return ensureOk<AdminUserListResponse>(response)
}

export const createAdminUser = async (
  token: string,
  payload: CreateAdminUserPayload,
): Promise<AdminUserRecord> => {
  const response = await callAuthenticatedEndpoint(token, "/admin/users", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const data = await ensureOk<{ user: AdminUserRecord }>(response)
  return data.user
}

export const updateAdminUserRole = async (
  token: string,
  uid: string,
  role: UserRole,
): Promise<AdminUserRecord> => {
  const response = await callAuthenticatedEndpoint(token, `/admin/users/${uid}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  })
  const data = await ensureOk<{ user: AdminUserRecord }>(response)
  return data.user
}

export const updateAdminUserVerification = async (
  token: string,
  uid: string,
  verified: boolean,
): Promise<AdminUserRecord> => {
  const response = await callAuthenticatedEndpoint(token, `/admin/users/${uid}/verify`, {
    method: "PATCH",
    body: JSON.stringify({ verified }),
  })
  const data = await ensureOk<{ user: AdminUserRecord }>(response)
  return data.user
}

export const deleteAdminUser = async (token: string, uid: string): Promise<void> => {
  const response = await callAuthenticatedEndpoint(token, `/admin/users/${uid}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    const payload = await readJson(response)
    const message = typeof (payload as { error?: string })?.error === "string" ? payload.error : "Failed to delete user"
    throw new Error(message)
  }
}

