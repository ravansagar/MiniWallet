import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import api from "../api/axios";
import { Link } from "react-router-dom";

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            setLoggedIn(true);
        }
    }, [token]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await api.post("/logout", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
        } catch (error) {
            console.error("Logout failed on server, but clearing local session anyway.", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setLoggedIn(false);
        }
    };

    return (
        <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-2 rtl:space-x-reverse">
                    <img src={logo} className="h-10" alt="MiniWallet" />
                    <span className="self-center text-xl text-gray-900 font-bold whitespace-nowrap">MiniWallet</span>
                </a>
                <button
                    onClick={toggleMenu}
                    type="button"
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    )}
                </button>

                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg bg-gray-50 md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white md:items-center space-y-2 md:space-y-0">
                        <li>
                            <a href="/" className="block py-2 px-3 text-blue-600 md:p-0" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:text-blue-600 md:p-0">About</a>
                        </li>
                        <li>
                            <a href="/" className="block py-2 px-3 text-gray-900 rounded hover:text-blue-600 md:p-0">Services</a>
                        </li>
                        {!loggedIn ? (
                            <>
                                <li className="pt-2 md:pt-0">
                                    <Link to="/login" className="block py-2 px-5 text-center text-gray-900 border border-gray-900 rounded-lg hover:bg-blue-500 hover:text-white hover:border-white transition-colors md:text-sm">
                                        Login
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/register" className="block py-2 px-5 text-center text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-colors shadow-sm md:text-sm">
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <li className="pt-2 md:pt-0">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full py-2 px-5 text-center text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-colors shadow-sm md:text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;