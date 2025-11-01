import React, { useEffect, useState } from "react";
import { useAuthStore } from "../utils/stores/useAuthStore";
import { useLeaveStore } from "../utils/stores/useLeaveStore";
import api from "../utils/axiosInstance";

export default function Dashboard() {
    const user = useAuthStore(s => s.user);
    const loadMyLeaves = useLeaveStore(s => s.loadMyLeaves);
    const myLeaves = useLeaveStore(s => s.myLeaves);
    const leaveAnalytics = useLeaveStore(s => s.userLeaveAnalytics);
    const loadAnalytics = useLeaveStore(s => s.loadAnalytics);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Dashboard useEffect triggered", { user: user?._id });
        if (user && user._id) {
            loadMyLeaves(user._id);
            loadAnalytics(user._id).then(() => setLoading(false));
        } else {
            console.log("No user found or user._id is missing");
            setLoading(false);
        }
    }, [user, loadMyLeaves]);

    // const loadLeaveAnalytics = async (userId) => {
    //     try {
    //         console.log("Loading analytics for user:", userId);
    //         setLoading(true);
    //         const response = await api.get(`/leaves/analytics/${userId}`);
    //         console.log("Analytics API response:", response.data);
    //         setLeaveAnalytics(response.data);
    //     } catch (error) {
    //         console.error("Error loading leave analytics:", error);
    //         console.error("Error details:", error.response?.data || error.message);
    //         // Set default analytics if API fails
    //         setLeaveAnalytics({
    //             totalLeavesAllocated: user?.leaveBalance?.totalAllowed || 21,
    //             totalLeavesTaken: 0,
    //             totalPaidLeavesTaken: 0,
    //             totalUnpaidLeavesTaken: 0,
    //             paidLeavesRemaining: user?.leaveBalance?.totalAllowed || 21
    //         });
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Calculate additional stats from myLeaves for UI display
    const additionalStats = React.useMemo(() => {
        if (!myLeaves || myLeaves.length === 0) {
            return {
                pendingLeaves: 0,
                rejectedLeaves: 0,
                approvedLeaves: 0
            };
        }

        const pendingLeaves = myLeaves.filter(leave => leave.status === 'pending').length;
        const rejectedLeaves = myLeaves.filter(leave => leave.status === 'rejected').length;
        const approvedLeaves = myLeaves.filter(leave => leave.status === 'approved').length;

        return {
            pendingLeaves,
            rejectedLeaves,
            approvedLeaves
        };
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

            {/* Leave Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-500">Total Allocated / Year</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {leaveAnalytics?.totalLeavesAllocated || 0} days
                    </p>
                    <div className="text-xs text-gray-400 mt-1">Annual allocation</div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-500">Paid Leaves Taken</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {leaveAnalytics?.totalPaidLeavesTaken || 0} days
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                        Approved paid leaves
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-orange-500">
                    <h3 className="text-sm font-medium text-gray-500">Paid Leaves Remaining</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {leaveAnalytics?.paidLeavesRemaining || 0} days
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                        {leaveAnalytics?.totalLeavesAllocated ?
                            Math.round(((leaveAnalytics.paidLeavesRemaining || 0) / leaveAnalytics.totalLeavesAllocated) * 100)
                            : 0}% of allocation left
                    </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow border-l-4 border-red-500">
                    <h3 className="text-sm font-medium text-gray-500">Unpaid Leaves Taken</h3>
                    <p className="text-2xl font-bold text-gray-800">
                        {leaveAnalytics?.totalUnpaidLeavesTaken || 0} days
                    </p>
                    <div className="text-xs text-gray-400 mt-1">Additional leave days</div>
                </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Leaves Taken</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        {leaveAnalytics?.totalLeavesTaken || 0} days
                    </p>
                    <div className="text-xs text-gray-400 mt-1">All types combined</div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
                    <p className="text-2xl font-bold text-yellow-600">
                        {additionalStats.pendingLeaves}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">Awaiting approval</div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Rejected Requests</h3>
                    <p className="text-2xl font-bold text-red-600">
                        {additionalStats.rejectedLeaves}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">Not approved</div>
                </div>
            </div>

            {/* Usage Summary */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave Usage Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Paid Leave Usage:</span>
                            <span className="font-medium">
                                {leaveAnalytics?.totalPaidLeavesTaken || 0}/{leaveAnalytics?.totalLeavesAllocated || 0} days
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Utilization Rate:</span>
                            <span className="font-medium">
                                {leaveAnalytics?.totalLeavesAllocated ?
                                    Math.round(((leaveAnalytics.totalPaidLeavesTaken || 0) / leaveAnalytics.totalLeavesAllocated) * 100)
                                    : 0}%
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Unpaid Leaves:</span>
                            <span className="font-medium">
                                {leaveAnalytics?.totalUnpaidLeavesTaken || 0} days
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-gray-600">Total Time Off:</span>
                            <span className="font-medium">
                                {leaveAnalytics?.totalLeavesTaken || 0} days
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Leaves */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Leave Applications</h2>
                {(!myLeaves || myLeaves.length === 0) ? (
                    <p className="text-gray-500 text-center py-4">No leave applications found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myLeaves.slice(0, 5).map(leave => {
                                    const start = new Date(leave.startDate);
                                    const end = new Date(leave.endDate);
                                    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                                    return (
                                        <tr key={leave._id} className="border-t">
                                            <td className="px-4 py-3">
                                                {start.toLocaleDateString()} - {end.toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 capitalize">{leave.leaveType}</td>
                                            <td className="px-4 py-3">{duration} day{duration !== 1 ? 's' : ''}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                    {leave.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}