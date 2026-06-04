import { useNavigate } from "react-router-dom"
import "./LogoutButton.css"
import { FiLogOut } from "react-icons/fi"

export default function LogoutButton() {

  const navigate = useNavigate()

  const handleLogout = () => {

    localStorage.removeItem("token")
    localStorage.removeItem("role")

    navigate("/")
  }

   return (
    <button
      className="logout-btn"
      onClick={handleLogout}
    >
      <FiLogOut className="logout-icon" />
      Logout
    </button>
  )
}