import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.js"
import { validate } from "../middlewares/validate.js"
import { register, getMe, updateMe } from "../controllers/auth.controller.js"
import { registerSchema, updateProfileSchema } from "../validators/auth.schema.js"

const router = Router()

router.post("/register", authenticate, validate(registerSchema), register)
router.get("/me", authenticate, getMe)
router.put("/me", authenticate, validate(updateProfileSchema), updateMe)
export default router
