
const express = require("express")
const userMed = express.Router()
const db = require("../db/dbConn")
const auth = require("../auth/auth")

userMed.use(express.json())

// Add a medication 
userMed.post("/medications", auth, async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: "Medication name is required" });
    }
    const result = await db.AddMedication(name)
    res.json({ message: "Medication added", id: result.insertId })
  } catch (err) {
    console.error("Error adding medication:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// Create schedule entry for a user
userMed.post("/schedules", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { medication_name, dosage, schedule_times, with_food, start_date, end_date } = req.body

    console.log("medication_name:", medication_name);
    console.log("dosage:", dosage);
    console.log("schedule_times:", schedule_times);
    console.log("with_food:", with_food);
    console.log("start_date:", start_date);
    console.log("end_date:", end_date);


    if (
      !medication_name || 
      !dosage || 
      !Array.isArray(schedule_times) || schedule_times.length === 0 || 
      !start_date) 
    return res.status(400).json({ error: "Missing required fields" })

    const result = await db.AddUserSchedule(
      req.user.id,
      medication_name,
      dosage,
      with_food,
      start_date,
      end_date,
      schedule_times
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
    const today = new Date().toISOString().split("T")[0] // Get current date in YYYY-MM-DD format
    const schedules = await db.GetUserMedication(req.user.id, today)
    res.json(schedules)
  } catch (err) {
    console.error("Error fetching user schedules:", err)
    res.status(500).json({ error: "Server error" })
  }
});

// UPDATE schedule
userMed.put("/:id", auth, async (req, res) => {
  try {
    const { dosage, schedule_time, with_food, frequency } = req.body

    if (!dosage || !start_date || !end_date)
      return res.status(400).json({ error: "Missing required fields" })

    await db.UpdateUserMedication(
      req.params.id,
      dosage,
      schedule_time,
      with_food,
      frequency
    )

    res.json({ message: "Medication schedule updated" })
  } catch (err) {
    console.error("Error updating medication schedule:", err)
    res.status(500).json({ error: "Server error" })
  }
})

// DELETE schedule
userMed.delete("/:id", auth, async (req, res) => {
  try {
    await db.DeleteUserMedication(req.params.id)
    res.json({ message: "Medication schedule deleted" })
  } catch (err) {
    console.error("Error deleting medication schedule:", err)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = userMed