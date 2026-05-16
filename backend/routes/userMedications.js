
const express = require("express")
const userMed = express.Router()
const db = require("../db/dbConn")
const auth = require("../auth/auth")

userMed.use(express.json())

// Create schedule entry for a user
userMed.post("/", auth, async (req, res) => {
  try {
    const { medication_id, dosage, schedule_time, with_food, frequency } =
      req.body

    if (
      !medication_id ||
      !dosage ||
      !schedule_time ||
      !frequency
    )
      return res.status(400).json({ error: "Missing required fields" })

    const result = await db.AddUserMedication(
      req.user.id,
      medication_id,
      dosage,
      schedule_time,
      with_food,
      frequency
    )

    res.json({ message: "Medication schedule added", id: result.insertId })
  } catch (err) {
    console.error("User medications route error:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// READ all schedules for logged user
userMed.get("/", auth, async (req, res) => {
  try {
    const schedules = await db.GetUserMedication(req.user.id)
    res.json(schedules)
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

// UPDATE schedule
userMed.put("/:id", auth, async (req, res) => {
  try {
    const { dosage, schedule_time, with_food, frequency } = req.body

    await db.UpdateUserMedication(
      req.params.id,
      dosage,
      schedule_time,
      with_food,
      frequency
    )

    res.json({ message: "Medication schedule updated" })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

// DELETE schedule
userMed.delete("/:id", auth, async (req, res) => {
  try {
    await db.DeleteUserMedication(req.params.id)
    res.json({ message: "Medication schedule deleted" })
  } catch (err) {
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = userMed