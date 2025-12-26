import React from "react";
import { Link } from "react-router-dom";

function WelcomePage() {
    return (
        <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
            <div className="relative inline-block">
                <div className="absolute -inset-10 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>
                <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6">
                    Small Wallet. <br />
                    <span className="text-blue-600">Big Possibilities.</span>
                </h1>
            </div>

            <p className="max-w-md mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
                The lightweight, secure way to manage your digital assets.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-white hover:text-blue-600 transition-all active:scale-95">
                    Get Started Now
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-bold border-2 border-slate-100 rounded-2xl hover:bg-blue-700 hover:text-white hover:border-blue-700 transition-all active:scale-95">
                    Login
                </Link>
            </div>
        </main>
    );
}

export default WelcomePage;
