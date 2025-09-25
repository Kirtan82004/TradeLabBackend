import mongoose from "mongoose";
import { Schema } from "mongoose";

const walletSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 10000 },
    currency: { type: String, default: "USD" },
    history: [
      {
        type: { type: String, enum: ["deposit","withdraw","trade"], required: true },
        amount: { type: Number, required: true },
        balanceAfter: { type: Number, required: true },
        date: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);
export const Wallet = mongoose.model("Wallet", walletSchema);
