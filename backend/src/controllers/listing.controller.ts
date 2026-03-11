import type { Request, Response } from "express"
import { getListings, getListingById, getFeaturedListings } from "../services/listing.service.js"

export const listListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const limitCount = Math.min(Number(req.query.limit) || 200, 500)
    const listings = await getListings(limitCount)
    res.json({ listings })
  } catch (error) {
    console.error("listListings error:", error)
    res.status(500).json({ error: "Failed to fetch listings" })
  }
}

export const getListingDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id)
    const listing = await getListingById(id)
    if (!listing) {
      res.status(404).json({ error: "Listing not found" })
      return
    }
    res.json({ listing })
  } catch (error) {
    console.error("getListingDetail error:", error)
    res.status(500).json({ error: "Failed to fetch listing" })
  }
}

export const listFeaturedListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const limitCount = Math.min(Number(req.query.limit) || 20, 50)
    const listings = await getFeaturedListings(limitCount)
    res.json({ listings })
  } catch (error) {
    console.error("listFeaturedListings error:", error)
    res.status(500).json({ error: "Failed to fetch featured listings" })
  }
}
