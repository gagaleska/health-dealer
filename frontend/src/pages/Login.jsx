import { useState } from "react";
import "../styles/LoginView.css";

export default function Login() {
  const [role, setRole] = useState("doctor");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${role} login:`, form);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="login-select"
        >
          <option value="doctor">Doctor</option>
          <option value="patient">Patient</option>
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
          <a href="/reset" className="login-link">
            Reset
          </a>
        </p>
      </div>
    </div>
  );
}
