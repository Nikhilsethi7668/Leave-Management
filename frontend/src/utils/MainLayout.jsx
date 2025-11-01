// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/stores/useAuthStore";
import { FiLogOut, FiHome, FiFilePlus, FiClock, FiUsers } from "react-icons/fi";
import logo from "../assets/logo.svg";
import { use } from "react";

export default function MainLayout() {
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();

    return (
        <div className=" min-h-screen  flex   bg-gradient-to-r from-purple-50 to-white">
            <aside className=" fixed min-h-screen top-0 w-60 bg-gradient-to-b from-purple-300 to-purple-800 border-r p-4 flex flex-col left-0">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-purple-700">
                        <img src={logo} alt="Logo" />
                    </h2>
                    <div className="text-sm text-gray-600">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.role}</div>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavLink to="/" className={({ isActive }) => `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-purple-100' : 'hover:bg-gray-100'}`}>
                        <FiHome /> Dashboard
                    </NavLink>
                    <NavLink to="/apply" className={({ isActive }) => `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-purple-100' : 'hover:bg-gray-100'}`}>
                        <FiFilePlus /> Apply Leave
                    </NavLink>
                    <NavLink to="/history" className={({ isActive }) => `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-purple-100' : 'hover:bg-gray-100'}`}>
                        <FiClock /> Leave History
                    </NavLink>
                    <NavLink to="/departments" className={({ isActive }) => `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-purple-100' : 'hover:bg-gray-100'}`}>
                        <FiUsers /> Departments
                    </NavLink>
                    {user?.role !== "user" && (
                        <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-yellow-100' : 'hover:bg-gray-100'}`}>
                            Admin Panel
                        </NavLink>
                    )}
                </nav>

                <div className="mt-4">
                    <button onClick={() => {
                        logout();
                        navigate('/authenticate');
                    }} className="w-full flex items-center gap-2 p-2 rounded bg-gray-100 hover:bg-gray-200">
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            <main className="object-cover flex-1 ml-60 p-6">
                <Outlet />
            </main>
        </div>
    );
}
