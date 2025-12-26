import React, { useState } from "react";
import api from "../api/axios"
import { useNavigate, useLocation } from "react-router-dom";

function VerifyOtp() {
    const navigate = useNavigate();
    const location = useLocation();
    const phone = location.state?.phone;
    const [formData, setFormData] = useState({
        otp: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        if (!phone) {
            alert("Session expired. Please register again.");
            navigate("/register");
            return;
        }

        try {
            console.log(formData.otp, phone);
            const response = await api.post("/verify-otp", {
                otp: formData.otp,
                phone: phone,
            });
            if (response.data.status === "success") {
                navigate("/login", { replace: true });
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "OTP verification failed");
        }
    };

    return (
        <div class="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div class="w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white">
                <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Verify OTP</h2>
                <p class="text-gray-600 text-center mb-8">Enter the OTP sent to your WhatsApp</p>
                <form onSubmit={handleVerifyOtp} class="space-y-5">
                    <div>
                        <label for="otp" class="block mb-2 text-sm font-semibold text-gray-700">OTP</label>
                        <input
                            type="text" id="otp" required
                            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                            placeholder="1234"
                            value={formData.otp}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-md px-5 py-4 mt-4 transition-colors shadow-lg active:scale-95">
                        Verify OTP
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;
