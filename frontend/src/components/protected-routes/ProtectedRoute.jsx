import { use } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../utils/stores/useAuthStore';


// Protected route for authenticated users
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuthStore.getState().user;

    return isAuthenticated ? children : <Navigate to="/authenticate" replace />;
};
export const AdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // Assuming you store role

    return isAuthenticated && userRole === 'admin' ? children : <Navigate to="/" replace />;
};