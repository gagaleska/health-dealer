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
    conn.query("SELECT * FROM User WHERE email = ?", [email], 
      (err, res) => {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

// Add a medication to the database
dataPool.AddMedication = (name) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'INSERT INTO Medication (name) VALUES (?)',
      [name],
      (err, res) => {
        if (err) return reject(err)
        resolve(res)
      }
    )
  })
}

// Add a medication schedule for a user
dataPool.AddUserSchedule = async (user_id, medication_name, dosage, with_food, start_date, end_date, schedule_times) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Step 1: Check if the medication exists
      let [medication] = await conn.promise().query(
        'SELECT id FROM Medication WHERE name = ?',
        [medication_name]
      );

      let medication_id
      if (medication.length === 0) {
        // Medication doesn't exist, insert it
        const [result] = await conn.promise().query(
          'INSERT INTO Medication (name) VALUES (?)',
          [medication_name]
        );
        medication_id = result.insertId
      } else {
        medication_id = medication[0].id
      }

      // Step 2: Check if the schedule already exists
      const [existingSchedule] = await conn.promise().query(
        'SELECT id FROM UserMedication WHERE user_id = ? AND medication_id = ?',
      [user_id, medication_id]
    )

      if (existingSchedule.length > 0) {
        return reject(new Error("A schedule for this medication already exists for the given user and date range."))
      }

      // Step 3: Insert into UserMedication
      const [userMedicationResult] = await conn.promise().query(
        'INSERT INTO UserMedication (user_id, medication_id, dosage, with_food, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, medication_id, dosage, with_food, start_date, end_date || null]
      )

      const user_medication_id = userMedicationResult.insertId

      // Step 4: Insert schedule times into ScheduleTime
      if (schedule_times.length > 0) {
        const scheduleTimeValues = schedule_times.map((time) => [user_medication_id, time])
        await conn.promise().query(
          'INSERT INTO ScheduleTime (user_medication_id, schedule_time) VALUES ?',
        [scheduleTimeValues]
      )
  }

      resolve({ message: "Medication schedule added successfully", id: user_medication_id })
    } catch (err) {
      reject(err)
    }
  })
}

// Get all medication schedules for a user
// Get all medication schedules for a user
dataPool.GetUserMedication = (user_id, today) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT 
        um.id AS user_medication_id,
        st.id AS schedule_time_id,
        um.medication_id,
        um.dosage,
        um.with_food,
        um.start_date,
        um.end_date,
        st.taken,
        st.taken_date,
        m.name AS medication_name,
        st.schedule_time
       FROM UserMedication um
       JOIN Medication m 
          ON um.medication_id = m.id
       JOIN ScheduleTime st 
          ON um.id = st.user_medication_id
       WHERE um.user_id = ?
       AND (
          (? >= um.start_date AND ? <= um.end_date)
          OR
          (um.end_date IS NULL AND ? >= um.start_date)
       )
       ORDER BY m.name, st.schedule_time`,
      [user_id, today, today, today],
      (err, res) => {
        if (err) return reject(err)
        resolve(res)
      }
    )
  })
}

// Update a medication schedule for a user
dataPool.UpdateUserMedication = (id, dosage, with_food, start_date, end_date, schedule_times) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Update the main schedule info
      await conn.promise().query(
        `UPDATE UserMedication 
         SET dosage = ?, with_food = ?, start_date = ?, end_date = ?
         WHERE id = ?`,
        [dosage, with_food, start_date, end_date, id]
      )

      // Delete old schedule times
      await conn.promise().query(
        `DELETE FROM ScheduleTime WHERE user_medication_id = ?`,
        [id]
      )

      // Insert new schedule times
      if (schedule_times && schedule_times.length > 0) {
        const values = schedule_times.map(time => [id, time])
        await conn.promise().query(
          `INSERT INTO ScheduleTime (user_medication_id, schedule_time) VALUES ?`,
          [values]
        )
      }
      resolve({ message: "Medication schedule updated successfully" })
    } catch (err) {
      reject(err)
    }
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

// Set a medication schedule as taken
dataPool.MarkScheduleTaken = (scheduleTimeId, userId) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `UPDATE ScheduleTime st
       JOIN UserMedication um
          ON st.user_medication_id = um.id
       SET st.taken = 1,
           st.taken_date = CURDATE()
       WHERE st.id = ?
       AND um.user_id = ?`,
      [scheduleTimeId, userId],
      (err, res) => {
        if (err) return reject(err)
        resolve(res)
      }
    )
  })
}

dataPool.GetUpcomingReminders = (targetTime) => {
  return new Promise((resolve, reject) => {
    conn.query(
      `SELECT
        u.email,
        u.first_name,
        m.name AS medication_name,
        um.dosage,
        um.with_food,
        st.schedule_time
      FROM ScheduleTime st
      JOIN UserMedication um
        ON st.user_medication_id = um.id
      JOIN Medication m
        ON um.medication_id = m.id
      JOIN User u
        ON um.user_id = u.id
      WHERE TIME_FORMAT(st.schedule_time, '%H:%i') = ?
      AND (
        um.end_date IS NULL
        OR um.end_date >= CURDATE()
      )`,
      [targetTime],
      (err, res) => {
        if (err) return reject(err)

        resolve(res)
      }
    )
  })
}


module.exports = dataPool
