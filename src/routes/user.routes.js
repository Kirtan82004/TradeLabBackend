import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  getUserWallet,
  getUserTrades,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user/userController.js";

const router = Router();

// All routes protected
router.use(verifyJWT);

// ✅ Get user's wallet
router.get("/wallet", getUserWallet);

// ✅ Get user's trades
router.get("/trades", getUserTrades);

// ✅ Get user profile
router.get("/profile", getUserProfile);

// ✅ Update user profile
router.put("/profile", updateUserProfile);

export default router;
