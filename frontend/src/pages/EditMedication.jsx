import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import "../styles/CreateScheduleView.css"

export default function EditMedication() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    dosage: "",
    with_food: false,
    start_date: "",
    end_date: ""
  })

  const [scheduleTimes, setScheduleTimes] = useState([])

  useEffect(() => {
    fetchMedication()
  }, [])

  const fetchMedication = async () => {

    const res =
      await api.get(`/user-medications/${id}`)

    const data = res.data

    setForm({
      dosage: data[0].dosage,
      with_food: Boolean(data[0].with_food),
      start_date:
        data[0].start_date?.split("T")[0],
      end_date:
        data[0].end_date?.split("T")[0] || ""
    })

    setScheduleTimes(
      data.map(item => item.schedule_time)
    )
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    await api.put(
      `/user-medications/${id}`,
      {
        ...form,
        with_food:
          form.with_food ? 1 : 0,
        schedule_times:
          scheduleTimes
      }
    )

    navigate("/my-schedules")
  }

  return (
  <div className="create-schedule-wrapper">

    <div className="create-schedule-card">

      <h2 className="create-schedule-title">
        Edit Medication Schedule
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          className="create-input"
          type="text"
          value={form.dosage}
          onChange={(e) =>
            setForm({
              ...form,
              dosage: e.target.value
            })
          }
          placeholder="Dosage"
        />

        <label className="create-label">
          Start Date
        </label>

        <input
          className="create-input"
          type="date"
          value={form.start_date}
          onChange={(e) =>
            setForm({
              ...form,
              start_date: e.target.value
            })
          }
        />

        <label className="create-label">
          End Date
        </label>

        <input
          className="create-input"
          type="date"
          value={form.end_date}
          onChange={(e) =>
            setForm({
              ...form,
              end_date: e.target.value
            })
          }
        />

        <label className="create-label">
          Schedule Times
        </label>

        {scheduleTimes.map((time, index) => (
          <input
            key={index}
            className="create-input"
            type="time"
            value={time}
            onChange={(e) => {

              const updated = [...scheduleTimes]
              updated[index] = e.target.value
              setScheduleTimes(updated)

            }}
          />
        ))}

        <button
          type="button"
          className="add-time-btn"
          onClick={() =>
            setScheduleTimes([
              ...scheduleTimes,
              ""
            ])
          }
        >
          + Add Schedule Time
        </button>

      
      <div className="form-actions">
        <button
          type="button"
          className="back-btn"
          onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <button
        type="submit"
        className="create-submit-btn"
      >
        Save Changes
      </button>

</div>

      </form>

    </div>
  </div>
)
}