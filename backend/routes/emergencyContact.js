const express = require("express")
const emergency = express.Router()
const db = require("../db/dbConn")
const auth = require("../auth/auth")

emergency.use(express.json())

// Add emergency contact
emergency.post("/", auth, async (req, res) => {

  try {
    const { contact_name, contact_email } = req.body

    if (!contact_name ||!contact_email) 
        return res.status(400).json({error: "Missing fields"})

    await db.AddEmergencyContact(
      req.user.id,
      contact_name,
      contact_email
    )

    res.json({
      message:
        "Emergency contact added"
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Server error"
    })
  }
})

module.exports = emergency