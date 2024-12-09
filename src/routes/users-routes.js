import { Router } from "express";
import { userRegister } from "../controllers/user-controller.js";
import { upload } from "../middlewares/multer-mid.js"

const router = Router();

// router.post("/register", userRegister) // 1st method
// router.route("/register").post(userRegister) // 2nd method

// 2nd method with middlewares
router.route("/register").post(
	// this is middleware
	upload.fields([
		{ name: "avatar", maxCount: 1 },
		{ name: "coverImage", maxCount: 1 }
	]),
	userRegister // and this is my controller
)

export default router
