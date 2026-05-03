const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const login = express.Router()
const db = require("../db/dbConn")

login.use(express.json())

const JWT_SECRET = process.env.JWT_SECRET

login.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password)
      return res.status(400).json({ error: "Missing email or password" })

    // Find user by email
    const users = await db.GetUser(email)
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid email" })

    const user = users[0]

    // Compare passwords
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: "Invalid password" })

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
