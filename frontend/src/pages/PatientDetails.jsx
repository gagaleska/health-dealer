import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"

import "../styles/PatientDetails.css"

export default function PatientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [schedules, setSchedules] = useState([])

  useEffect(() => {
    fetchSchedules()
  }, [])
  const fetchSchedules = async () => {
    try {
      const res = await api.get(
        `/doctor/patients/${id}/schedules`
      )
      setSchedules(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="patient-details-wrapper">

      <h2 className="details-title">
        Patient Schedule
      </h2>

      <div className="details-actions">

      <button
        className="prescribe-top-btn"
        onClick={() =>
          navigate(
            `/doctor/patients/${id}/prescribe`
          )
        }
      >
        + Prescribe Medication
      </button>

      <button
        className="back-btn"
        onClick={() => navigate("/doctor")}
      >
        ← Back to Doctor Dashboard
      </button>

      </div>

      <div className="schedule-list">

        {schedules.length === 0 ? (

          <p className="empty-state">
            No medications assigned.
          </p>

        ) : (

          schedules.map((schedule) => (

            <div
              key={schedule.id}
              className="med-card"
            >

              <h3 className="med-name">
                {schedule.medication_name}
              </h3>

              <p className="med-dosage">
                {schedule.dosage}
              </p>

              {schedule.with_food === 1 && (
                <p className="med-food">
                  Take with food
                </p>
              )}

              <div className="schedule-info">

                <p>
                  <strong>Start:</strong>
                  {" "}
                  {schedule.start_date}
                </p>

                <p>
                  <strong>End:</strong>
                  {" "}
                  {schedule.end_date || "Ongoing"}
                </p>

                <p>
                  <strong>Times:</strong>
                  {" "}
                  {schedule.schedule_times}
                </p>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}