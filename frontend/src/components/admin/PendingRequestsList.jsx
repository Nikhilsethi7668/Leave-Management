import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PendingRequestsList = ({ requests }) => {
    if (!requests || requests.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-700">No Pending Requests</h3>
                <p className="text-gray-500 mt-2">Everything is up to date!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
                <Link to="/admin/requests" className="text-sm text-purple-600 hover:underline">View All</Link>
            </div>
            <ul className="divide-y divide-gray-200">
                {requests.slice(0, 5).map(req => (
                    <Link to="/admin/requests" key={req._id}>
                        <li className="p-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                            <div>
                                <p className="font-medium text-gray-800">{req.user.name}</p>
                                <p className="text-sm text-gray-500 capitalize">{req.leaveType} Leave</p>
                            </div>
                            <FiChevronRight className="text-gray-400" />
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default PendingRequestsList;
