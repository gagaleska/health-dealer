const cron = require("node-cron")
const db = require("../db/dbConn")
const sendEmail = require("../utils/sendEmail")

cron.schedule("0 * * * *", async () => {

  try {
    console.log("Checking emergency alerts...")
    const users =
      await db.GetMissedMedications()
    for (const user of users) {
      let message = `Hello ${user.contact_name}, ${user.first_name} may have missed multiple medications today.
      Please check on them.`

      await sendEmail(
        user.contact_email,
        "Emergency Medication Alert",
        message
      )
      console.log(`Emergency email sent to ${user.contact_email}`)
    }
  } catch (err) {
    console.error(
      "Emergency cron error:",
      err
    )
  }
})