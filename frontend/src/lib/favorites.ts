const FAVORITES_STORAGE_PREFIX = "gc-renting:favorites:"
export const FAVORITES_UPDATED_EVENT = "gc-renting:favorites-updated"

const isBrowser = () => typeof window !== "undefined"

const getStorageKey = (uid: string) => `${FAVORITES_STORAGE_PREFIX}${uid}`

const readFromStorage = (uid: string): string[] => {
  if (!isBrowser()) {
    return []
  }

  const rawValue = window.localStorage.getItem(getStorageKey(uid))
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) {
      return []
    }
    return parsed.filter((entry): entry is string => typeof entry === "string")
  } catch {
    return []
  }
}

const writeToStorage = (uid: string, listingIds: string[]) => {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(getStorageKey(uid), JSON.stringify(listingIds))
  window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT, { detail: { uid } }))
}

export const getFavoriteListingIds = (uid: string): string[] => readFromStorage(uid)

export const isListingFavorited = (uid: string, listingId: string): boolean =>
  readFromStorage(uid).includes(listingId)

export const toggleFavoriteListing = (uid: string, listingId: string): boolean => {
  const current = readFromStorage(uid)
  const alreadyFavorited = current.includes(listingId)
  const next = alreadyFavorited ? current.filter((id) => id !== listingId) : [...current, listingId]

  writeToStorage(uid, next)
  return !alreadyFavorited
}
