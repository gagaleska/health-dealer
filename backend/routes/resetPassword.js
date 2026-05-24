const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const reset = express.Router()
const db = require("../db/dbConn")
const sendEmail = require("../utils/sendEmail")

const JWT_SECRET = process.env.JWT_SECRET

reset.use(express.json())
console.log("RESET PASSWORD ROUTE LOADED")

// Request email for password reset
reset.post("/request", async (req, res) => {

  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({
        error: "Email required"
      })
    }

    const users = await db.GetUser(email)
    if (users.length === 0) {
      return res.status(404).json({
        error: "User not found"
      })
    }

    const user = users[0]

    // create reset token
    const token = jwt.sign(
      {
        id: user.id
      },
      JWT_SECRET,
      {
        expiresIn: "15m"
      }
    )

    const resetLink =
      `http://localhost:5173/reset-password/${token}`

    await sendEmail(
      user.email,
      "Reset Password",
      `Click here to reset password:\n\n${resetLink}`
    )

    res.json({
      message: "Reset email sent"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      error: "Server error"
    })
  }
})

// Reset password using token
reset.post("/:token", async (req, res) => {

  try {

    const { token } = req.params
    const { password } = req.body

    if (!password) {
      return res.status(400).json({
        error: "Password required"
      })
    }

    // verify token
    const decoded = jwt.verify(
      token,
      JWT_SECRET
    )

    const hashedPassword =
      await bcrypt.hash(password, 10)

    await db.UpdatePassword(
      decoded.id,
      hashedPassword
    )

    res.json({
      message: "Password updated"
    })

  } catch (err) {

    console.log(err)

    res.status(400).json({
      error: "Invalid or expired token"
    })
  }
})

module.exports = reset

