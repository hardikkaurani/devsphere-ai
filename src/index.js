require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

const app = express()

// 🔥 Security - Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests, please try again later."
})

app.use(limiter)

// 🔥 Middleware
app.use(cors())
app.use(express.json())

// 🔥 Health Route
app.get("/", (req, res) => {
  res.send("DevSphere AI Server Running 🚀")
})

// 🔥 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected 🔥")

    // Routes
    const authRoutes = require("./routes/authRoutes")
    app.use("/api/v1/auth", authRoutes)

    const agentRoutes = require("./routes/agentRoutes")
    app.use("/api/v1/agent", agentRoutes)

    const authMiddleware = require("./middleware/authMiddleware")

    app.get("/api/protected", authMiddleware, (req, res) => {
      res.json({
        success: true,
        message: "Protected route accessed",
        user: req.user
      })
    })

    // 🔥 Global Error Handler (Production Touch)
    app.use((err, req, res, next) => {
      console.error(err.stack)
      res.status(500).json({
        success: false,
        message: "Something went wrong"
      })
    })

    // 🔥 Start Server
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`)
    })

  })
  .catch((err) => {
    console.log("DB Error:", err)
  })