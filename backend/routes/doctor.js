const express = require("express")
const doctor = express.Router()
const db = require("../db/dbConn")
const auth = require("../auth/auth")

doctor.use(express.json())

// Get all patients
doctor.get("/patients", auth, async (req, res) => {
  try {
    if (req.user.role !== 1)
      return res.status(403).json({error: "Access denied"})

    const patients = await db.GetAllPatients()
    res.json(patients)

  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Server error"
    })
  }
})

// View a specific patient's medication schedules 
doctor.get("/patients/:id/schedules",auth,async (req, res) => {
    try {
      if (req.user.role !== 1)
        return res.status(403).json({error: "Access denied"})
      const patientId = req.params.id
      const schedules = await db.GetPatientSchedules(patientId)

      res.json(schedules)

    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Server error"})
    }
  }
)

// Prescribe medication to a patient 
doctor.post("/patients/:id/prescribe",auth,async (req, res) => {
    try {
      if (req.user.role !== 1) {
        return res.status(403).json({error: "Access denied"})
      }

      const patientId = req.params.id
      const { medication_name, dosage, with_food, start_date, end_date, schedule_times } = req.body

      const result = await db.AddUserSchedule(
          patientId,
          medication_name,
          dosage,
          with_food,
          start_date,
          end_date,
          schedule_times)

      res.status(201).json({
        message: "Medication prescribed successfully"
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({error: "Server error"})
    }
  }
)


module.exports = doctor