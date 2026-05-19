import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Medication Dashboard</h2>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigate("/create-schedule")}>
          Create Schedule
        </button>

        <button style={styles.button} onClick={() => navigate("/my-schedules")}>
          My Schedules
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
  },
  title: {
    fontSize: "28px",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "300px",
    margin: "0 auto",
  },
  button: {
    padding: "12px 20px",
    fontSize: "18px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4A90E2",
    color: "white",
  },
};
