// middlewares/verifyJWT.js
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  // Get token from cookie or Authorization header
  const token =
    req.cookies?.accessToken ||
    req.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request: Access token missing");
  }

  // Verify token
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(401, "Unauthorized request: Invalid or expired token");
  }

  // Fetch user from DB
  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(401, "Unauthorized request: User not found");
  }

  // Attach user to request
  req.user = user;

  // Continue to next middleware/route
  next();
});
