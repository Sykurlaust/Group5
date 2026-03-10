import { Router } from "express"
import authRoutes from "./auth.routes.js"
import renterApplicationRoutes from "./renterApplication.routes.js"

const router = Router()

router.use("/auth", authRoutes)
router.use("/applications", renterApplicationRoutes)

// Health check
router.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() })
})

export default router
