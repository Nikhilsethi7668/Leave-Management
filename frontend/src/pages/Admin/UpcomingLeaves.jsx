import React, { useEffect } from 'react';
import { useLeaveStore } from '../../utils/stores/useLeaveStore';
import { useUIStore } from '../../utils/stores/useUIStore';

const UpcomingLeaves = () => {
    const { upcomingLeaves, getUpcomingLeaves } = useLeaveStore();
    const { loading, setLoading } = useUIStore();

    useEffect(() => {
        setLoading(true);
        getUpcomingLeaves().finally(() => setLoading(false));
    }, [getUpcomingLeaves, setLoading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-purple-600">Loading Upcoming Leaves...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-purple-800 mb-8">Upcoming Leaves</h1>

            {!upcomingLeaves.docs || upcomingLeaves.docs.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-700">No Upcoming Leaves</h3>
                    <p className="text-gray-500 mt-2">No leaves scheduled for the upcoming days</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {upcomingLeaves.docs.map((leave) => (
                                <tr key={leave._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{leave.user.name}</div>
                                                <div className="text-sm text-gray-500">{leave.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {leave.leaveType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {leave.durationType}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(leave.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(leave.endDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {leave.numberOfDays} {leave.numberOfDays === 1 ? 'day' : 'days'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UpcomingLeaves;

