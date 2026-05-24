import { useState } from "react"
import api from "../api/axios"
import "../styles/ResetPassView.css"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const handleSubmit = async (e) => {

    e.preventDefault()
    try {
      await api.post(
        "/reset-password/request",
        { email }
      )
      alert("Reset email sent!")
    } catch (err) {
      console.error(err)
      alert("Could not send reset email")
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">
          Forgot Password
        </h2>

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="auth-input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
          <button
            type="submit"
            className="auth-button"
          >
            Send Reset Link
          </button>
        </form>

      </div>
    </div>
  )
}