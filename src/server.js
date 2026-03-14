import dotenv from "dotenv"
import express from "express"

import authRoutes from "./routes/authRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import { startDeliveryWorker } from "./scheduler/deliveryWorker.js"


dotenv.config()

const app = express()

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/messages", messageRoutes)

app.get("/init-db", async (req, res) => {

  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `)

  res.send("Database initialized")
})

startDeliveryWorker()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})