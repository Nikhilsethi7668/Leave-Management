import React, { useEffect } from "react";
import { useAuthStore } from "../utils/stores/useAuthStore";
import { useLeaveStore } from "../utils/stores/useLeaveStore";
import { useUIStore } from "../utils/stores/useUIStore";
import StatCard from "../components/dashboard/StatCard";
import LeaveUsageSummary from "../components/dashboard/LeaveUsageSummary";
import RecentLeavesTable from "../components/dashboard/RecentLeavesTable";

export default function Dashboard() {
    const user = useAuthStore(s => s.user);
    const { loadMyLeaves, myLeaves, userLeaveAnalytics, loadAnalytics } = useLeaveStore();
    const { loading, setLoading } = useUIStore();

    useEffect(() => {
        if (user && user._id) {
            setLoading(true);
            Promise.all([
                loadMyLeaves(user._id),
                loadAnalytics(user._id)
            ]).finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, loadMyLeaves, loadAnalytics, setLoading]);

    const additionalStats = React.useMemo(() => {
        if (!myLeaves || myLeaves.length === 0) {
            return { pendingLeaves: 0, rejectedLeaves: 0 };
        }
        const pendingLeaves = myLeaves.filter(leave => leave.status === 'pending').length;
        const rejectedLeaves = myLeaves.filter(leave => leave.status === 'rejected').length;
        return { pendingLeaves, rejectedLeaves };
    }, [myLeaves]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-purple-600">Loading analytics...</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl text-purple-700 mb-6">Welcome, {user?.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Allocated / Year"
                    value={`${userLeaveAnalytics?.totalLeavesAllocated || 0} days`}
                    subtitle="Annual allocation"
                    colorClass="border-green-500"
                />
                <StatCard
                    title="Paid Leaves Taken"
                    value={`${userLeaveAnalytics?.totalPaidLeavesTaken || 0} days`}
                    subtitle="Approved paid leaves"
                    colorClass="border-blue-500"
                />
                <StatCard
                    title="Paid Leaves Remaining"
                    value={`${userLeaveAnalytics?.paidLeavesRemaining || 0} days`}
                    subtitle={`${userLeaveAnalytics?.totalLeavesAllocated ? Math.round(((userLeaveAnalytics.paidLeavesRemaining || 0) / userLeaveAnalytics.totalLeavesAllocated) * 100) : 0}% of allocation left`}
                    colorClass="border-orange-500"
                />
                <StatCard
                    title="Unpaid Leaves Taken"
                    value={`${userLeaveAnalytics?.totalUnpaidLeavesTaken || 0} days`}
                    subtitle="Additional leave days"
                    colorClass="border-red-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                    title="Total Leaves Taken"
                    value={`${userLeaveAnalytics?.totalLeavesTaken || 0} days`}
                    subtitle="All types combined"
                />
                <StatCard
                    title="Pending Requests"
                    value={additionalStats.pendingLeaves}
                    subtitle="Awaiting approval"
                />
                <StatCard
                    title="Rejected Requests"
                    value={additionalStats.rejectedLeaves}
                    subtitle="Not approved"
                />
            </div>

            <LeaveUsageSummary analytics={userLeaveAnalytics} />

            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Leave Applications</h2>
                <RecentLeavesTable leaves={myLeaves} />
            </div>
        </div>
    );
}