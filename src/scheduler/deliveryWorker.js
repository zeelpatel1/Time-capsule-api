import cron from "node-cron"
import pool from "../db/db.js"
import fs from "fs/promises"

const LOG_FILE = "delivery.log"

const deliverMessages = async () => {
  try {

    const result = await pool.query(`
      SELECT *
      FROM messages
      WHERE status='PENDING'
      AND deliver_at <= CURRENT_TIMESTAMP
    `)

    const messages = result.rows

    for (const msg of messages) {

      await pool.query(
        `UPDATE messages
         SET status='DELIVERED',
             delivered_at=CURRENT_TIMESTAMP
         WHERE id=$1`,
        [msg.id]
      )

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