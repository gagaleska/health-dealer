import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import "../styles/RegisterView.css"

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    doctor_code: ""
  })
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
      }

      if (form.doctor_code.trim()) {
        payload.doctor_code = form.doctor_code.trim()
      }

      await api.post("/register", payload)

      navigate("/")
    } catch (err) {
      console.error("Register error:", err)
      const errors = err.response?.data?.errors;
      const validationMessage = errors
        ? Object.values(errors).flat().join(" ")
        : ""

      setMessage(
        validationMessage ||
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Registration failed. Please check your details and try again."
      );
    }
  };

  return (
    <div className="register-wrapper">
      
      {/* Background circles */}
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>
      <div className="bg-circle bg-circle-3"></div>

      <div className="register-card">
        <h2 className="register-title">Create Account</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="doctor_code"
            placeholder="Doctor Code (optional)"
            value={form.doctor_code}
            onChange={handleChange}
            className="register-input"
          />

          <button type="submit" className="register-button">
            Register
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}
      </div>
    </div>
  );
}
