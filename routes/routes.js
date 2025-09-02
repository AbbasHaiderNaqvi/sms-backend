// routes/routes.js
import { Router } from "express";
import {
  authController,
  loginController,
  refreshController,
  updateProfile,
  deleteUser
} from "../controllers/authController.js";

import { authenticateJWT } from "../controllers/auth/authmidleware.js";

// Optional: Fee controllers (example)
import {
  viewFeeStatus,
  generateVoucher
} from "../controllers/fee management/feeControllers.js";

const router = Router();

// Auth routes
router.post("/register", authController);
router.post("/login", loginController);
router.post("/refresh", refreshController); // fixed route name
router.put("/updateProfile", authenticateJWT, updateProfile);
router.delete("/deleteUser", authenticateJWT, deleteUser);

// Fee routes (protected)
router.get("/viewFeeStatus", authenticateJWT, viewFeeStatus);
router.post("/generateVoucher", authenticateJWT, generateVoucher);

// Optional additional aliases
router.get("/fees/status", authenticateJWT, viewFeeStatus);
router.post("/fees/vouchers", authenticateJWT, generateVoucher);

export default router;
