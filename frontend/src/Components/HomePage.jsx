import React, { useState, useEffect } from 'react';
import { Send, Download, Eye, EyeOff, UserPlus, X } from 'lucide-react';
import api from '../api/axios';

const HomePage = () => {
    const [balance, setBalance] = useState(0);
    const [userName, setUserName] = useState("");
    const [showBalance, setShowBalance] = useState(true);
    const [send, setSend] = useState(false);
    const [load, setLoad] = useState(false);
    const [status, setStatus] = useState(200);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        amount: "",
        recipientPhone: "",
        tpin: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const fetchBalance = async () => {
        try {
            const response = await api.get("/balance", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setBalance(response.data.data.balance || 0);
            setUserName(response.data.data.name || "User");
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        setMessage("Processing...");

        try {
            const response = await api.post("/transaction", {
                senderPhone: JSON.parse(localStorage.getItem("user")).phone,
                recipientPhone: "+977" + formData.recipientPhone,
                amount: formData.amount,
                tpin: formData.tpin,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            console.log(response);
            setStatus(response.status);
            if (status === 200) {
                setMessage("Money sent successfully");
                setFormData({ amount: "", recipientPhone: "", tpin: "" });
                setTimeout(() => {
                    fetchBalance();
                    setSend(false);
                    setMessage("");
                }, 1500);
            } else if (status === 400) {
                setMessage("User not found");
            } else {
                setMessage("Money sent failed");
            }
        } catch (error) {
            console.error("Error sending money:", error);
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900 relative">
            {send && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setSend(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 capitalize">Send Money</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount<span className="text-red-500">*</span></label>
                                <input type="number" id="amount" value={formData.amount}
                                    onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Recipient Phone Number<span className="text-red-500">*</span></label>
                                <input type="phone" id="recipientPhone" value={formData.recipientPhone}
                                    onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="9800000000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction PIN<span className="text-red-500">*</span></label>
                                <input type="text" id="tpin" value={formData.tpin}
                                    onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="1234" />
                            </div>
                            <button onClick={handleSend} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                Confirm
                            </button>
                            <h1 className={`text-center ${status == 200 ? "text-green-500" : "text-red-500"}`}>
                                {message != '' ? message : ''}
                            </h1>
                        </div>
                    </div>
                </div>
            )}

            {load && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setLoad(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 capitalize">Load Money</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount<span className="text-red-500">*</span></label>
                                <input type="number" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Account Number<span className="text-red-500">*</span></label>
                                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="9800000000" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name<span className="text-red-500">*</span></label>
                                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="NMB Bank" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name<span className="text-red-500">*</span></label>
                                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Sagar Thakur" />
                            </div>
                            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 overflow-y-auto p-8 pt-24">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold mb-6">Welcome back, {userName}!</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-xl shadow-blue-200">
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-blue-100 font-medium tracking-wide">Available Balance</span>
                                <button onClick={() => setShowBalance(!showBalance)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
                                </button>
                            </div>
                            <div className="text-5xl font-bold tracking-tight">
                                {showBalance ? `Rs. ${Number(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
                            <div className="grid grid-cols-3 gap-4">
                                <ActionButton onClick={() => setSend(true)} icon={<Send size={22} />} label="Send" color="bg-blue-50 text-blue-600" />
                                <ActionButton onClick={() => setLoad(true)} icon={<Download size={22} />} label="Load" color="bg-emerald-50 text-emerald-600" />
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

const ActionButton = ({ icon, label, color, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-3 group">
        <div className={`p-5 rounded-2xl transition-all group-hover:scale-110 group-active:scale-95 shadow-sm ${color}`}>
            {icon}
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </button>
);

export default HomePage;