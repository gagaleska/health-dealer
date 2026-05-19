import { useEffect, useState } from "react"
import api from "../api/axios"
import "../styles/MyScheduleView.css"

export default function MySchedules() {
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    fetchSchedules()
  }, [])

  // GET schedules
  const fetchSchedules = async () => {
    try {
      const res = await api.get("/user-medications")
      console.log("Schedules from backend:", res.data)
      setSchedules(res.data)
    } catch (err) {
      console.error("Error fetching schedules:", err)
    }
  }

  // MARK AS TAKEN
  const markTaken = async (scheduleId) => {
    try {
      await api.post(`/user-medications/${scheduleId}/taken`)
      fetchSchedules()
    } catch (err) {
      console.error("Error marking taken:", err)
    }
  }

  console.log("Schedules:", schedules)

  // GROUP BY MEDICATION
  const grouped = schedules.reduce((acc, item) => {
    const medId = item.medication_id || item.med_id || item.id

    if (!acc[medId]) {
      acc[medId] = {
        medication_name: item.medication_name,
        dosage: item.dosage,
        with_food: item.with_food,
        times: []
      }
    }

    acc[medId].times.push({
      schedule_id: item.schedule_id || item.id,
      time: item.schedule_time,
      taken: item.taken
    })

    return acc
  }, {})

  // FALLBACK UI
  if (schedules.length === 0) {
    return (
      <div className="schedule-wrapper">
        <h2 className="schedule-title">Your Medication Schedule</h2>
        <p className="no-schedules">No schedules for today.</p>
      </div>
    )
  }

  return (
    <div className="schedule-wrapper">

      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>
      <div className="bg-circle bg-circle-3"></div>

      <h2 className="schedule-title">Your Medication Schedule</h2>

      <div className="schedule-list">
        {Object.values(grouped).map((med) => (
          <div className="med-card" key={med.medication_name}>
            <h3 className="med-name">{med.medication_name}</h3>
            <p className="med-dosage">{med.dosage}</p>
            {med.with_food && <p className="med-food">Take with food</p>}

            <div className="time-list">
              {med.times.map((t) => (
                <div className="time-row" key={t.schedule_id}>
                  <span className="time-label">{t.time}</span>

                  <button
                    className={`taken-btn ${t.taken ? "taken" : ""}`}
                    onClick={() => markTaken(t.schedule_id)}
                  >
                    {t.taken ? "Taken ✔" : "Take"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
