// src/pages/LeaveHistory.jsx
import React, { useEffect } from "react";
import { useAuthStore } from "../utils/stores/useAuthStore";
import { useLeaveStore } from "../utils/stores/useLeaveStore";

export default function LeaveHistory() {
    const user = useAuthStore(s => s.user);
    const loadMyLeaves = useLeaveStore(s => s.loadMyLeaves);
    const myLeaves = useLeaveStore(s => s.myLeaves);

    useEffect(() => { if (user) loadMyLeaves(user._id); }, [user, loadMyLeaves]);

    return (
        <div>
            <h2 className="text-xl text-purple-700 mb-4">Leave History</h2>
            <div className="bg-white p-4 rounded shadow">
                <ul>
                    {(myLeaves || []).map(l => (
                        <li key={l._id} className="py-2 border-b flex justify-between">
                            <div>
                                <div>{new Date(l.startDate).toLocaleDateString()} — {l.durationType}</div>
                                <div className="text-sm text-gray-500">{l.description}</div>
                            </div>
                            <div className="text-sm">{l.status}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
