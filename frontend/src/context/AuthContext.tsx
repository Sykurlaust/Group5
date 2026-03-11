import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { User } from "firebase/auth"
import { onIdTokenChanged, signOut } from "firebase/auth"
import { auth } from "../services/firebase"

const getApiBaseUrl = (): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  if (!baseUrl) {
    throw new Error("VITE_API_BASE_URL is not defined. Please set it in your .env file.")
  }
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl
}

export type UserRole = "admin" | "landlord" | "tenant" | "guest"

const normalizeUserRole = (role: unknown): UserRole => {
  if (typeof role !== "string") {
    return "guest"
  }

  const normalized = role.toLowerCase()
  if (normalized === "renter") {
    return "tenant"
  }

  return normalized === "admin" || normalized === "landlord" || normalized === "tenant"
    ? normalized
    : "guest"
}

const mapUserProfile = (payload: any): UserProfile => ({
  uid: payload.uid,
  email: payload.email,
  displayName: payload.displayName,
  photoURL: payload.photoURL ?? null,
  phone: payload.phone ?? null,
  role: normalizeUserRole(payload.role),
  verified: Boolean(payload.verified),
})

const buildDisplayName = (user: User): string => {
  if (user.displayName && user.displayName.trim().length > 0) {
    return user.displayName.trim()
  }
  if (user.email) {
    return user.email.split("@")[0]
  }
  return "Guest"
}

const callAuthEndpoint = async (token: string, path: string, init: RequestInit = {}) => {
  const baseUrl = getApiBaseUrl()
  const headers = new Headers((init.headers ?? undefined) as HeadersInit)
  headers.set("Authorization", `Bearer ${token}`)

  const shouldSetJsonHeader = init.body && !(init.body instanceof FormData)
  if (shouldSetJsonHeader && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  return fetch(`${baseUrl}${path}`, { ...init, headers })
}

const fetchProfile = async (token: string): Promise<UserProfile> => {
  const response = await callAuthEndpoint(token, "/auth/me")
  if (!response.ok) {
    throw new Error("Unable to fetch profile")
  }

  const data = await response.json()
  return mapUserProfile(data.user)
}

const ensureProfile = async (user: User, token: string): Promise<UserProfile> => {
  const response = await callAuthEndpoint(token, "/auth/me")

  if (response.status === 404) {
    await callAuthEndpoint(token, "/auth/register", {
      method: "POST",
      body: JSON.stringify({ displayName: buildDisplayName(user) }),
    })
    return fetchProfile(token)
  }

  if (!response.ok) {
    throw new Error("Unable to synchronize user profile")
  }

  const data = await response.json()
  return mapUserProfile(data.user)
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  phone: string | null
  role: UserRole
  verified: boolean
}

interface AuthContextValue {
  firebaseUser: User | null
  profile: UserProfile | null
  token: string | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const syncProfile = useCallback(
    async (user: User, nextToken: string) => {
      const resolvedProfile = await ensureProfile(user, nextToken)
      setProfile(resolvedProfile)
    },
    [],
  )

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      setLoading(true)
      setFirebaseUser(user)
      setError(null)

      if (!user) {
        setProfile(null)
        setToken(null)
        setLoading(false)
        return
      }

      try {
        const freshToken = await user.getIdToken()
        setToken(freshToken)
        await syncProfile(user, freshToken)
      } catch (err) {
        console.error("Failed to sync auth state", err)
        setError(err instanceof Error ? err.message : "Failed to sync authentication state")
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [syncProfile])

  const refreshProfile = useCallback(async () => {
    if (!firebaseUser) return
    setLoading(true)
    try {
      const freshToken = await firebaseUser.getIdToken(true)
      setToken(freshToken)
      await syncProfile(firebaseUser, freshToken)
      setError(null)
    } catch (err) {
      console.error("Failed to refresh profile", err)
      setError(err instanceof Error ? err.message : "Failed to refresh profile")
    } finally {
      setLoading(false)
    }
  }, [firebaseUser, syncProfile])

  const logout = useCallback(async () => {
    await signOut(auth)
    setProfile(null)
    setToken(null)
    setError(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ firebaseUser, profile, token, loading, error, logout, refreshProfile }),
    [firebaseUser, profile, token, loading, error, logout, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
