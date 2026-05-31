const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const login = express.Router()
const db = require("../db/dbConn")

login.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET

login.post("/", async (req, res, next) => {
  try {
    const { email, password, role } = req.body

    // Validate input
    if (!email || !password || role === undefined)
      return res.status(400).json({ error: "Missing email, password or role" })

    // Find user by email
    const users = await db.GetUser(email)
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid email" })

    const user = users[0] //mySQL returns an array of results, we want the first one (the only one) since email is unique

    // Compare passwords
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: "Invalid password" })


    console.log("DATABASE ROLE:", user.role)
    console.log("FRONTEND ROLE:", role)
    console.log("NUMBER ROLE:", Number(role))


    // Role check
    if(user.role !== Number(role)) 
      return res.status(403).json({
        error:
          Number(role)===1
            ? "This account is not registered as a doctor"
            : "This account is not registered as a patient"
      })

    // Create JWT token 
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    })

    // Respond after successful login
    return res.json({
      message: "Login successful",
      token,
      role: user.role,
    })
  } 
  catch (err) {
    console.log(err)
    res.status(500).json({ error: "Server error" })
    next()
  }
})

module.exports = login
