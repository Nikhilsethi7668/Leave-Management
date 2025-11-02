import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../utils/stores/useAuthStore";
export default function AdminRoute({ children }) {
    const user = useAuthStore((s) => s.user);
    const loaded = useAuthStore((s) => s.loaded);

    if (!loaded) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (!user || user.role !== "admin") {
        // not authorized -> redirect to home or 403 page
        return <Navigate to="/" replace />;
    }

    return children ?? <Outlet />;
}
