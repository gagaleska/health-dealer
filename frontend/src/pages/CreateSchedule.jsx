import { useState } from "react"
import { useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton";
import api from "../api/axios"
import "../styles/CreateScheduleView.css"


export default function CreateSchedule() {
  const [form, setForm] = useState({
    medication_name: "",
    dosage: "",
    with_food: false,
    start_date: "",
    end_date: "",
  })

  const [scheduleTimes, setScheduleTimes] = useState([""])
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const addTimeField = () => {
    setScheduleTimes([...scheduleTimes, ""]);
  };

  const updateTime = (value, index) => {
    const updated = [...scheduleTimes];
    updated[index] = value;
    setScheduleTimes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user-medications/schedules", {
        medication_name: form.medication_name,
        dosage: form.dosage,
        with_food: form.with_food ? 1 : 0,
        start_date: form.start_date,
        end_date: form.end_date || null,
        schedule_times: scheduleTimes,
      });

      navigate("/dashboard");
      setMessage("Schedule created successfully!");
    } catch (err) {
      setMessage("Error creating schedule");
    }
  };

 return (
  <div className="create-schedule-wrapper">

    <LogoutButton />

    <div className="create-schedule-card">

      <h2 className="create-schedule-title">
        Create Medication Schedule
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          className="create-input"
          type="text"
          name="medication_name"
          placeholder="Medication Name"
          value={form.medication_name}
          onChange={handleChange}
        />

        <input
          className="create-input"
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={form.dosage}
          onChange={handleChange}
        />

        <label className="create-checkbox">
          <input
            type="checkbox"
            name="with_food"
            checked={form.with_food}
            onChange={handleChange}
          />
          Take with food
        </label>

        <label className="create-label">
          Start Date
        </label>

        <input
          className="create-input"
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
        />

        <label className="create-label">
          End Date
        </label>

        <input
          className="create-input"
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
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
            onChange={(e) => updateTime(e.target.value, index)}
          />
        ))}

        <button
          type="button"
          className="add-time-btn"
          onClick={addTimeField}
        >
          + Add Schedule Time
        </button>

        <button
          type="submit"
          className="create-submit-btn"
        >
          Create Schedule
        </button>

      </form>

      {message && (
        <p className="create-message">
          {message}
        </p>
      )}

    </div>
  </div>
)
}
