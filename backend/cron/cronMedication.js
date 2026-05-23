import cron from "node-cron"
import db from ("../db/dbConn")

cron.schedule("0 0 * * *", async () => {
  try {
    // Reset taken only if medication is still active
    await db.query(`
      UPDATE UserMedication
      SET taken = 0
      WHERE taken = 1
        AND taken_date < CURDATE()
        AND end_date >= CURDATE();
    `)

    // Delete expired medications
    await db.query(`
      DELETE FROM UserMedication
      WHERE end_date < CURDATE();
    `)


    console.log("Midnight reset completed")
  } catch (err) {
    console.error("Cron job error:", err)
  }
})
