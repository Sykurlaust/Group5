import { doc, increment, serverTimestamp, setDoc } from "firebase/firestore"
import { db } from "./firebase"

const VIEW_DEDUPLICATION_WINDOW_MS = 1500

const normalizePathname = (pathname: string): string => {
  if (!pathname || pathname === "/") {
    return "/"
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname
}

const toRouteDocumentId = (pathname: string): string => {
  if (pathname === "/") {
    return "home"
  }

  return pathname
    .replace(/^\//, "")
    .replace(/\//g, "__")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
}

const shouldSkipDuplicateView = (pathname: string): boolean => {
  if (typeof window === "undefined") {
    return false
  }

  const storageKey = `gc-renting:lastTrackedView:${pathname}`
  const now = Date.now()
  const previous = Number(window.sessionStorage.getItem(storageKey) ?? "0")

  if (previous && now - previous < VIEW_DEDUPLICATION_WINDOW_MS) {
    return true
  }

  window.sessionStorage.setItem(storageKey, String(now))
  return false
}

export const trackPageView = async (pathname: string): Promise<void> => {
  const normalizedPathname = normalizePathname(pathname)

  if (shouldSkipDuplicateView(normalizedPathname)) {
    return
  }

  const dayKey = new Date().toISOString().slice(0, 10)
  const routeKey = toRouteDocumentId(normalizedPathname)

  await Promise.all([
    setDoc(
      doc(db, "analytics_page_views_daily", dayKey),
      {
        date: dayKey,
        views: increment(1),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
    setDoc(
      doc(db, "analytics_route_views", routeKey),
      {
        route: normalizedPathname,
        views: increment(1),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ),
  ])
}
