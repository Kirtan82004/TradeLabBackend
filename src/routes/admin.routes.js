import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
 // optional: middleware to restrict admin only
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserWallet,
  getAllTrades,
  getTradeById,
} from "../controllers/admin/adminController.js";

const router = Router();

// ✅ All routes protected & admin only
router.use(verifyJWT);
//router.use(isAdmin); // optional: restrict to admin users

// ----- User Management -----
router.get("/users", getAllUsers);             // Get all users
router.get("/users/:userId", getUserById);     // Get user by ID
router.put("/users/:userId", updateUser);      // Update user by admin
router.delete("/users/:userId", deleteUser);   // Delete user
router.post("/users/:userId/reset-wallet", resetUserWallet); // Reset wallet balance

// ----- Trade Management -----
router.get("/trades", getAllTrades);           // Get all trades
router.get("/trades/:tradeId", getTradeById);  // Get trade by ID

export default router;
