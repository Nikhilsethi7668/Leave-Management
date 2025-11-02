import React, { useEffect } from 'react';
import { useAuthStore } from '../utils/stores/useAuthStore';
import { useLeaveStore } from '../utils/stores/useLeaveStore';
import { useUIStore } from '../utils/stores/useUIStore';

export default function LeaveHistory() {
  const user = useAuthStore((s) => s.user);
  const { myLeaves, loadMyLeaves } = useLeaveStore();
  const { loading, setLoading } = useUIStore();

  useEffect(() => {
    if (user) {
      setLoading(true);
      loadMyLeaves(user._id).finally(() => setLoading(false));
    }
  }, [user, loadMyLeaves, setLoading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-purple-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl text-purple-700 mb-4">Leave History</h2>
      <div className="bg-white p-4 rounded shadow">
        <ul>
          {(myLeaves || []).map((l) => (
            <li key={l._id} className="py-2 border-b flex justify-between">
              <div>
                <div>
                  {new Date(l.startDate).toLocaleDateString()} — {l.durationType}
                </div>
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
