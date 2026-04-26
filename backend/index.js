const express = require("express");
require("dotenv").config();
const DB = require("./db/dbConn.js");

const cors = require("cors");
const app = express();
const port = 2907; 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hola");
});

///App listening on port
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port: ${process.env.PORT || port}`);
});

