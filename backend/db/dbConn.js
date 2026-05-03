const mysql = require("mysql2")

// using a method to connect to the database, using environment variables for security
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "SISIII2026_89221235",
})

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message)
    return;
  }
  console.log("Connection established")
});

let dataPool = {}

// Register user
dataPool.AddUser = (first_name, last_name, email, hashedPassword, role) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO User (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [first_name, last_name, email, hashedPassword, role], // using conn object to execute the query, passing the parameters as an array to prevent SQL injection and using a callback function to handle the result
        (err, res) => {
          if (err) return reject(err)
          return resolve(res)
        }
    )
  })
}   

// Get user by email for the login
dataPool.GetUser = (email) => {
  return new Promise((resolve, reject) => {
    conn.query(
      "SELECT * FROM User WHERE email = ?",
      [email],
      (err, res) => {
        if (err) return reject(err)
        return resolve(res)
      }
    )
  })
}


module.exports = dataPool
