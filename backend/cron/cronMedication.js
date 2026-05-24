const cron = require("node-cron")
const db = require("../db/dbConn")

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running midnight reset")
  
    // Reset taken only if medication is still active
    await db.query(`
      UPDATE ScheduleTime st
      JOIN UserMedication um ON st.user_medication_id = um.id
      SET st.taken = 0,
      st.taken_date = NULL
      WHERE st.taken = 1
        AND um.start_date <= CURDATE()
        AND (um.end_date IS NULL
            OR um.end_date >= CURDATE() )`)

    // Delete expired medications
    await db.query(`
      DELETE FROM UserMedication
      WHERE end_date IS NOT NULL
            AND um.end_date < CURDATE()`)


    console.log("Midnight reset completed")
  } catch (err) {
    console.error("Cron job error:", err)
  }
})


