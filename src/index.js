// backend/index.js

import dotenv from "dotenv";
import connectDB from "./config/dbConnect.js";
import { app, server } from "./app.js"; // ✅ import server for socket.io

dotenv.config({
  path: "./.env", // make sure file is named `.env`
});

// =========================
// Connect to MongoDB
// =========================
connectDB()
  .then(() => {
    // Handle app errors
    app.on("error", (error) => {
      console.error("Express app error:", error);
      throw error;
    });

    // Start the HTTP + WebSocket server
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED !!", err);
  });