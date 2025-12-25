import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Components/Register'
import Login from './Components/Login'
import VerifyOtp from './Components/verifyOtp'
import NavBar from './Components/NavBar'
import HomePage from './Components/HomePage'

function App() {
  const [page, setPage] = useState("register");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    console.log(`Page: ${page}`);
    console.log(`Phone: ${phone}`);
  }, [page, phone]);

  const handleRegisterSuccess = (userPhone) => {
    setPhone(userPhone);
    setPage('otp');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage handleRegisterSuccess={handleRegisterSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp phone={phone} />} />
        </Routes>
      </Router>
    </div>
  )
}
// {page === "register" && <Register handleRegisterSuccess={handleRegisterSuccess} />}
//       {page === "otp" && <VerifyOtp phone={phone} />}
//       {page === "login" && <Login />}
export default App;
