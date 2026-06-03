import { useEffect, useState } from "react"
import api from "../api/axios"
import "../styles/MyScheduleView.css"
import { useNavigate } from "react-router-dom"

export default function MySchedules() {
  const [schedules, setSchedules] = useState([])

  const today = new Date().toLocaleDateString("en-CA")
  const navigate = useNavigate()

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
      alert("Medication marked as taken!");
      fetchSchedules()
    } catch (err) {
      console.error("Error marking taken:", err)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
    "Delete this medication schedule?"
  )
  if (!confirmed) return
  try {
    await api.delete(`/user-medications/${id}`)
    fetchSchedules()
  } catch (err) {
  console.error("DELETE ERROR:", err)
  console.error(err.response?.data)

  alert(
    err.response?.data?.error ||
    "Failed to delete medication"
  )
}
}

const handleEdit = (id) => {
  navigate(`/edit-medication/${id}`)
}

  console.log("Schedules:", schedules)

  // GROUP BY MEDICATION
  const grouped = schedules.reduce((acc, item) => {
  const medId = item.user_medication_id
  
  if (!acc[medId]) {
      acc[medId] = {
        user_medication_id: item.user_medication_id,
        medication_name: item.medication_name,
        dosage: item.dosage,
        with_food: item.with_food,
        start_date: item.start_date,
        end_date: item.end_date,
        times: []
      }
    }

    acc[medId].times.push({
      id: item.schedule_time_id,
      time: item.schedule_time,
      taken: item.taken,
      taken_date: item.taken_date
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

      <h2 className="schedule-title">Your Medication Schedule</h2>

      <div className="schedule-list">
        {Object.values(grouped).map((med) => (
          <div className="med-card" key={med.medication_name}>
            <h3 className="med-name">{med.medication_name}</h3>
            <p className="med-dosage">{med.dosage}</p>
            {med.with_food && <p className="med-food">Take with food</p>}

<div className="med-actions">
  <button
    className="action-btn"
    onClick={() => handleEdit(med.user_medication_id)}
  >
    Edit
  </button>

  <button
    className="action-btn delete-btn"
    onClick={() => handleDelete(med.user_medication_id)}
  >
    Delete
  </button>
</div>

            <div className="time-list">
              {med.times.map((t) => {
                const isTakenToday =
                  Number(t.taken) === 1 &&
                  t.taken_date &&
                  new Date(t.taken_date).toLocaleDateString("en-CA") === new Date().toLocaleDateString("en-CA")
                

                console.log("BUTTON DATA:", {
                  taken: t.taken,
                  taken_date: t.taken_date,
                  today
        })
                return (
                  <div className="time-row" key={`${t.id}-${t.time}`}>
                    <span className="time-label">{t.time}</span>

                    <button
                      className={`taken-btn ${isTakenToday ? "taken" : ""}`}
                      onClick={() => markTaken(t.id)}
                      disabled={isTakenToday}>
            
                      {isTakenToday ? "Taken ✔" : "Take"}

                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

    <div className="schedule-footer">
  <button
    className="back-btn"
    onClick={() => navigate("/dashboard")}
  >
    ← Back
  </button>
</div>

    </div>
  )
}