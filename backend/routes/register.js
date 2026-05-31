const express = require("express")
const register = express.Router()
const db = require("../db/dbConn")
const bcrypt = require("bcrypt")


register.use(express.json())

register.post("/", async (req, res, next) => {
    try {
      const { first_name, last_name, email, password, role, doctorCode } = req.body

      // Validate input
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" })
      }

      // Check if user already exists
      const existing = await db.GetUser(email);
      if (existing.length > 0) {
        return res.status(400).json({ error: "User already exists" })
      }

      // Determine role based on doctorCode
      let finalRole = 0

      if (Number(role) === 1) {

        if (doctorCode !== "DOCTOR2026") {
        return res.status(400).json({
         error: "Invalid doctor code"
       })
   }

  finalRole = 1
}

      const hashedPassword = await bcrypt.hash(password, 10)

      // Add user to database
      const result = await db.AddUser(
        first_name,
        last_name,
        email,
        hashedPassword,
        finalRole
      );

      res.status(201).json({
        message: "User registered successfully",
        user_id: result.insertId,
        role: finalRole,
      });
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Server error" })
        next()
    }
})

module.exports = register