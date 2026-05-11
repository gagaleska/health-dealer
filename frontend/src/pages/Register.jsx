import { useState } from "react";
import "../styles/RegisterView.css";

export default function Register() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    doctor_code: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", form);
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
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="last_name"
            placeholder="Last Name"
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="register-input"
          />
          <input
            name="doctor_code"
            placeholder="Doctor Code (optional)"
            onChange={handleChange}
            className="register-input"
          />

          <button type="submit" className="register-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
