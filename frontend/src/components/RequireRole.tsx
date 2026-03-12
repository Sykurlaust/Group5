import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { resolveUserRole, useAuth, type UserRole } from "../context/AuthContext"

type RequireRoleProps = {
  allowedRoles: UserRole[]
  children: ReactNode
  redirectTo?: string
}

const RequireRole = ({ allowedRoles, children, redirectTo = "/account" }: RequireRoleProps) => {
  const { loading, profile, firebaseUser } = useAuth()

  if (loading && !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Loading your permissions...
      </div>
    )
  }

  const currentRole: UserRole = resolveUserRole(
    profile?.email ?? firebaseUser?.email ?? "",
    profile?.role,
  )

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate replace to={redirectTo} />
  }

  return <>{children}</>
}

export default RequireRole
