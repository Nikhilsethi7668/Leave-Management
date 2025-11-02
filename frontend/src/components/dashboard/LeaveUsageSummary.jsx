import React from 'react';

const LeaveUsageSummary = ({ analytics }) => {
    const utilizationRate = analytics?.totalLeavesAllocated ?
        Math.round(((analytics.totalPaidLeavesTaken || 0) / analytics.totalLeavesAllocated) * 100)
        : 0;

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave Usage Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Paid Leave Usage:</span>
                        <span className="font-medium">
                            {analytics?.totalPaidLeavesTaken || 0}/{analytics?.totalLeavesAllocated || 0} days
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Utilization Rate:</span>
                        <span className="font-medium">{utilizationRate}%</span>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Unpaid Leaves:</span>
                        <span className="font-medium">
                            {analytics?.totalUnpaidLeavesTaken || 0} days
                        </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-gray-600">Total Time Off:</span>
                        <span className="font-medium">
                            {analytics?.totalLeavesTaken || 0} days
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveUsageSummary;
