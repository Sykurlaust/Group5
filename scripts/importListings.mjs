import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import admin from "firebase-admin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json")
const listingsPath = path.join(__dirname, "csvjson.json")

const serviceAccount = JSON.parse(await readFile(serviceAccountPath, "utf8"))

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()

const rawListings = JSON.parse(await readFile(listingsPath, "utf8"))
const listings = Array.isArray(rawListings)
  ? rawListings
  : Array.isArray(rawListings?.listings)
    ? rawListings.listings
    : []

if (!listings.length) {
  console.log("No listings found in scripts/csvjson.json")
  process.exit(0)
}

let uploadedCount = 0

for (const listing of listings) {
  const url = pickField(listing, ["url", "URL"])
  const docId = getListingDocId(url)
  if (!docId) {
    continue
  }

  const docData = {
    url: url ?? "",
    title: pickField(listing, ["title", "TITLE"]) ?? "",
    price: toNumberOrString(pickField(listing, ["price", "PRICE"])),
    currency: pickField(listing, ["currency", "CURRENCY"]) ?? "",
    bedrooms: toNumberOrString(pickField(listing, ["bedrooms", "BEDROOMS"])),
    area: toNumberOrString(pickField(listing, ["area", "AREA"])),
    floor: pickField(listing, ["floor", "FLOOR"]) ?? "",
    description: pickField(listing, ["description", "DESCRIPTION"]) ?? "",
    image: pickField(listing, ["image", "MAIN IMAGE"]) ?? "",
    phone: pickField(listing, ["phone", "PHONE"]) ?? "",
    source: "lobstr",
  }

  await db.collection("listings").doc(docId).set(docData, { merge: true })
  uploadedCount += 1
}

console.log(`Imported ${uploadedCount} listings into Firestore collection "listings".`)

function getListingDocId(url) {
  if (typeof url !== "string" || !url.trim()) {
    return null
  }

  const match = url.match(/\/inmueble\/(\d+)(?:[/?#]|$)/i)
  if (match?.[1]) {
    return match[1]
  }

  return Buffer.from(url).toString("base64url").slice(0, 120)
}

function pickField(record, keys) {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value
    }
  }
  return null
}

function toNumberOrString(value) {
  if (value === null || value === undefined || value === "") {
    return null
  }
  const num = Number(value)
  return Number.isNaN(num) ? value : num
}
