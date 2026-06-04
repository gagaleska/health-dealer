import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/axios"

import "../styles/PrescriptionForm.css"

export default function PrescriptionForm() {

  const { id } = useParams()

  const navigate = useNavigate()

  const [form, setForm] = useState({
    medication_name: "",
    dosage: "",
    start_date: "",
    end_date: "",
    with_food: false,
    schedule_times: ""
  })

  const submitPrescription = async (e) => {

    e.preventDefault()

    try {

      await api.post(
        `/doctor/patients/${id}/prescribe`,
        {
          medication_name:
            form.medication_name,

          dosage:
            form.dosage,

          start_date:
            form.start_date,

          end_date:
            form.end_date,

          with_food:
            form.with_food,

          schedule_times:
            form.schedule_times
              .split(",")
              .map(t => t.trim())
        }
      )

      alert("Medication prescribed.")

      navigate(
        `/doctor/patients/${id}`
      )

    } catch (err) {

      console.error(err)

      alert(
        err.response?.data?.error ||
        "Failed to prescribe medication"
      )
    }
  }

  return (
    <div className="prescription-wrapper">

      <form
        className="prescription-card"
        onSubmit={submitPrescription}
      >

        <h2>
          Prescribe Medication
        </h2>

        <input
          placeholder="Medication Name"
          value={form.medication_name}
          onChange={(e) =>
            setForm({
              ...form,
              medication_name:
                e.target.value
            })
          }
        />

        <input
          placeholder="Dosage"
          value={form.dosage}
          onChange={(e) =>
            setForm({
              ...form,
              dosage:
                e.target.value
            })
          }
        />

        <input
          type="date"
          value={form.start_date}
          onChange={(e) =>
            setForm({
              ...form,
              start_date:
                e.target.value
            })
          }
        />

        <input
          type="date"
          value={form.end_date}
          onChange={(e) =>
            setForm({
              ...form,
              end_date:
                e.target.value
            })
          }
        />

        <input
          placeholder="08:00, 20:00"
          value={form.schedule_times}
          onChange={(e) =>
            setForm({
              ...form,
              schedule_times:
                e.target.value
            })
          }
        />

        <label className="food-checkbox">

          <input
            type="checkbox"
            checked={form.with_food}
            onChange={(e) =>
              setForm({
                ...form,
                with_food:
                  e.target.checked
              })
            }
          />

          Take with food

        </label>

        <button type="submit">
          Save Prescription
        </button>

      </form>

    </div>
  )
}