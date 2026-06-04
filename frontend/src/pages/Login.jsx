import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import "../styles/LoginView.css"
import { Link } from "react-router-dom"

export default function Login() {
  const [role, setRole] = useState("0")
  const [form, setForm] = useState({ email: "", password: "" })
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
        role: role,
      })

      // Save token
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)

      // Redirect to dashboard
      navigate("/dashboard")

    } catch (err) {
      console.error("Login error:", err)
      alert("Invalid credentials")
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="login-select"
        >
          <option value="1">Doctor</option>
          <option value="0">Patient</option>
        </select>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="login-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="login-input"
          />

          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <p style={{ marginTop: "12px", color: "var(--text-light)" }}>
          Forgot password?{" "}
          <Link to="/reset" className="login-link">
            Reset
          </Link>
        </p>
      </div>
    </div>
  )
}
