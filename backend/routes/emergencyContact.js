const express = require("express")
const emergency = express.Router()
const db = require("../db/dbConn")
const auth = require("../auth/auth")

emergency.use(express.json())

// GET current emergency contact
emergency.get("/", auth, async (req, res) => {
  try {
    const contact = await db.GetEmergencyContact(req.user.id)
    res.json(contact[0] || null)
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Server error"
    })
  }
})

// Add emergency contact or update 
emergency.post("/", auth, async (req, res) => {

  try {
    const { contact_name, contact_email } = req.body

    if (!contact_name ||!contact_email) 
        return res.status(400).json({error: "Missing fields"})

    const existing =
      await db.GetEmergencyContact(req.user.id)

    if (existing.length > 0) {
      await db.UpdateEmergencyContact( req.user.id, contact_name, contact_email )

      return res.json({
        message:
          "Emergency contact updated"
      })
    }

      
    await db.AddEmergencyContact( req.user.id, contact_name, contact_email )

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