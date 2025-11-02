import React, { useEffect, useState } from 'react';
import { useLeaveStore } from '../../utils/stores/useLeaveStore';
import { useUIStore } from '../../utils/stores/useUIStore';
import StatCard from '../../components/dashboard/StatCard';
import PendingRequestsList from '../../components/admin/PendingRequestsList';

const AdminDashboard = () => {
    const {
        adminAnalytics,
        getAdminAnalytics,
        pendingLeaves,
        getPendingLeaves,
        updateAnnualLeaveQuota,
        leaveCategories,
        loadLeaveCategories,
    } = useLeaveStore();
    const [departmentId, setDepartmentId] = useState("");
    const [quota, setQuota] = useState("");
    const [updating, setUpdating] = useState(false);
    const { loading, setLoading } = useUIStore();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getAdminAnalytics(),
            getPendingLeaves(1, 5),
            loadLeaveCategories()
        ]).finally(() => setLoading(false));
    }, [getAdminAnalytics, getPendingLeaves, setLoading, loadLeaveCategories]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-purple-600">Loading Admin Dashboard...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-purple-800 mb-8">Admin Dashboard</h1>

            <div className="mb-8 p-4 bg-white rounded shadow">
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Update Annual Leave Quota</h2>
                <form
                    className="flex flex-col md:flex-row gap-4 items-center"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!departmentId || !quota) {
                            alert("Please select department and enter quota");
                            return;
                        }
                        setUpdating(true);
                        try {
                            await updateAnnualLeaveQuota(departmentId, Number(quota));
                            setQuota("");
                        } finally {
                            setUpdating(false);
                        }
                    }}
                >
                    <select
                        value={departmentId}
                        onChange={e => setDepartmentId(e.target.value)}
                        className="border p-2 rounded min-w-[180px]"
                        required
                    >
                        <option value="">Select Department</option>
                        {leaveCategories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min={0}
                        value={quota}
                        onChange={e => setQuota(e.target.value)}
                        placeholder="Annual Paid Leaves"
                        className="border p-2 rounded min-w-[120px]"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Update Quota"}
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Employees"
                    value={adminAnalytics?.totalUsers || 0}
                    subtitle="Active in system"
                    colorClass="border-blue-500"
                />
                <StatCard
                    title="Pending Requests"
                    value={adminAnalytics?.totalLeavesPending || 0}
                    subtitle="Awaiting review"
                    colorClass="border-yellow-500"
                />
                <StatCard
                    title="Total Approved"
                    value={adminAnalytics?.totalLeavesApproved || 0}
                    subtitle="Total approved leaves"
                    colorClass="border-green-500"
                />
                <StatCard
                    title="Upcoming Leaves"
                    value={adminAnalytics?.totalUpcomingApprovedLeaves || 0}
                    subtitle="Approved upcoming leaves"
                    colorClass="border-red-500"
                />
            </div>

            <div className="mt-6">
                <PendingRequestsList requests={pendingLeaves?.docs || []} />
            </div>
        </div>
    );
};

export default AdminDashboard;
