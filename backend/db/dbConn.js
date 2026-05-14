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
    console.log("ERROR: " + err.message);
    return;
  }
  console.log("Connection established");
})

let dataPool = {}

// Register user
dataPool.AddUser = (first_name, last_name, email, hashedPassword, role) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'INSERT INTO User (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
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
    conn.query("SELECT * FROM User WHERE email = ?", [email], (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

// Add a medication schedule for a user
dataPool.AddUserMedication = (user_id, medication_id, dosage, schedule_time, with_food, frequency) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'INSERT INTO UserMedication (user_id, medication_id, dosage, schedule_time, with_food, frequency) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, medication_id, dosage, schedule_time, with_food, frequency],
      (err, res) => {
        if (err) return reject(err);
        resolve(res)
      }
    )
  })
}

// Get all medication schedules for a user
dataPool.GetUserMedication = (user_id) => {
  return new Promise((reolve, reject) => {
    conn.query(
      'SELECT um.*, m.name AS medication_name FROM UserMedication um JOIN Medication m ON um.medication_id = m.id WHERE um.user_id = ?',
      [user_id],
      (err, res) => {
        if (err) return reject(err)
        resolve(res)
      }
    )
  })
}

// Update a medication schedule for a user
dataPool.UpdateUserMedication = (id, dosage, schedule_time, with_food, frequency) => {
  return new Promise((resolve, reject) => {
     conn.query(
      'UPDATE UserMedication SET dosage = ?, schedule_time = ?, with_food = ?, frequency = ? WHERE id = ?',
      [dosage, schedule_time, with_food, frequency, id],
      (err, res) => {
        if(err) return reject(err)
          resolve(res)
      }
    )
  })
}

// Delete a medication schedule for a user
dataPool.DeleteUserMedication = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'DELETE FROM UserMedication WHERE id = ?',
      [id],
      (err, res) => {
        if(err) return reject(err)
          resolve(res)
      }
    )
  }) 
}

module.exports = dataPool
