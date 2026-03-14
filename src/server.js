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
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        recipient_email TEXT NOT NULL,
        message TEXT CHECK (length(message) <= 500),
        deliver_at TIMESTAMP NOT NULL,
        status TEXT DEFAULT 'PENDING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        delivered_at TIMESTAMP
      )
    `)

    res.send("Database initialized successfully")

  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
})

startDeliveryWorker()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})