import { Router } from "express"
import { submitRenterApplication } from "../controllers/renterApplication.controller.js"
import { authenticate } from "../middlewares/authenticate.js"
import { validate } from "../middlewares/validate.js"
import { renterApplicationSchema } from "../validators/renterApplication.schema.js"

const router = Router()

router.post("/renter", authenticate, validate(renterApplicationSchema), submitRenterApplication)

export default router
