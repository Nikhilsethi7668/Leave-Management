import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import MainLayout from './utils/MainLayout';
import Dashboard from './pages/Dashboard';
import ApplyLeave from './pages/ApplyLeave';
import LeaveHistory from './pages/LeaveHistory';
import ProtectedRoute from './components/protected-routes/ProtectedRoute';
import AdminRoute from './components/protected-routes/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Requests from './pages/Admin/Requests';
import UpcomingLeaves from './pages/Admin/UpcomingLeaves';
import CreateLeaveCategory from './pages/Admin/CreateLeaveCategory';
import ManageEmployees from './pages/Admin/ManageEmployees';
import Department from './pages/Department';

function App() {
  return (
    <Routes>
      <Route path="/authenticate" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="apply" element={<ApplyLeave />} />
        <Route path="history" element={<LeaveHistory />} />
        {/* <Route path="departments" element={<Department />} /> */}
      </Route>

      // Admin Routes
      <Route path="/admin" element={<AdminRoute><MainLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="departments" element={<Department />} />
        <Route path="upcoming-leaves" element={<UpcomingLeaves />} />
        <Route path="create-category" element={<CreateLeaveCategory />} />
        <Route path="manage-employees" element={<ManageEmployees />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;

