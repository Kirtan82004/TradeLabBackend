import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  placeTrade,
  closeTrade,
  getUserTrades,
  getTradeById,
  getLiveTradePrice,
} from "../controllers/tradeController.js";

const router = Router();

// ✅ All routes protected
router.use(verifyJWT);

// ----- Specific Trade Actions -----
// Place a trade (buy/sell)
router.post("/place", placeTrade);

// Close a trade by ID
router.post("/close/:tradeId", closeTrade);

// Get live price for a symbol
router.get("/live-price/:symbol", getLiveTradePrice);

// ----- Dynamic Routes -----
// Get all trades of current user
router.get("/", getUserTrades);

// Get single trade by ID
router.get("/:tradeId", getTradeById);

export default router;
