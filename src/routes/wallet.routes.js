import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { getWallet, addFunds, withdrawFunds } from "../controllers/walletController.js";

const router = Router();

// ✅ All routes protected
router.use(verifyJWT);

// ----- Wallet Operations -----
router.get("/", getWallet);           // Get current user's wallet
router.post("/add", addFunds);        // Add virtual funds to wallet
router.post("/withdraw", withdrawFunds); // Withdraw virtual funds from wallet

export default router;
