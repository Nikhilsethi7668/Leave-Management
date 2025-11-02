import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/stores/useAuthStore";
import {
    FiLogOut,
    FiHome,
    FiFilePlus,
    FiClock,
    FiUsers,
    FiUserPlus,
    FiFolderPlus,
    FiUserCheck,
    FiList
} from "react-icons/fi";
import logo from "../assets/logo.svg";
import { useEffect } from "react";

export default function MainLayout() {
    const logout = useAuthStore((s) => s.logout);
    const user = useAuthStore((s) => s.user);

    // Common navigation item style function
    const navItemClass = (isActive) =>
        `flex items-center gap-2 p-2 rounded ${isActive ? 'bg-purple-100' : 'hover:bg-gray-100'}`;

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-purple-50 to-white">
            <aside className="fixed min-h-screen top-0 w-60 bg-gradient-to-b from-purple-300 to-purple-800 border-r p-4 flex flex-col left-0">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-purple-700">
                        <img src={logo} alt="Logo" />
                    </h2>
                    <div className="text-sm text-gray-600">{user?.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{user?.role}</div>
                </div>

                <nav className="flex-1 space-y-2">

                    {/* Common for all roles */}
                    <NavLink to={user?.role === "user" ? "/" : "/admin"} end className={({ isActive }) => navItemClass(isActive)}>
                        <FiHome /> Dashboard
                    </NavLink>
                    {user.role === "superadmin" || user.role === "admin" && <NavLink to="/admin/departments" className={({ isActive }) => navItemClass(isActive)}>
                        <FiUsers /> Departments
                    </NavLink>}

                    {/* User-specific navigation */}
                    {user?.role === "user" && (
                        <>
                            <NavLink to="/apply" className={({ isActive }) => navItemClass(isActive)}>
                                <FiFilePlus /> Apply Leave
                            </NavLink>
                            <NavLink to="/history" className={({ isActive }) => navItemClass(isActive)}>
                                <FiClock /> Leave History
                            </NavLink>
                        </>
                    )}

                    {/* Admin/SuperAdmin navigation */}
                    {(user?.role === "admin" || user?.role === "superadmin") && (
                        <>

                            <NavLink to="/admin/requests" className={({ isActive }) => navItemClass(isActive)}>
                                <FiList /> Requests
                            </NavLink>
                            <NavLink to="/admin/upcoming-leaves" className={({ isActive }) => navItemClass(isActive)}>
                                <FiClock /> Upcoming Leaves
                            </NavLink>
                            <NavLink to="/admin/create-category" className={({ isActive }) => navItemClass(isActive)}>
                                <FiFolderPlus /> Create Leave Category
                            </NavLink>
                            <NavLink to="/admin/manage-employees" className={({ isActive }) => navItemClass(isActive)}>
                                <FiUserCheck /> Manage Employees
                            </NavLink>
                        </>
                    )}
                </nav>

                <div className="mt-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 p-2 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 ml-60 p-6">
                <Outlet />
            </main>
        </div>
    );
}