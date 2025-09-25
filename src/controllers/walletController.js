import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Wallet } from "../models/wallet.model.js";

// ✅ Get Current User Wallet
const getWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });

  if (!wallet) throw new ApiError(404, "Wallet not found");

  return res
    .status(200)
    .json(new ApiResponse(200, wallet, "Wallet fetched successfully"));
});

// ✅ Add Funds (virtual money top-up)
const addFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) throw new ApiError(400, "Invalid amount");

  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) throw new ApiError(404, "Wallet not found");

  wallet.balance += amount;
  await wallet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, wallet, `Added $${amount} to wallet`));
});

// ✅ Withdraw Funds (virtual money remove)
const withdrawFunds = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) throw new ApiError(400, "Invalid amount");

  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) throw new ApiError(404, "Wallet not found");

  if (wallet.balance < amount)
    throw new ApiError(400, "Insufficient wallet balance");

  wallet.balance -= amount;
  await wallet.save();

  return res
    .status(200)
    .json(new ApiResponse(200, wallet, `Withdrawn $${amount} from wallet`));
});

export { getWallet, addFunds, withdrawFunds };
