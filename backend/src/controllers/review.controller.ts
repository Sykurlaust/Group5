import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/authenticate.js"
import {
  getReviews,
  getReviewById,
  getUserReviewForListing,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/review.service.js"

export const listReviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(req.query.limit) || 20, 100)
    const cursor = typeof req.query.cursor === "string" ? req.query.cursor : undefined
    const result = await getReviews(limit, cursor)
    res.json(result)
  } catch (error) {
    console.error("listReviews error:", error)
    res.status(500).json({ error: "Failed to fetch reviews" })
  }
}

export const getReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id)
    const review = await getReviewById(id)
    if (!review) {
      res.status(404).json({ error: "Review not found" })
      return
    }
    res.json({ review })
  } catch (error) {
    console.error("getReview error:", error)
    res.status(500).json({ error: "Failed to fetch review" })
  }
}

export const myReviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const reviews = await getMyReviews(req.user!.uid)
    res.json({ reviews })
  } catch (error) {
    console.error("myReviews error:", error)
    res.status(500).json({ error: "Failed to fetch your reviews" })
  }
}

export const submitReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const listingId = String(req.params.listingId)
    const { rating, title, comment } = req.body

    // 1 review per user per listing
    const existing = await getUserReviewForListing(req.user!.uid, listingId)
    if (existing) {
      res.status(409).json({ error: "You have already reviewed this listing" })
      return
    }

    const review = await createReview({
      listingId,
      userId: req.user!.uid,
      userName: req.body.userName ?? "Anonymous",
      userPhoto: req.body.userPhoto ?? null,
      rating,
      title,
      comment,
    })

    res.status(201).json({ review })
  } catch (error) {
    console.error("submitReview error:", error)
    res.status(500).json({ error: "Failed to create review" })
  }
}

export const editReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id)
    const existing = await getReviewById(id)

    if (!existing) {
      res.status(404).json({ error: "Review not found" })
      return
    }

    // Only owner or admin can edit
    if (existing.userId !== req.user!.uid && req.user!.role !== "admin") {
      res.status(403).json({ error: "Insufficient permissions" })
      return
    }

    const review = await updateReview(id, req.body)
    res.json({ review })
  } catch (error) {
    console.error("editReview error:", error)
    res.status(500).json({ error: "Failed to update review" })
  }
}

export const removeReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id)
    const existing = await getReviewById(id)

    if (!existing) {
      res.status(404).json({ error: "Review not found" })
      return
    }

    // Only owner or admin can delete
    if (existing.userId !== req.user!.uid && req.user!.role !== "admin") {
      res.status(403).json({ error: "Insufficient permissions" })
      return
    }

    await deleteReview(id)
    res.status(204).send()
  } catch (error) {
    console.error("removeReview error:", error)
    res.status(500).json({ error: "Failed to delete review" })
  }
}
