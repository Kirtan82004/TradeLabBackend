import mongoose, { Schema } from "mongoose";

const tradeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    symbol: {
      type: String, // e.g., BTCUSDT, EURUSD
      required: true,
    },
    side: {
      type: String,
      enum: ["buy", "sell"],
      required: true,
    },
    orderType: {
      type: String,
      enum: ["market", "limit"],
      default: "market",
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    pnl: {
      type: Number,
      default: 0, // profit/loss
    },
    status: {
      type: String,
      enum: ["open", "closed", "cancelled"],
      default: "open",
    },
    executedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Trade = mongoose.model("Trade", tradeSchema);
