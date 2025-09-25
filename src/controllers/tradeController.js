// controllers/trade.controller.js
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Trade } from "../models/trade.model.js";
import { Wallet } from "../models/wallet.model.js";
import axios from "axios";
import { io } from "../app.js";

// 🔹 Helper: Get live price (Binance public API)
const getLivePrice = async (symbol) => {
  try {
    const res = await axios.get(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
    );
    return parseFloat(res.data.price);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch live price");
  }
};

// ✅ Place a trade (buy/sell)
const placeTrade = asyncHandler(async (req, res) => {
  console.log("Placing trade with data:", req.body);
  const { symbol, side, quantity, orderType = "market" } = req.body;

  if (!symbol || !side || !quantity)
    throw new ApiError(400, "Symbol, side, and quantity are required");

  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) throw new ApiError(404, "Wallet not found");

  const currentPrice = await getLivePrice(symbol);
  const totalCost = currentPrice * quantity;

  if (side === "buy" && wallet.balance < totalCost)
    throw new ApiError(400, "Insufficient wallet balance");

  // Deduct balance for buy
  if (side === "buy") wallet.balance -= totalCost;
  await wallet.save();

  //add balance for sell
  if (side === "sell") wallet.balance += totalCost;
  await wallet.save();
  console.log("Wallet after trade:", wallet);


  // Create trade
  const trade = await Trade.create({
    userId: req.user._id,
    symbol,
    side,
    orderType,
    quantity,
    price: currentPrice,
    status: "open",
    });

  // 🔹 Emit real-time event
  io.emit("tradePlaced", {
    tradeId: trade._id,
    userId: trade.userId,
    symbol: trade.symbol,
    side: trade.side,
    quantity: trade.quantity,
    price: trade.price,
    status: trade.status,
  });

  // 🔹 Emit wallet update
  io.emit("walletUpdated", { userId: wallet.userId, balance: wallet.balance });

  return res
    .status(201)
    .json(new ApiResponse(201, trade, "Trade placed successfully"));
});

// ✅ Close a trade
const closeTrade = asyncHandler(async (req, res) => {
  const { tradeId } = req.params;

  const trade = await Trade.findById(tradeId);
  if (!trade) throw new ApiError(404, "Trade not found");
  if (trade.status !== "open") throw new ApiError(400, "Trade already closed");

  const currentPrice = await getLivePrice(trade.symbol);

  // Calculate P&L
  let pnl = 0;
  if (trade.side === "buy") pnl = (currentPrice - trade.price) * trade.quantity;
  if (trade.side === "sell") pnl = (trade.price - currentPrice) * trade.quantity;

  trade.pnl = pnl;
  trade.status = "closed";
  trade.executedAt = new Date();
  await trade.save();

  // Update wallet balance
  const wallet = await Wallet.findOne({ userId: trade.userId });
  if (!wallet) throw new ApiError(404, "Wallet not found");

  wallet.balance += trade.side === "buy" ? trade.price * trade.quantity + pnl : pnl;
  await wallet.save();

  // 🔹 Emit real-time events
  io.emit("tradeClosed", {
    tradeId: trade._id,
    userId: trade.userId,
    pnl: trade.pnl,
    status: trade.status,
  });
  io.emit("walletUpdated", { userId: wallet.userId, balance: wallet.balance });

  return res
    .status(200)
    .json(new ApiResponse(200, trade, "Trade closed successfully"));
});

// ✅ Get all trades of current user
const getUserTrades = asyncHandler(async (req, res) => {
  const trades = await Trade.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, trades, "User trades fetched successfully"));
});

// ✅ Get single trade by ID
const getTradeById = asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.tradeId);
  if (!trade) throw new ApiError(404, "Trade not found");
  return res.status(200).json(new ApiResponse(200, trade, "Trade fetched successfully"));
});

// ✅ Get live price of any symbol
const getLiveTradePrice = asyncHandler(async (req, res) => {
  const { symbol } = req.params;
  if (!symbol) throw new ApiError(400, "Symbol is required");

  const price = await getLivePrice(symbol);
  return res.status(200).json(new ApiResponse(200, { symbol, price }, "Live price fetched"));
});

export { placeTrade, closeTrade, getUserTrades, getTradeById, getLiveTradePrice };
