import React, { useState } from "react";
import api from "../api/axios"

function Login() {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/login", {
                phone: "+977" + formData.phone,
                password: formData.password,
            });
            localStorage.setItem("token", response.data.token);

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        < div class="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4" >
            < div class="w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white" >
                <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Login to MiniWallet</h2>
                <form onSubmit={handleLogin} class="space-y-5">
                    <div>
                        <label for="phone" class="block mb-2 text-sm font-semibold text-gray-700">Phone Number<span class="text-red-500">*</span></label>
                        <input
                            type="text" id="phone" required
                            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-semibold text-gray-700">Password<span class="text-red-500">*</span></label>
                        <input
                            type="password" id="password" required
                            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                            placeholder="********"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-md px-5 py-4 mt-4 transition-colors shadow-lg active:scale-95">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;