import { useCallback, useEffect, useState } from "react"
import type { FormEvent } from "react"
import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Helmet } from "react-helmet-async"
import AdminHighlights from "../components/AdminHighlights"
import AdminStatCard from "../components/AdminStatCard"
import AdminTrafficChart from "../components/AdminTrafficChart"
import DateRangeInput from "../components/DateRangeInput"
import { useAuth } from "../../context/AuthContext"
import type { UserRole } from "../../context/AuthContext"
import {
  type AdminUserRecord,
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminUserRole,
  updateAdminUserVerification,
} from "../../lib/adminUsers"

const statCards = [
  { helper: "Active landlord accounts", label: "Landlords", value: "42" },
  { helper: "Verified rental applications", label: "Applications", value: "118" },
  { helper: "Listings pending moderation", label: "Reviews", value: "9" },
  { helper: "Avg. response time this week", label: "Support", value: "1h 12m" },
]

const recentActivity = [
  { label: "New landlord onboarding", meta: "Sonia Torres • 2m ago" },
  { label: "Application approved", meta: "Listing #872 • 18m ago" },
  { label: "High traffic alert", meta: "Calle Serrano 102 • 40m ago" },
  { label: "Listing price updated", meta: "Paseo del Prado 12 • 1h ago" },
]

const reviewQueue = [
  { title: "Gran Via Penthouse", owner: "Marcos Luna", priority: "High" },
  { title: "Loft Chamberí", owner: "Patricia Gil", priority: "Medium" },
  { title: "Sevilla Centro Duplex", owner: "Alana Ruiz", priority: "Low" },
]

type ManagedRole = "admin" | "landlord" | "tenant"

type ContactMessage = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subject: string
  message: string
  read: boolean
  createdAt: unknown
}

const subjectLabel = (subject: string): string => {
  const labels: Record<string, string> = {
    general: "General Inquiry",
    rental: "Rental Inquiry",
    support: "Support",
    other: "Other",
  }
  return labels[subject] ?? subject
}

const subjectBadgeClass = (subject: string): string => {
  const classes: Record<string, string> = {
    general: "bg-blue-50 text-blue-700",
    rental: "bg-purple-50 text-purple-700",
    support: "bg-amber-50 text-amber-700",
    other: "bg-gray-100 text-gray-600",
  }
  return classes[subject] ?? "bg-gray-100 text-gray-600"
}

