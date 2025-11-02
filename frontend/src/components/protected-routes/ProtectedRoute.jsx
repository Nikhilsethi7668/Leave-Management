// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../utils/stores/useAuthStore";

export default function ProtectedRoute({ children }) {
    const user = useAuthStore((s) => s.user);
    const loaded = useAuthStore((s) => s.loaded);

    if (!loaded) {
        return (
            <div className="p-6 text-center">
                Loading...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/authenticate" replace />;
    }
    if (user.role == "admin" || user.role == "superadmin") {
        return <Navigate to="/admin" replace />;
    }

    return children ?? <Outlet />;
}