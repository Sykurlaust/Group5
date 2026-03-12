import { Router } from "express"
import { authenticate } from "../middlewares/authenticate.js"
import { authorize } from "../middlewares/authorize.js"
import {
	createUser,
	getUsers,
	getStats,
	getUser,
	patchUserRole,
	patchUserVerify,
	patchApplicationStatus,
	removeUser,
} from "../controllers/admin.controller.js"

const router = Router()

// All admin routes require authentication + admin role
router.use(authenticate, authorize("admin"))

router.post("/users", createUser)
router.get("/users", getUsers)
router.get("/stats", getStats)
router.get("/users/:uid", getUser)
router.patch("/users/:uid/role", patchUserRole)
router.patch("/users/:uid/verify", patchUserVerify)
router.patch("/applications/:applicationId/status", patchApplicationStatus)
router.delete("/users/:uid", removeUser)

export default router