const formatContactDate = (createdAt: unknown): string => {
  if (!createdAt || typeof createdAt !== "object") return ""
  const ts = createdAt as { seconds?: number }
  if (!ts.seconds) return ""
  return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const roleSelectOptions: Array<{ label: string; value: UserRole }> = [
  { label: "Admin", value: "admin" },
  { label: "Landlord", value: "landlord" },
  { label: "Tenant", value: "tenant" },
  { label: "Guest", value: "guest" },
]

const assignableRoles: ManagedRole[] = ["admin", "landlord", "tenant"]

const defaultFormState: { name: string; email: string; password: string; phone: string; role: ManagedRole } = {
  name: "",
  email: "",
  password: "",
  phone: "",
  role: "tenant",
}

const AdminDashboard = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [busyUsers, setBusyUsers] = useState<Record<string, boolean>>({})
  const [formState, setFormState] = useState(defaultFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [formSubmitting, setFormSubmitting] = useState(false)

  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [contactsLoading, setContactsLoading] = useState(true)

  const loadContacts = useCallback(async () => {
    setContactsLoading(true)
    try {
      const q = query(collection(db, "contacts"), orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage)))
    } catch {
      // silently fail
    } finally {
      setContactsLoading(false)
    }
  }, [])

  useEffect(() => { void loadContacts() }, [loadContacts])

  const handleToggleContactRead = async (id: string, currentRead: boolean) => {
    await updateDoc(doc(db, "contacts", id), { read: !currentRead })
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, read: !currentRead } : c))
  }

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Delete this message permanently?")) return
    await deleteDoc(doc(db, "contacts", id))
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const setUserBusy = useCallback((uid: string, busy: boolean) => {
    setBusyUsers((prev) => {
      const next = { ...prev }
      if (busy) {
        next[uid] = true
      } else {
        delete next[uid]
      }
      return next
    })
  }, [])

  const loadUsers = useCallback(
    async ({ cursor, append }: { cursor?: string; append?: boolean } = {}) => {
      if (!token) {
        setUsers([])
        setUsersLoading(false)
        return
      }

      if (append) {
        setIsLoadingMore(true)
      } else {
        setUsersLoading(true)
      }
      setUsersError(null)

      try {
        const data = await listAdminUsers(token, { cursor })
        setUsers((prev) => (append ? [...prev, ...data.users] : data.users))
        setNextCursor(data.nextCursor)
      } catch (error) {
        setUsersError(error instanceof Error ? error.message : "No se pudo cargar la lista de usuarios")
      } finally {
        if (append) {
          setIsLoadingMore(false)
        } else {
          setUsersLoading(false)
        }
      }
    },
    [token],
  )

  useEffect(() => {
    if (!token) {
      setUsers([])
      setNextCursor(null)
      setUsersLoading(false)
      return
    }
    loadUsers()
  }, [token, loadUsers])

  const handleFormChange = (field: keyof typeof formState, value: string) => {
    setFormError(null)
    setFormState((prev) => ({
      ...prev,
      [field]: field === "role" ? (value as ManagedRole) : value,
    }))
  }

  const handleAddUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) {
      setFormError("No se encontró un token activo. Vuelve a iniciar sesión.")
      return
    }

    const name = formState.name.trim()
    const email = formState.email.trim().toLowerCase()
    const password = formState.password.trim()

    if (!name || !email) {
      setFormError("Nombre y correo son obligatorios")
      return
    }

    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setFormSubmitting(true)
    try {
      await createAdminUser(token, {
        displayName: name,
        email,
        password,
        role: formState.role,
        phone: formState.phone.trim() || undefined,
      })
      setFormState(defaultFormState)
      await loadUsers()
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "No se pudo crear el usuario")
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleRoleChange = async (uid: string, nextRole: UserRole) => {
    if (!token) return
    setUserBusy(uid, true)
    try {
      const updated = await updateAdminUserRole(token, uid, nextRole)
      setUsers((prev) => prev.map((user) => (user.uid === uid ? updated : user)))
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "No se pudo actualizar el rol")
    } finally {
      setUserBusy(uid, false)
    }
  }

  const handleVerificationToggle = async (uid: string, nextVerified: boolean) => {
    if (!token) return
    setUserBusy(uid, true)
    try {
      const updated = await updateAdminUserVerification(token, uid, nextVerified)
      setUsers((prev) => prev.map((user) => (user.uid === uid ? updated : user)))
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "No se pudo actualizar la verificación")
    } finally {
      setUserBusy(uid, false)
    }
  }

  const handleDeleteUser = async (uid: string) => {
    if (!token) return
    const confirmation = window.confirm("¿Eliminar este usuario de forma permanente?")
    if (!confirmation) return

    setUserBusy(uid, true)
    try {
      await deleteAdminUser(token, uid)
      setUsers((prev) => prev.filter((user) => user.uid !== uid))
    } catch (error) {
      setUsersError(error instanceof Error ? error.message : "No se pudo eliminar el usuario")
    } finally {
      setUserBusy(uid, false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | GC-Renting</title>
      </Helmet>

      <div className="w-full space-y-6 pb-10">
        <section className="rounded-[32px] border border-black/5 bg-gradient-to-br from-[#047857] via-[#0a6f58] to-[#0b4d3b] p-6 text-white shadow-[0_25px_60px_rgba(4,120,87,0.35)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/70">Admin</p>
              <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Operational Overview</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80">
                Monitor growth, moderation queues, and support load across GC-Renting. Use the quick actions to
                move landlords through onboarding faster.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0b4d3b] transition hover:bg-white/90" type="button">
                  Create Listing
                </button>
                <button className="rounded-full border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10" type="button">
                  Invite Landlord
                </button>
              </div>
            </div>

            <div className="w-full max-w-sm rounded-[26px] border border-white/20 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Performance Window</p>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">Live</span>
              </div>
              <div className="mt-4">
                <DateRangeInput />
              </div>
              <p className="mt-3 text-xs text-white/70">Stats refresh automatically every hour.</p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <AdminStatCard helper={stat.helper} key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <AdminTrafficChart title="Platform Visits" />
          <AdminHighlights />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#1f1f1f]">Recent Control Room Activity</h2>
                <p className="text-sm text-gray-500">Automated alerts and manual changes across the platform.</p>
              </div>
              <button className="text-sm font-semibold text-[#047857] hover:underline" type="button">
                View log
              </button>
            </div>

            <ul className="mt-5 space-y-4">
              {recentActivity.map((item) => (
                <li className="flex items-start gap-3" key={item.label}>
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#047857]" />
                  <div>
                    <p className="text-sm font-semibold text-[#1f1f1f]">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <div>
              <h2 className="text-lg font-semibold text-[#1f1f1f]">Review Queue</h2>
              <p className="text-sm text-gray-500">Listings that need moderation before going live.</p>
            </div>

            <div className="mt-5 space-y-4">
              {reviewQueue.map((entry) => (
                <article
                  className="rounded-2xl border border-black/5 bg-[#f8faf9] px-4 py-3 text-sm"
                  key={entry.title}
                >
                  <div className="flex items-center justify-between text-[#1f1f1f]">
                    <p className="font-semibold">{entry.title}</p>
                    <span
                      className="rounded-full border border-[#047857]/30 px-3 py-1 text-xs font-semibold text-[#047857]"
                    >
                      {entry.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Owner • {entry.owner}</p>
                </article>
              ))}
            </div>

            <button className="mt-6 w-full rounded-full bg-[#047857] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#036c50]" type="button">
              Open moderation workspace
            </button>
          </section>
        </div>

        <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1f1f1f]">Contact Messages</h2>
              <p className="text-sm text-gray-500">Messages received from the contact form.</p>
            </div>
            <div className="flex items-center gap-3">
              {contacts.filter((c) => !c.read).length > 0 && (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                  {contacts.filter((c) => !c.read).length} unread
                </span>
              )}
              <button
                type="button"
                className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[#047857] hover:border-[#047857] disabled:opacity-50"
                onClick={() => loadContacts()}
                disabled={contactsLoading}
              >
                Refresh
              </button>
            </div>
          </div>

          {contactsLoading ? (
            <p className="mt-4 text-sm text-gray-500">Loading messages...</p>
          ) : contacts.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-black/10 py-10 text-center">
              <p className="text-sm text-gray-500">No contact messages yet.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {contacts.map((msg) => (
                <article
                  key={msg.id}
                  className={`rounded-2xl border p-4 transition ${
                    msg.read ? "border-black/5 bg-[#f9fafb]" : "border-[#047857]/20 bg-[#ecfdf5]"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-[#1f1f1f]">
                          {msg.firstName} {msg.lastName}
                        </p>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${subjectBadgeClass(msg.subject)}`}>
                          {subjectLabel(msg.subject)}
                        </span>
                        {!msg.read && (
                          <span className="rounded-full bg-[#047857] px-2 py-0.5 text-xs font-semibold text-white">New</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{msg.email} · {msg.phone}</p>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-700">{msg.message}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p className="text-xs text-gray-400">{formatContactDate(msg.createdAt)}</p>
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${subjectLabel(msg.subject)} – GC-Renting&body=Hi ${msg.firstName},%0A%0A`}
                          className="rounded-full bg-[#047857] px-3 py-1 text-xs font-semibold text-white hover:bg-[#036c50]"
                        >
                          Reply
                        </a>
                        <button
                          type="button"
                          onClick={() => handleToggleContactRead(msg.id, msg.read)}
                          className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-gray-600 hover:border-[#047857] hover:text-[#047857]"
                        >
                          {msg.read ? "Mark unread" : "Mark read"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteContact(msg.id)}
                          className="rounded-full border border-red-100 px-3 py-1 text-xs font-semibold text-red-500 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1f1f1f]">User & Role Management</h2>
              <p className="text-sm text-gray-500">Add administrators, landlords, or tenants and adjust their permissions.</p>
            </div>
            <span className="rounded-full bg-[#ecfdf5] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#047857]">
              {users.length} usuarios activos
            </span>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
            <form className="space-y-4 rounded-2xl border border-black/5 bg-[#f9fafb] p-4" onSubmit={handleAddUser}>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="user-name">
                  Nombre completo
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#047857] focus:outline-none"
                  id="user-name"
                  placeholder="Ej. Andrea Martín"
                  value={formState.name}
                  onChange={(event) => handleFormChange("name", event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="user-email">
                  Correo
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#047857] focus:outline-none"
                  id="user-email"
                  placeholder="correo@empresa.com"
                  type="email"
                  value={formState.email}
                  onChange={(event) => handleFormChange("email", event.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="user-password">
                  Contraseña temporal
                </label>
                <input
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#047857] focus:outline-none"
                  id="user-password"
                  placeholder="Mínimo 6 caracteres"
                  type="password"
                  value={formState.password}
                  onChange={(event) => handleFormChange("password", event.target.value)}
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="user-role">
                    Rol
                  </label>
                  <select
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#047857] focus:outline-none"
                    id="user-role"
                    value={formState.role}
                    onChange={(event) => handleFormChange("role", event.target.value)}
                  >
                    {assignableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="user-phone">
                    Teléfono (opcional)
                  </label>
                  <input
                    className="mt-1 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-[#1f1f1f] focus:border-[#047857] focus:outline-none"
                    id="user-phone"
                    placeholder="+34 600 123 456"
                    value={formState.phone}
                    onChange={(event) => handleFormChange("phone", event.target.value)}
                  />
                </div>
              </div>
              {formError && <p className="text-xs font-semibold text-red-500">{formError}</p>}
              <button
                className="w-full rounded-full bg-[#047857] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#036c50] disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={formSubmitting}
              >
                {formSubmitting ? "Creando usuario..." : "Añadir usuario"}
              </button>
              <p className="text-xs text-gray-500">Los usuarios se crean directamente en Firebase Auth y Firestore.</p>
            </form>

            <div className="rounded-2xl border border-black/5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 px-4 py-3">
                <p className="text-sm font-semibold text-[#1f1f1f]">Equipo GC</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{users.length} usuarios</span>
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-3 py-1 font-semibold text-[#047857] hover:border-[#047857]"
                    onClick={() => loadUsers()}
                    disabled={usersLoading}
                  >
                    Actualizar
                  </button>
                </div>
              </div>

              {usersError && (
                <div className="mx-4 mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  {usersError}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#f9fafb] text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Usuario</th>
                      <th className="px-4 py-3 font-semibold">Rol</th>
                      <th className="px-4 py-3 font-semibold">Estado</th>
                      <th className="px-4 py-3 font-semibold text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersLoading ? (
                      <tr>
                        <td className="px-4 py-4 text-sm text-gray-500" colSpan={4}>
                          Cargando usuarios reales...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td className="px-4 py-4 text-sm text-gray-500" colSpan={4}>
                          No hay usuarios registrados aún.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr className="border-b border-black/5 last:border-b-0" key={user.uid}>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-[#1f1f1f]">{user.displayName || user.email}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              className="w-full rounded-xl border border-black/10 bg-white px-2 py-1 text-xs font-semibold text-[#047857] focus:border-[#047857] focus:outline-none"
                              value={user.role}
                              disabled={Boolean(busyUsers[user.uid])}
                              onChange={(event) => handleRoleChange(user.uid, event.target.value as UserRole)}
                            >
                              {roleSelectOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                user.verified ? "bg-[#ecfdf5] text-[#047857]" : "bg-[#fef3c7] text-[#b45309]"
                              }`}
                            >
                              {user.verified ? "Verificado" : "Pendiente"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                className="text-xs font-semibold text-[#047857] hover:text-[#035f45] disabled:cursor-not-allowed disabled:opacity-60"
                                type="button"
                                disabled={Boolean(busyUsers[user.uid])}
                                onClick={() => handleVerificationToggle(user.uid, !user.verified)}
                              >
                                {user.verified ? "Marcar pendiente" : "Marcar verificado"}
                              </button>
                              <button
                                className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                                type="button"
                                disabled={Boolean(busyUsers[user.uid])}
                                onClick={() => handleDeleteUser(user.uid)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {nextCursor && (
                <div className="border-t border-black/5 px-4 py-3 text-right">
                  <button
                    type="button"
                    className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[#047857] hover:border-[#047857] disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => loadUsers({ cursor: nextCursor, append: true })}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? "Cargando..." : "Cargar más"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AdminDashboard
