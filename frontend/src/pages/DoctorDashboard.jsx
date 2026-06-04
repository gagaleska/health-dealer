import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import LogoutButton from "../components/LogoutButton";
import api from "../api/axios"
import "../styles/DoctorDashboard.css"

export default function DoctorDashboard() {
  const navigate = useNavigate()

  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const res = await api.get("/doctor/patients")
      console.log("Patients:", res.data)
      setPatients(res.data)
    } catch (err) {
      console.error("Error fetching patients:", err)
    }
  }

  const filteredPatients = patients.filter((patient) =>
    `${patient.first_name} ${patient.last_name} ${patient.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="doctor-wrapper">

      <h2 className="doctor-title">
        Doctor Dashboard
      </h2>

      <div className="doctor-stats">

        <div className="stat-card">
          <h3>{patients.length}</h3>
          <span>Total Patients</span>
        </div>

        <div className="stat-card">
          <h3>{new Date().toLocaleDateString()}</h3>
          <span>Today's Date</span>
        </div>

      </div>

      <input
        type="text"
        className="doctor-search"
        placeholder="Search patients by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPatients.length === 0 ? (
        <p className="no-patients">
          No patients found.
        </p>
      ) : (
        <div className="patient-list">

          {filteredPatients.map((patient) => (

            <div
              className="patient-card"
              key={patient.id}
            >

              <div className="patient-avatar">
                {patient.first_name[0]}
                {patient.last_name[0]}
              </div>

              <h3 className="patient-name">
                {patient.first_name} {patient.last_name}
              </h3>

              <p className="patient-email">
                {patient.email}
              </p>

              <button
                className="view-btn"
                onClick={() =>
                  navigate(`/doctor/patients/${patient.id}`)
                }
              >
                View Schedule
              </button>
            </div>
          ))}

        </div>
      )}

      <div className="doctor-actions">
  <button
  className="back-btn"
  onClick={() => navigate("/dashboard")}
>
  ← Dashboard
</button>
</div>

    </div>
  )
}