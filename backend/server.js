const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config()

const app = express()

// Import routes
const authRoutes = require("./routes/auth")
const productRoutes = require("./routes/products")
const billRoutes = require("./routes/bills")
const analyticsRoutes = require("./routes/analytics")

// Middleware

// --- CORS FIX ---
// We now configure CORS to only allow requests from your live frontend
// It will use the FRONTEND_URL you set in Vercel's environment variables
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // Allows cookies/auth headers to be sent
  optionsSuccessStatus: 200 // For older browsers
}
app.use(cors(corsOptions))
// --- END FIX ---

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/bills", billRoutes)
app.use("/api/analytics", analyticsRoutes)

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ message: "Stock-Sage API is running!", timestamp: new Date().toISOString() })
})

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Connect to database
connectDB()

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// The app.listen and process.on('SIGTERM') blocks have been removed
// as they are not needed for Vercel's serverless environment.

// ---- VERCEL CRITICAL CHANGE ----
// Export the app handler for Vercel to use
module.exports = app