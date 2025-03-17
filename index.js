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
app.use("/api/power", require("./routes/power")); // Example: http://your-server-ip:10000/api/power

// Connect to MongoDB
const PORT = process.env.PORT || 10000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/yourDB"; // Use 0.0.0.0 to bind to all IPs

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on: http://0.0.0.0:${PORT}`);
    });

    // Increase timeout values to prevent connection resets
    server.keepAliveTimeout = 120000; // 120 seconds
    server.headersTimeout = 120000;
  })
  .catch((error) => console.log(`❌ MongoDB connection error: ${error.message}`));

// Handle SIGKILL, SIGTERM to prevent crashes
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  process.exit(0);
});

process.on("SIGKILL", () => {
  console.log("SIGKILL received. Shutting down immediately...");
  process.exit(1);
});
