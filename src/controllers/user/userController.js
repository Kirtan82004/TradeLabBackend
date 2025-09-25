import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Wallet } from "../../models/wallet.model.js";
import { Trade } from "../../models/trade.model.js";
import { User } from "../../models/user.model.js";

// ✅ Get current user's wallet
const getUserWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.user._id });
  if (!wallet) throw new ApiError(404, "Wallet not found");

  return res
    .status(200)
    .json(new ApiResponse(200, wallet, "Wallet fetched successfully"));
});

// ✅ Get all trades of current user
const getUserTrades = asyncHandler(async (req, res) => {
  const trades = await Trade.find({ userId: req.user._id }).sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, trades, "User trades fetched successfully"));
});

// ✅ Get current user's profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// ✅ Update current user's profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNo, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName, email, phoneNo, address },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile updated successfully"));
});

export { getUserWallet, getUserTrades, getUserProfile, updateUserProfile };
