import { Router } from "express"
import authRoutes from "./auth.routes.js"
import renterApplicationRoutes from "./renterApplication.routes.js"
import adminRoutes from "./admin.routes.js"
import reviewRoutes from "./review.routes.js"
import listingRoutes from "./listing.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/applications", renterApplicationRoutes)
router.use("/admin", adminRoutes)
router.use("/reviews", reviewRoutes)
router.use("/listings", listingRoutes)

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

export default router
