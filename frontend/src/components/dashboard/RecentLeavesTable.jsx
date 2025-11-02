import React from 'react';

const RecentLeavesTable = ({ leaves }) => {
    if (!leaves || leaves.length === 0) {
        return <p className="text-gray-500 text-center py-4">No leave applications found.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.slice(0, 5).map(leave => {
                        const start = new Date(leave.startDate);
                        const end = new Date(leave.endDate);
                        const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

                        return (
                            <tr key={leave._id} className="border-t">
                                <td className="px-4 py-3">
                                    {start.toLocaleDateString()} - {end.toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 capitalize">{leave.leaveType}</td>
                                <td className="px-4 py-3 text-blue-700">{leave.category?.name || '-'}</td>
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
    );
};

export default RecentLeavesTable;
