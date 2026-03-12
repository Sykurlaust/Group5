import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth"
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore"
import { getStorage } from "firebase/storage"

type FirebaseEnvKey =
  | "VITE_FIREBASE_API_KEY"
  | "VITE_FIREBASE_AUTH_DOMAIN"
  | "VITE_FIREBASE_PROJECT_ID"
  | "VITE_FIREBASE_STORAGE_BUCKET"
  | "VITE_FIREBASE_MESSAGING_SENDER_ID"
  | "VITE_FIREBASE_APP_ID"
  | "VITE_FIREBASE_MEASUREMENT_ID"

const readEnv = (key: FirebaseEnvKey): string => {
  const value = import.meta.env[key]
  if (!value) {
    throw new Error(`Missing Firebase env variable: ${key}`)
  }
  return value
}

const firebaseConfig = {
  apiKey: readEnv("VITE_FIREBASE_API_KEY"),
  authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
  storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  appId: readEnv("VITE_FIREBASE_APP_ID"),
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const auth = getAuth(app)

void setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.warn("Failed to set auth persistence to session", error)
})

// Guard against Vite HMR re-evaluation: initializeFirestore throws if called
// on an already-initialized app. Fall back to getFirestore which returns the
// existing instance (which retains any cache settings from the first call).
const initDb = () => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache(),
      // Helps avoid WebChannel stream timeout issues (Listen/channel) on some networks.
      experimentalAutoDetectLongPolling: true,
    })
  } catch {
    return getFirestore(app)
  }
}
export const db = initDb()
export const storage = getStorage(app)
