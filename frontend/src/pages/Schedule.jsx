import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"


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
    <div>
      <h2>Create Medication Schedule</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="medication_name"
          placeholder="Medication name"
          value={form.medication_name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={form.dosage}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="with_food"
            checked={form.with_food}
            onChange={handleChange}
          />
          Take with food
        </label>

        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
        />

        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
        />

        <h4>Schedule Times</h4>
        {scheduleTimes.map((time, index) => (
          <input
            key={index}
            type="time"
            value={time}
            onChange={(e) => updateTime(e.target.value, index)}
          />
        ))}

        <button type="button" onClick={addTimeField}>
          Add another time
        </button>

        <button type="submit">Create Schedule</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
