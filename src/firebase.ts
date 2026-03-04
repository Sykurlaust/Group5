import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyBB4VIOVsdOoH_VAQJT0p6E0Cu4UY0alkI",
  authDomain: "group5-grancanaria.firebaseapp.com",
  projectId: "group5-grancanaria",
  storageBucket: "group5-grancanaria.firebasestorage.app",
  messagingSenderId: "1012450855388",
  appId: "1:1012450855388:web:074864de0e418f1384e719",
  measurementId: "G-EKWX6PQSRT",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const facebookProvider = new FacebookAuthProvider()
