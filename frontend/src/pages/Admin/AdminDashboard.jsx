import React, { useEffect } from 'react';
import { useLeaveStore } from '../../utils/stores/useLeaveStore';
import { useUIStore } from '../../utils/stores/useUIStore';
import StatCard from '../../components/dashboard/StatCard';
import PendingRequestsList from '../../components/admin/PendingRequestsList';
import SimpleBarChart from '../../components/admin/SimpleBarChart';

const AdminDashboard = () => {
    const {
        adminAnalytics,
        getAdminAnalytics
    } = useLeaveStore();
    const { loading, setLoading } = useUIStore();

    useEffect(() => {
        setLoading(true);
        getAdminAnalytics().finally(() => setLoading(false));
    }, [getAdminAnalytics, setLoading]);

    const chartData = adminAnalytics?.leaveTrends?.map(item => ({ label: item.month, value: item.count })) || [];

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Employees"
                    value={adminAnalytics?.totalEmployees || 0}
                    subtitle="Active in system"
                    colorClass="border-blue-500"
                />
                <StatCard
                    title="Pending Requests"
                    value={adminAnalytics?.pendingRequestsCount || 0}
                    subtitle="Awaiting review"
                    colorClass="border-yellow-500"
                />
                <StatCard
                    title="Approved Today"
                    value={adminAnalytics?.approvedTodayCount || 0}
                    subtitle="Leaves approved today"
                    colorClass="border-green-500"
                />
                <StatCard
                    title="Upcoming Leaves"
                    value={adminAnalytics?.upcomingLeavesCount || 0}
                    subtitle="In the next 7 days"
                    colorClass="border-red-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <SimpleBarChart data={chartData} title="Monthly Leave Trends" />
                </div>
                <div>
                    <PendingRequestsList requests={adminAnalytics?.latestPendingRequests} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
