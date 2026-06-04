import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateSchedule from "./pages/CreateSchedule"
import MySchedules from "./pages/MySchedules"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import DoctorDashboard from "./pages/DoctorDashboard"
import PatientDetails from "./pages/PatientDetails"
import PrescriptionForm from "./pages/PrescriptionForm"
import EmergencyContact from "./pages/EmergencyContact"
import EditMedication from "./pages/EditMedication"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset"element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-schedule" element={<CreateSchedule />} />
        <Route path="/my-schedules" element={<MySchedules />} />

        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/patients/:id" element={<PatientDetails />} />
        <Route path="/doctor/patients/:id/prescribe" element={<PrescriptionForm />} />

        <Route path="/emergency-contact" element={<EmergencyContact />}/>

        <Route path="/edit-medication/:id" element={<EditMedication />}
/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
