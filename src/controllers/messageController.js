import pool from "../db/db.js"

export const createMessage = async (req, res) => {
  try {
    const { recipient_email, message, deliver_at } = req.body
    const userId = req.user.userId

    if (!recipient_email || !message || !deliver_at) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (message.length > 500) {
      return res.status(400).json({ message: "Message exceeds 500 characters" })
    }

    const deliveryDate = new Date(deliver_at)

if (isNaN(deliveryDate)) {
  return res.status(400).json({ message: "Invalid date format" })
}

if (deliveryDate <= new Date()) {
  return res.status(400).json({ message: "deliver_at must be in the future" })
}

    // Store exactly what the user sends (no UTC conversion)
    const result = await pool.query(
      `INSERT INTO messages (user_id, recipient_email, message, deliver_at)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [userId, recipient_email, message, deliveryDate.toISOString()]
    )

    res.status(201).json({
      message: "Message scheduled successfully",
      data: result.rows[0]
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}


export const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId

    const result = await pool.query(
      `SELECT id, recipient_email, message, deliver_at, status, created_at, delivered_at
       FROM messages
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [userId]
    )

    res.json(result.rows)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Internal server error" })
  }
}