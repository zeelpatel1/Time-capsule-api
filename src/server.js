import express from "express"
import dotenv from "dotenv"

import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { startDeliveryWorker } from "./scheduler/deliveryWorker.js"

dotenv.config()

const app = express()

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/messages", messageRoutes)

// Start scheduler
startDeliveryWorker()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})