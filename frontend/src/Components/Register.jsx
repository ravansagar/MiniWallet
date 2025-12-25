import React, { useState } from "react";
import api from "../api/axios"

function Register({ handleRegisterSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        password_confirmation: "",
        tpin: "",
        confirm_tpin: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_confirmation) {
            alert("Passwords do not match");
            return;
        }

        if (formData.tpin !== formData.confirm_tpin) {
            alert("Transaction PINs do not match");
            return;
        }

        try {
            const response = await api.post("/register", {
                name: formData.name,
                phone: formData.phone,
                password: formData.password,
                tpin: formData.tpin,
            });

            if (handleRegisterSuccess) {
                console.log("Phone number:", "+977" + formData.phone);
                handleRegisterSuccess("+977" + formData.phone);
            }
            // console.log(response.data);
            // alert("Registration successful!");
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Registration failed");
        }

    };

    return (
        < div class="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4" >
            < div class="w-full max-w-md shadow-2xl rounded-2xl p-8 bg-white" >
                <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Register on MiniWallet</h2>
                <form onSubmit={handleRegister} class="space-y-5">
                    <div>
                        <label for="name" class="block mb-2 text-sm font-semibold text-gray-700">Full Name<span class="text-red-500">*</span></label>
                        <input
                            type="text" id="name" required
                            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                            placeholder="Sagar Thakur"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
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
                    <div>
                        <label for="password_confirmation" class="block mb-2 text-sm font-semibold text-gray-700">Confirm Password<span class="text-red-500">*</span></label>
                        <input
                            type="password" id="password_confirmation" required
                            class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                            placeholder="********"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="tpin" class="block mb-2 text-sm font-semibold text-gray-700">TPIN<span class="text-red-500">*</span></label>
                            <input
                                type="password" id="tpin" required
                                class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                                placeholder="****"
                                value={formData.tpin}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label for="confirm_tpin" class="block mb-2 text-sm font-semibold text-gray-700">Confirm TPIN<span class="text-red-500">*</span></label>
                            <input
                                type="password" id="confirm_tpin" required
                                class="border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 outline-none transition-all"
                                placeholder="****"
                                value={formData.confirm_tpin}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-xl text-md px-5 py-4 mt-4 transition-colors shadow-lg active:scale-95">
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;