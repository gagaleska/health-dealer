const express = require("express")
require("dotenv").config()
const db = require("./db/dbConn.js")
const cors = require("cors")
const register = require("./routes/register")
const login = require("./routes/login")
const userMedications = require("./routes/userMedications")


const app = express() // instance of express
const port = process.env.PORT || 2907

app.use(cors())
app.use(express.json())
app.use("/register", register)
app.use("/login", login)
app.use("/user-medications", userMedications)

app.get("/", (req, res) => {
  res.send("this text must be changed to a static file")
});

///App listening on port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
});

