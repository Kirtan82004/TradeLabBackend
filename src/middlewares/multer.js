// utils/multer.js
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 🔹 Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); // folder to store uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // get file extension
    const uniqueName = `${uuidv4()}${ext}`; // generate unique filename
    cb(null, uniqueName);
  },
});

// 🔹 File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
  }
};

// 🔹 Upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
// Usage: app.post('/upload', upload.single('image'), (req, res) => { ... });