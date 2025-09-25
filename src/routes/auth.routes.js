import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  UpdateAccountDetail,
  updateUserImage,
  getCurrentUser
} from "../controllers/auth/authController.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

// ✅ Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh-token", refreshAccessToken);

// ✅ Protected Routes
router.use(verifyJWT); // all routes below require authentication
router.post("/logout", logoutUser);
router.put("/change-password", changeCurrentPassword);
router.put("/update-profile", UpdateAccountDetail);
router.get("/me", getCurrentUser);
router.put("/update-image", upload.single("image"), updateUserImage);

export default router;
