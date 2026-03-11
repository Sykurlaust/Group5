import { Router } from "express"
import { listListings, getListingDetail, listFeaturedListings } from "../controllers/listing.controller.js"

const router = Router()

// /featured must be before /:id to avoid route conflict
router.get("/featured", listFeaturedListings)
router.get("/", listListings)
router.get("/:id", getListingDetail)

export default router
