// src/pages/admin/ManageEmployees.jsx
import React, { useEffect, useState } from 'react';
import { useUserStore } from '../../utils/stores/useUserStore';

const ManageEmployees = () => {
    const { users, getUsers, approve, deactivate } = useUserStore();
    const [page, setPage] = useState(1);
    const limit = 20;

    useEffect(() => {
        getUsers(page, limit);
    }, [getUsers, page]);

    // Always use users.docs for rendering
    const employeeList = users.docs || [];
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-purple-800 mb-6">Manage Employees</h1>
            <div className="bg-white rounded-lg shadow p-4">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Department</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-500">No employees found.</td>
                            </tr>
                        ) : (
                            employeeList.map((user) => (
                                <tr key={user._id} className="border-b">
                                    <td className="px-4 py-2 font-medium">{user.name}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2">{user.department?.name ?? '-'}</td>
                                    <td className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 flex gap-2">
                                        {user.isActive ? (
                                            <button
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                                onClick={async () => {
                                                    if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
                                                        await deactivate(user._id);
                                                    }
                                                }}
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                className="px-3 py-1 bg-green-500 text-white rounded"
                                                onClick={async () => {
                                                    if (window.confirm(`Are you sure you want to approve ${user.name}?`)) {
                                                        await approve(user._id);
                                                    }
                                                }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="flex justify-center items-center mt-6 gap-2">
                    <button
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </button>
                    <span className="px-2 text-sm">Page {users.page} of {users.totalPages}</span>
                    <button
                        className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
                        disabled={page === users.totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManageEmployees;