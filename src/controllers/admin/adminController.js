import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { Trade } from "../../models/trade.model.js";
import { Wallet } from "../../models/wallet.model.js";

// ✅ Get all users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, users, "All users fetched"));
});

// ✅ Get user by ID
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

// ✅ Update user by admin
const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNo, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { fullName, email, phoneNo, address },
    { new: true }
  ).select("-password -refreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

// ✅ Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

// ✅ Reset user wallet balance
const resetUserWallet = asyncHandler(async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.params.userId });
  if (!wallet) throw new ApiError(404, "Wallet not found");
  wallet.balance = 10000; // reset to default virtual balance
  await wallet.save();
  return res.status(200).json(new ApiResponse(200, wallet, "User wallet reset successfully"));
});

// ✅ Get all trades
const getAllTrades = asyncHandler(async (req, res) => {
  const trades = await Trade.find().populate("userId", "fullName email");
  return res.status(200).json(new ApiResponse(200, trades, "All trades fetched"));
});

// ✅ Get trade by ID
const getTradeById = asyncHandler(async (req, res) => {
  const trade = await Trade.findById(req.params.tradeId).populate("userId", "fullName email");
  if (!trade) throw new ApiError(404, "Trade not found");
  return res.status(200).json(new ApiResponse(200, trade, "Trade fetched successfully"));
});

export {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  resetUserWallet,
  getAllTrades,
  getTradeById
};
