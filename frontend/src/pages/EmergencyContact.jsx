import { useEffect, useState } from "react"
import api from "../api/axios"
import "../styles/EmergencyContactView.css"

export default function EmergencyContact() {
  const [form, setForm] = useState({
    contact_name: "",
    contact_email: "",
  })

  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      const res = await api.get("/emergency-contact")

      if (res.data) {
        setForm({
          contact_name: res.data.contact_name || "",
          contact_email: res.data.contact_email || "",
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post(
        "/emergency-contact",
        form
      )

      setMessage(res.data.message)
    } catch (err) {
      setMessage(
        err.response?.data?.error ||
        "Something went wrong"
      )
    }
  }

  return (
    <div className="emergency-wrapper">
      <div className="emergency-card">

        <h2 className="emergency-title">
          Emergency Contact
        </h2>

        <p className="emergency-subtitle">
          Add a trusted contact who will be notified
          if several medications are missed.
        </p>

        <form
          onSubmit={handleSubmit}
          className="emergency-form"
        >
          <input
            className="emergency-input"
            type="text"
            name="contact_name"
            placeholder="Contact Name"
            value={form.contact_name}
            onChange={handleChange}
            required
          />

          <input
            className="emergency-input"
            type="email"
            name="contact_email"
            placeholder="Contact Email"
            value={form.contact_email}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="emergency-button"
          >
            Save Contact
          </button>
        </form>

        {message && (
          <p className="emergency-message">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}