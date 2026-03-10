import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth"
import { auth } from "../lib/firebase"

export { auth }

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

export const facebookProvider = new FacebookAuthProvider()
