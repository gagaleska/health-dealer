const cron = require("node-cron")
const db = require("../db/dbConn")
const sendEmail = require("../utils/sendEmail")

cron.schedule("* * * * *", async () => {
  try {

    console.log("Checking reminders...")

    const now = new Date()

    // current time + 1 minute (for testing)
    const target = new Date(now.getTime() + 1 * 60000)

    const targetTime = target.toTimeString().slice(0,5)

    console.log("Target reminder time:", targetTime)

    const reminders = await db.GetUpcomingReminders(targetTime)

    if (reminders.length === 0) {
      console.log("No reminders found")
      return
    }

    // GROUP BY USER EMAIL
    const grouped = reminders.reduce((acc, item) => {

      if (!acc[item.email]) {
        acc[item.email] = {
          first_name: item.first_name,
          medications: []
        }
      }

      acc[item.email].medications.push(item)

      return acc

    }, {})

    // SEND EMAILS
    for (const email in grouped) {

      const user = grouped[email]

      let message = `Hello ${user.first_name},\n\n`
      message += `Upcoming medications:\n\n`

      user.medications.forEach((med) => {

        message += `• ${med.medication_name}`
        message += ` — ${med.dosage}`
        message += ` — ${med.schedule_time}`

        if (med.with_food) {
          message += ` — Take with food`
        }

        message += `\n`
      })

      message += `\nStay healthy!`

      await sendEmail(
        email,
        "Medication Reminder",
        message
      )
    }

  } catch (err) {
    console.error("Reminder cron error:", err)
  }
})