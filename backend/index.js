const express = require("express")
require("dotenv").config()
const db = require("./db/dbConn.js")
const cors = require("cors")
const path = require("path")

const register = require("./routes/register")
const login = require("./routes/login")
const userMedications = require("./routes/userMedications")
const resetPassword = require("./routes/resetPassword")
const emergencyContact = require("./routes/emergencyContact")
const doctorRoutes = require("./routes/doctor")

require("./cron/cronReminder")
require("./cron/cronMedication")
require("./cron/cronEmergency")


const app = express() // instance of express
const port = process.env.PORT || 2907
const reactBuildPath = path.join(__dirname, "dist", "frontend-build")
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
app.use("/doctor", doctorRoutes)


app.use(express.static(reactBuildPath))

app.get("/*splat", (req, res) => {
  res.sendFile(path.join(reactBuildPath, "index.html"))
})

///App listening on port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

