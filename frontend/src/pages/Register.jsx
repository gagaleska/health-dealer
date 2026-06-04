import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import "../styles/RegisterView.css"

export default function Register() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "0",
    doctorCode: ""
  })

  const [message, setMessage] = useState("")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        role: Number(form.role)
      }

      if (form.role === "1") {
        payload.doctorCode = form.doctorCode
      }

      await api.post("/register", payload)

      alert("Registration successful!")

      navigate("/login")

    } catch (err) {

      console.error(err)

      setMessage(
        err.response?.data?.error ||
        "Registration failed"
      )
    }
  }

  return (
    <div className="register-wrapper">

      <div className="register-card">

        <h2 className="register-title">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="register-form"
        >

          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="register-input"
            required
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="register-input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="register-input"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="register-input"
            required
          />

          {/* ROLE SELECT */}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="register-input"
          >
            <option value="0">
              Patient
            </option>

            <option value="1">
              Doctor
            </option>
          </select>

          {/* DOCTOR CODE */}

          {form.role === "1" && (
            <input
              type="text"
              name="doctorCode"
              placeholder="Doctor Code"
              value={form.doctorCode}
              onChange={handleChange}
              className="register-input"
              required
            />
          )}

          <button
            type="submit"
            className="register-button"
          >
            Register
          </button>

        </form>

        {message && (
          <p className="register-message">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}