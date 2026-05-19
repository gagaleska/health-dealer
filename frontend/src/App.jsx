import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CreateSchedule from "./pages/CreateSchedule"
import MySchedules from "./pages/MySchedules"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-schedule" element={<CreateSchedule />} />
        <Route path="/my-schedules" element={<MySchedules />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
