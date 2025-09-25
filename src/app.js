// backend/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as socketIo } from "socket.io";

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO Setup
const io = new socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// =========================
// 🔹 Real-time Trading Events
// =========================
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Welcome Notification
  socket.emit("notification", "Welcome to Virtual Trading Platform!");

  // Place Trade (Buy/Sell)
  socket.on("placeTrade", (tradeData) => {
    console.log("Trade Placed:", tradeData);
    io.emit("tradeExecuted", tradeData); // Broadcast to all clients
  });

  // Cancel Trade
  socket.on("cancelTrade", (tradeId) => {
    console.log("Trade Cancelled:", tradeId);
    io.emit("tradeCancelled", tradeId);
  });

  // Order/Trade Status Update
  socket.on("updateTradeStatus", (statusData) => {
    console.log("Trade Status Update:", statusData);
    io.emit("tradeStatusUpdated", statusData);
  });

  // Balance Update
  socket.on("updateBalance", (balanceData) => {
    console.log("Balance Updated:", balanceData);
    io.emit("balanceUpdated", balanceData);
  });

  // Notifications (Admin → Users)
  socket.on("sendNotification", (msg) => {
    console.log("Notification:", msg);
    io.emit("notification", msg);
  });

  // Real-time Chat (optional for community / support)
  socket.on("sendMessage", (messageData) => {
    console.log("Message:", messageData);
    io.emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// =========================
// 🔹 Middleware
// =========================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(express.static("public"));

// =========================
// 🔹 Routes
// =========================
import authRouter from "./routes/auth.routes.js"; // signup/login
import userRouter from "./routes/user.routes.js"; // portfolio, balance
import tradeRouter from "./routes/trade.routes.js"; // place, cancel trades
import adminRouter from "./routes/admin.routes.js"; // manage users
import walletRoutes from "./routes/wallet.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/trades", tradeRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/wallet", walletRoutes);

// =========================
// 🔹 Exports
// =========================
export { app, server, io };
