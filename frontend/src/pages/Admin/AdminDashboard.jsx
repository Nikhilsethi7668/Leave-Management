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
        updateTotalAnnualLeave,
    } = useLeaveStore();
    const [annualLeave, setAnnualLeave] = useState("");
    const [updating, setUpdating] = useState(false);
    const { loading, setLoading } = useUIStore();

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getAdminAnalytics(),
            getPendingLeaves(1, 5)
        ]).finally(() => setLoading(false));
    }, [getAdminAnalytics, getPendingLeaves, setLoading]);

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
                <h2 className="text-xl font-semibold mb-4 text-blue-700">Update Total Annual Leave</h2>
                <form
                    className="flex flex-col md:flex-row gap-4 items-center"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (!annualLeave) {
                            alert("Please enter total annual leave");
                            return;
                        }
                        setUpdating(true);
                        try {
                            await updateTotalAnnualLeave(Number(annualLeave));
                            setAnnualLeave("");
                        } finally {
                            setUpdating(false);
                        }
                    }}
                >
                    <input
                        type="number"
                        min={0}
                        value={annualLeave}
                        onChange={e => setAnnualLeave(e.target.value)}
                        placeholder="Total Annual Leaves"
                        className="border p-2 rounded min-w-[180px]"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Update"}
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
