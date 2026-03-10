import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.js"
import { register, getMe, updateMe } from "../controllers/auth.controller.js"

const router = Router()

router.post("/register", register)
router.get("/me", authenticate, getMe)
router.put("/me", authenticate, updateMe)

export default router
