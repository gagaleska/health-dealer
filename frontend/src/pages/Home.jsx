import { useNavigate } from "react-router-dom";
import "../styles/HomeView.css";
import logo from "../assets/logo.png";
import { FiInfo, FiLogIn, FiUserPlus } from "react-icons/fi";


export default function Home() {

    const navigate = useNavigate();

    return (
      <div className="home-wrapper">
        {/* Background circles */}
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>

        {/* nav bar */}
        <nav className="home-navbar">
          <div className="nav-left">Health Dealer</div>

          <div className="nav-right">
            
            <button className="nav-button" onClick={() => navigate("/login")}>
              <FiLogIn className="nav-icon" /> Login
            </button>

            <button className="nav-button" onClick={() => navigate("/register")}>
              <FiUserPlus className="nav-icon" /> Register
            </button>

          </div>
        </nav>

        {/* Main content */}

        <div className="home-content">
          <img src={logo} alt="Health Dealer Logo" className="home-logo" />
          <h1 className="home-title">Keeping Health on Schedule</h1>

          <p className="home-subtitle">
            Your personal assistant for medication, appointments and emergency
            contacts.
          </p>
        </div>
      </div>
    );
}