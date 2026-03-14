import cron from "node-cron"
import pool from "../db/db.js"
import fs from "fs/promises"

const LOG_FILE = "delivery.log"

const deliverMessages = async () => {
  try {

    // Update and fetch messages that should be delivered
    const result = await pool.query(`
      UPDATE messages
      SET status = 'DELIVERED',
          delivered_at = CURRENT_TIMESTAMP
      WHERE status = 'PENDING'
      AND deliver_at <= CURRENT_TIMESTAMP
      RETURNING *
    `)

    const deliveredMessages = result.rows

    if (deliveredMessages.length === 0) {
      return
    }

    for (const msg of deliveredMessages) {

      const log = `[${new Date().toLocaleString()}] Delivered message ${msg.id} to ${msg.recipient_email}\n`

      await fs.appendFile(LOG_FILE, log)

      console.log(log)

    }

  } catch (error) {
    console.error("Scheduler error:", error)
  }
}

export const startDeliveryWorker = () => {

  cron.schedule("* * * * *", async () => {
    console.log("Checking scheduled messages:", new Date().toLocaleString())
    await deliverMessages()
  })

}