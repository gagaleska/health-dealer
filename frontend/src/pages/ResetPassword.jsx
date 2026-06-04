import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../api/axios"
import "../styles/ResetPassView.css"

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      await api.post(
        `/reset-password/${token}`,
        { password }
      )
      alert("Password updated!")
      navigate("/login")

    } catch (err) {
      console.error(err)
      alert("Invalid or expired token")
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">
          Reset Password
        </h2>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <input
            type="password"
            placeholder="New password"
            className="auth-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="Confirm password"
            className="auth-input"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />
          <button
            type="submit"
            className="auth-button"
          >
            Reset Password
          </button>
        </form>

      </div>
    </div>
  )
}