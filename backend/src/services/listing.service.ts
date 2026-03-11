import { firestore } from "../config/firebase.js"
import type { Listing } from "../models/listing.model.js"

const listingsCollection = firestore.collection("listings")

// ─── helpers ────────────────────────────────────────────────────────────────

function readString(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function readNullableNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null
  if (typeof value !== "string") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function readNumber(value: unknown, fallback: number): number {
  return readNullableNumber(value) ?? fallback
}

function parsePrice(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? Math.round(value) : null
  if (typeof value !== "string") return null
  const cleaned = value
    .toLowerCase()
    .replace(/\/\s*month|per\s*month|monthly|\/\s*mes|al\s*mes/g, "")
    .replace(/[^\d.,]/g, "")
    .trim()
  if (!cleaned) return null
  const digits = cleaned.replace(/[.,]/g, "")
  if (!digits) return null
  const parsed = Number.parseInt(digits, 10)
  return Number.isNaN(parsed) ? null : parsed
}

function detectPropertyType(title: string): string {
  const t = title.toLowerCase()
  if (t.includes("villa")) return "Villa"
  if (t.includes("house") || t.includes("chalet") || t.includes("detached")) return "House"
  if (t.includes("studio")) return "Studio"
  return "Apartment"
}

function extractLocationParts(title: string): { location: string; municipality: string } {
  const knownMunicipalities = [
    "Las Palmas", "Telde", "Santa Lucía", "San Bartolomé de Tirajana", "Arucas",
    "Tías", "Maspalomas", "Playa del Inglés", "Puerto Rico", "Arguineguín",
    "Vecindario", "Ingenio", "Agüimes", "Mogán", "Gáldar",
  ]
  for (const municipality of knownMunicipalities) {
    if (title.toLowerCase().includes(municipality.toLowerCase())) {
      return { municipality, location: municipality }
    }
  }
  const match = title.match(/\bin\s+([A-Z][a-zA-Z\s]+?)(?:\s*[-,|]|$)/)
  if (match?.[1]) {
    const loc = match[1].trim()
    return { location: loc, municipality: loc }
  }
  return { location: "", municipality: "" }
}

function readOwnerId(data: FirebaseFirestore.DocumentData): string {
  return (
    readString(data.landlordId) ||
    readString(data.ownerId) ||
    readString(data.ownerUid) ||
    readString(data.userId) ||
    readString(data.uid)
  )
}

function mapDoc(id: string, data: FirebaseFirestore.DocumentData): Listing {
  const title = readString(data.title) || "Untitled listing"
  const { location: extractedLocation, municipality: extractedMunicipality } = extractLocationParts(title)

  return {
    id,
    title,
    price: parsePrice(data.price),
    currency: readString(data.currency) || "€",
    bedrooms: readNullableNumber(data.bedrooms),
    area: readNullableNumber(data.area),
    floor: readString(data.floor),
    description: readString(data.description),
    image: readString(data.image),
    url: readString(data.url),
    phone: readString(data.phone),
    type: readString(data.type) || detectPropertyType(title),
    location: readString(data.location) || extractedLocation,
    municipality: readString(data.municipality) || extractedMunicipality,
    source: readString(data.source),
    availableFrom: readString(data.availableFrom),
    rentalPeriod: readString(data.rentalPeriod),
    deposit: readString(data.deposit),
    totalMoveInCost: readString(data.totalMoveInCost),
    landlordName:
      readString(data.landlordName) ||
      readString(data.ownerName) ||
      readString(data.contactName),
    landlordImage: readString(data.landlordImage) || readString(data.ownerImage),
    landlordId: readOwnerId(data),
    clicks: readNumber(data.clicks, 0),
  }
}

// ─── public service functions ────────────────────────────────────────────────

export async function getListings(limitCount = 200): Promise<Listing[]> {
  const snapshot = await listingsCollection.limit(limitCount).get()
  return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()))
}

export async function getListingById(id: string): Promise<Listing | null> {
  const doc = await listingsCollection.doc(id).get()
  if (!doc.exists) return null
  return mapDoc(doc.id, doc.data()!)
}

export async function getFeaturedListings(limitCount = 20): Promise<Listing[]> {
  const snapshot = await listingsCollection
    .orderBy("clicks", "desc")
    .limit(limitCount)
    .get()
  return snapshot.docs.map((doc) => mapDoc(doc.id, doc.data()))
}
