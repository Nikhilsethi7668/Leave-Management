import React, { useEffect } from 'react';
import { useLeaveStore } from '../../utils/stores/useLeaveStore';
import LeaveActionModal from '../../components/modals/LeaveActionModal';

const Requests = () => {
  const {
    pendingLeaves,
    getPendingLeaves,
    isModalOpen,
    modalAction,
    page,
    openModal,
    closeModal,
    handleReview,
    setPage,
  } = useLeaveStore();

  useEffect(() => {
    getPendingLeaves(page);
    console.log(pendingLeaves)
  }, [page, getPendingLeaves]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pending Leave Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Employee</th>
              <th className="py-2 px-4 border-b">Leave Type</th>
              <th className="py-2 px-4 border-b">Duration</th>
              <th className="py-2 px-4 border-b">Dates</th>
              <th className="py-2 px-4 border-b">Days</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.docs.map((request) => (
              <tr key={request._id}>
                <td className="py-2 px-4 border-b">{request.user.name}</td>
                <td className="py-2 px-4 border-b">{request.leaveType}</td>
                <td className="py-2 px-4 border-b">{request.durationType}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(request.startDate).toLocaleDateString()} - {
                    new Date(request.endDate).toLocaleDateString()
                  }
                </td>
                <td className="py-2 px-4 border-b">{request.numberOfDays}</td>
                <td className="py-2 px-4 border-b">{request.category?.name || '-'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => openModal(request, 'approved')}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => openModal(request, 'rejected')}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>
        <span>
          Page {page} of {pendingLeaves.totalPages}
        </span>
        <button
          disabled={page >= pendingLeaves.totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
      <LeaveActionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleReview}
        action={modalAction}
      />
    </div>
  );
};

export default Requests;
