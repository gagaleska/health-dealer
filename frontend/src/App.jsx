import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateSchedule from "./pages/CreateSchedule"
import MySchedules from "./pages/MySchedules"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

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


      </Routes>
    </BrowserRouter>
  );
}

export default App;
