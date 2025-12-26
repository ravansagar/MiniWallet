import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register'
import Login from './Components/Login'
import VerifyOtp from './Components/verifyOtp'
import NavBar from './Components/NavBar'
import WelcomePage from './Components/WelcomePage'
import HomePage from './Components/HomePage'

function App() {
  const [phone, setPhone] = useState("");

  const handleRegisterSuccess = (userPhone) => {
    setPhone(userPhone);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<WelcomePage handleRegisterSuccess={handleRegisterSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp phone={phone} />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
