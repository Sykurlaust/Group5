import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { useAuth } from "../context/AuthContext"

interface RequireAuthProps {
  children: ReactNode
  redirectTo?: string
}

const RequireAuth = ({ children, redirectTo = "/login" }: RequireAuthProps) => {
  const { firebaseUser, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
        Checking your session...
      </div>
    )
  }

  if (!firebaseUser) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default RequireAuth
