import { Router } from "express";
import { authController , loginController, refreshController, updateProfile , deleteUser} from "../controllers/authController.js";
import { 
  viewFeeStatus, 
  generateVoucher 
} from '../controllers/fee management/feeControllers.js';

const router = Router();

router.post("/register", authController);
router.post("/login", loginController);
router.post("/refreshController", refreshController)
router.put("/updateProfile", updateProfile)
router.delete("/deleteUser", deleteUser)


router.get('/fees/status', viewFeeStatus);
router.post('/fees/vouchers', generateVoucher);


export default router;
