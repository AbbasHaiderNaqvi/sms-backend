import { Router } from "express";
import { authController , loginController, refreshController, updateProfile , deleteUser} from "../controllers/authController.js";

const router = Router();

router.post("/register", authController);
router.post("/login", loginController);
router.post("/refreshController", refreshController)
router.put("/updateProfile", updateProfile)
router.delete("/deleteUser", deleteUser)

export default router;
