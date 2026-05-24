const express = require("express")
require("dotenv").config()
const db = require("./db/dbConn.js")
const cors = require("cors")
const register = require("./routes/register")
const login = require("./routes/login")
const userMedications = require("./routes/userMedications")
const resetPassword = require("./routes/resetPassword")
const emergencyContact = require("./routes/emergencyContact")
require("./cron/cronReminder")
require("./cron/cronMedication")
require("./cron/cronEmergency")


const app = express() // instance of express
const port = process.env.PORT || 2907

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())
app.use("/register", register)
app.use("/login", login)
app.use("/reset-password", resetPassword)
app.use("/user-medications", userMedications)
app.use("/emergency-contact", emergencyContact)

app.get("/", (req, res) => {
  res.send("this text must be changed to a static file")
});

///App listening on port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

