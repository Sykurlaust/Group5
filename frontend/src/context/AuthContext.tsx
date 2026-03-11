import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import type { User } from "firebase/auth"
import { onIdTokenChanged, signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

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

const ensureProfile = async (user: User): Promise<UserProfile> => {
  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    return mapUserProfile({ uid: user.uid, ...snap.data() })
  }
  const newData = {
    email: user.email ?? "",
    displayName: buildDisplayName(user),
    photoURL: user.photoURL ?? null,
    phone: null,
    role: "tenant",
    verified: user.emailVerified,
  }
  await setDoc(ref, newData)
  return mapUserProfile({ uid: user.uid, ...newData })
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
    async (user: User) => {
      const resolvedProfile = await ensureProfile(user)
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
        await syncProfile(user)
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
      await syncProfile(firebaseUser)
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
