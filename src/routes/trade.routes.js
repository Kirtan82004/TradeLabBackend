import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import axios from "axios";
import {
  placeTrade,
  closeTrade,
  getUserTrades,
  getTradeById,
  getLiveTradePrice,
} from "../controllers/tradeController.js";

const router = Router();

router.get("/test-binance", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Binance fetch failed:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

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
