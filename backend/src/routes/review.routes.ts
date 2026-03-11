import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.js"
import { authorize } from "../middlewares/authorize.js"
import { validate } from "../middlewares/validate.js"
import { createReviewSchema, updateReviewSchema } from "../validators/review.schema.js"
import { listReviews, getReview, myReviews, submitReview, editReview, removeReview } from "../controllers/review.controller.js"

const router = Router()

// Public
router.get("/", listReviews)
router.get("/my", authenticate, myReviews)
router.get("/:id", getReview)

// Tenant+ — create review on a listing
router.post(
  "/listing/:listingId",
  authenticate,
  authorize("tenant", "landlord", "admin"),
  validate(createReviewSchema),
  submitReview,
)

// Owner or admin — edit / delete
router.put("/:id", authenticate, validate(updateReviewSchema), editReview)
router.delete("/:id", authenticate, removeReview)

export default router
