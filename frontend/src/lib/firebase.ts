import { getApp, getApps, initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBB4VIOVsdOoH_VAQJT0p6E0Cu4UY0alkI",
  authDomain: "group5-grancanaria.firebaseapp.com",
  projectId: "group5-grancanaria",
  storageBucket: "group5-grancanaria.firebasestorage.app",
  messagingSenderId: "1012450855388",
  appId: "1:1012450855388:web:074864de0e418f1384e719",
  measurementId: "G-EKWX6PQSRT",
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
export const db = getFirestore(app)
