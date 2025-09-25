// utils/createTempFolder.js
import fs from "fs";
import path from "path";

const tempDir = path.resolve("./public/temp"); // absolute path

export const createTempFolder = (req, res, next) => {
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
      console.log("✅ Folder 'public/temp' created successfully!");
    }
  } catch (err) {
    console.error("❌ Failed to create 'public/temp' folder:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error: Could not create temp folder",
      error: err.message,
    });
  }
  next();
};
