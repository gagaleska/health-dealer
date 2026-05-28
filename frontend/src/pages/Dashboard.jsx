import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-wrapper">

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Medication Dashboard
          </h1>

          <p className="dashboard-subtitle">
            Manage your medications and stay healthy.
          </p>
        </div>
      </div>

      <div className="dashboard-grid">

        <div
          className="dashboard-card"
          onClick={() => navigate("/create-schedule")}
        >
          <div className="dashboard-card-icon">
            💊
          </div>

          <div className="dashboard-card-title">
            Create Schedule
          </div>

          <div className="dashboard-card-text">
            Add medications and create daily schedules.
          </div>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/my-schedules")}
        >
          <div className="dashboard-card-icon">
            📅
          </div>

          <div className="dashboard-card-title">
            My Schedules
          </div>

          <div className="dashboard-card-text">
            View and manage your medication schedules.
          </div>
        </div>

      </div>

    </div>
  );
}