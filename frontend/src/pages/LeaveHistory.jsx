import React, { useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useAuthStore } from '../utils/stores/useAuthStore';
import { useLeaveStore } from '../utils/stores/useLeaveStore';
import { useUIStore } from '../utils/stores/useUIStore';

export default function LeaveHistory() {
  const user = useAuthStore((s) => s.user);
  const { myLeaves, loadMyLeaves, deleteApplication } = useLeaveStore();
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
            <li key={l._id} className="py-2 border-b flex justify-between items-center">
              <div>
                <div>
                  {new Date(l.startDate).toLocaleDateString()} — {l.durationType}
                </div>
                <div className="text-sm text-gray-500">{l.description}</div>
                {l.category?.name && (
                  <div className="text-xs text-blue-600 mt-1">Category: {l.category.name}</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{l.status}</span>
                {l.status === 'pending' && (
                  <button
                    title="Delete pending leave"
                    onClick={() => deleteApplication(l._id)}
                    className="ml-2"
                  >
                    <FiTrash2 className="text-red-500 hover:text-red-700" size={20} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
