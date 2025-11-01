import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './utils/MainLayout';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import { ProtectedRoute, AdminRoute } from './components/protected-routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/authenticate" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="apply" element={<ApplyLeave />} />
        <Route path="history" element={<LeaveHistory />} />

        {/* Admin Only Routes */}
        <Route path="admin" element={
          <AdminRoute>
            <div>Admin Panel</div>
          </AdminRoute>
        } />
      </Route>

      {/* Handle all other routes */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;