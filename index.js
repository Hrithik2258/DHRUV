const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// Enable CORS for all origins and all methods
app.use(
  cors({
    origin: "*", // Allows access from any frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

// Sample API Route
app.get("/", (req, res) => {
  res.send("✅ Server is running and accessible!");
});

// Import Routes
app.use("/api/power", require("./routes/power")); // Example: http://your-server-ip:5000/api/power

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/yourDB"; // Use 127.0.0.1 instead of 0.0.0.0 for localhost

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on: http://0.0.0.0:${PORT}`);
    });

    // Increase timeout values to prevent connection resets
    server.keepAliveTimeout = 120000; // 120 seconds
    server.headersTimeout = 120000;
  })
  .catch((error) => {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  });

// Graceful Shutdown Handlers
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  process.exit(0);
});
