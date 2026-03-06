import { createContext, useContext, useMemo, useState } from "react"
import type { PropsWithChildren } from "react"

type AdminSidebarContextValue = {
  isSidebarOpen: boolean
  closeSidebar: () => void
  toggleSidebar: () => void
}

const AdminSidebarContext = createContext<AdminSidebarContextValue | null>(null)

export const AdminSidebarProvider = ({ children }: PropsWithChildren) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const value = useMemo(
    () => ({
      isSidebarOpen,
      closeSidebar: () => setIsSidebarOpen(false),
      toggleSidebar: () => setIsSidebarOpen((current) => !current),
    }),
    [isSidebarOpen],
  )

  return <AdminSidebarContext.Provider value={value}>{children}</AdminSidebarContext.Provider>
}

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext)
  if (!context) {
    throw new Error("useAdminSidebar must be used within AdminSidebarProvider")
  }
  return context
}
