import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.js"
import { authorize } from "../middlewares/authorize.js"
import { getUsers, getUser, patchUserRole, patchUserVerify, removeUser } from "../controllers/admin.controller.js"

const router = Router()

// All admin routes require authentication + admin role
router.use(authenticate, authorize("admin"))

router.get("/users", getUsers)
router.get("/users/:uid", getUser)
router.patch("/users/:uid/role", patchUserRole)
router.patch("/users/:uid/verify", patchUserVerify)
router.delete("/users/:uid", removeUser)

export default router
