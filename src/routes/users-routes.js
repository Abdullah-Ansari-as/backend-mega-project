import { Router } from "express";
import {userRegister} from "../controllers/user-controller.js";

const router = Router();

// router.post("/register", userRegister) // 1st method
router.route("/register").post(userRegister) // 2nd method

export default router