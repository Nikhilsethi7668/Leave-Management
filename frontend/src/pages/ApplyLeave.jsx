import React, { useEffect } from 'react';
import { useAuthStore } from '../utils/stores/useAuthStore';
import { useLeaveStore } from '../utils/stores/useLeaveStore';
import { useUIStore } from '../utils/stores/useUIStore';
import { useNavigate } from 'react-router-dom';
import PendingLeaveAlert from '../components/PendingLeaveAlert';
import OneDayLeaveForm from '../components/leave-forms/OneDayLeaveForm';
import HalfDayLeaveForm from '../components/leave-forms/HalfDayLeaveForm';
import LongLeaveForm from '../components/leave-forms/LongLeaveForm';
import LeaveTypeCard from '../components/leave-forms/LeaveTypeCard';

const ApplyLeave = () => {
  const user = useAuthStore((s) => s.user);
  const {
    myLeaves,
    loadMyLeaves,
    leaveCategories,
    loadLeaveCategories,
    selectedLeaveType,
    setSelectedLeaveType,
    submitApplication,
    deleteApplication,
    handleFormCancel,
  } = useLeaveStore();
  const { loading, setLoading } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadMyLeaves(user._id);
      loadLeaveCategories();
    }
  }, [user, loadMyLeaves, loadLeaveCategories]);

  const pendingLeaves = myLeaves.filter((leave) => leave.status === 'pending');
  const hasPendingLeave = pendingLeaves.length > 0;

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    await submitApplication(formData, user, navigate);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-purple-600">Processing...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Apply for Leave
      </h1>

      {hasPendingLeave && (
        <PendingLeaveAlert
          pendingLeave={pendingLeaves[0]}
          onDelete={() => deleteApplication(pendingLeaves[0]._id)}
        />
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        {hasPendingLeave ? (
          <div className="text-center py-8">
            <div className="text-yellow-600 text-lg font-semibold mb-4">
              You have a pending leave request. Please wait for it to be
              reviewed before applying for another leave.
            </div>
            <button
              onClick={() => navigate('/history')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Leave History
            </button>
          </div>
        ) : selectedLeaveType ? (
          <div>
            {selectedLeaveType === 'one-day' && (
              <OneDayLeaveForm
                categories={leaveCategories}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            )}
            {selectedLeaveType === 'half-day' && (
              <HalfDayLeaveForm
                categories={leaveCategories}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            )}
            {selectedLeaveType === 'long-leave' && (
              <LongLeaveForm
                categories={leaveCategories}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            )}
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Warrior need a break?
              </h2>
              <p className="text-gray-600">
                You may apply for leave. Choose the type of leave you want to
                apply for.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LeaveTypeCard
                icon="📅"
                title="One Day Leave"
                description="Apply for a single day off. Perfect for appointments or personal work."
                onClick={() => setSelectedLeaveType('one-day')}
                bgColorClass="bg-blue-100"
              />
              <LeaveTypeCard
                icon="⏰"
                title="Half Day Leave"
                description="Need just a few hours? Apply for first or second half of the day."
                onClick={() => setSelectedLeaveType('half-day')}
                bgColorClass="bg-green-100"
              />
              <LeaveTypeCard
                icon="🏖️"
                title="Long Leave"
                description="Planning a vacation? Apply for multiple days with start and end dates."
                onClick={() => setSelectedLeaveType('long-leave')}
                bgColorClass="bg-orange-100"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyLeave;