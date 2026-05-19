import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"

export default function MySchedules() {
    const [schedules, setSchedules] = useState([])
    const navigate = useNavigate()

    const loadSchedules = () => {
        api.get("/user-medications")
        .then((res) => setSchedules(res.data))
        .catch(() => setSchedules([]))
    }

    useEffect(() => {
        loadSchedules()
    }, [])

    const handleDelet = async (id) => {
        if(!window.confirm("Are you sure you want to delete this schedule?")) 
            return
        try {
            await api.delete("/user-medications/${id}")
            loadSchedules() // refresh list after deletion
        }
        catch (err) {
            console.error("Delete error:", err)
            alert("Error deleting schedule")
        }
    }

    const handleEdit = (id) => {
        navigate("/edit-schedule/${id}")
    }
return (
    <div style={styles.container}>
      <h2 style={styles.title}>My Medication Schedules</h2>

      {schedules.length === 0 && (
        <p style={styles.empty}>No schedules found</p>
      )}

      {schedules.map((s) => (
        <div key={s.id} style={styles.card}>
          <h3 style={styles.medName}>{s.medication_name}</h3>

          <p><strong>Dosage:</strong> {s.dosage}</p>
          <p><strong>With food:</strong> {s.with_food ? "Yes" : "No"}</p>
          <p><strong>Start:</strong> {s.start_date}</p>
          <p><strong>End:</strong> {s.end_date || "No end date"}</p>
          <p><strong>Time:</strong> {s.schedule_time}</p>

          <div style={styles.buttonRow}>
            <button style={styles.editBtn} onClick={() => handleEdit(s.id)}>
              Edit
            </button>

            <button style={styles.deleteBtn} onClick={() => handleDelete(s.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  empty: {
    textAlign: "center",
    fontSize: "18px",
    marginTop: "40px",
  },
  card: {
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
  },
  medName: {
    marginBottom: "10px",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  editBtn: {
    backgroundColor: "#4A90E2",
    color: "white",
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#E24A4A",
    color: "white",
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
}