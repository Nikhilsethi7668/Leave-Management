import React, { useState } from 'react';

const ApproveLeaveModal = ({ isOpen, onClose, onSubmit }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit({ isPaid, note });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Approve Leave</h3>
          <div className="mt-2 px-7 py-3">
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                checked={isPaid} 
                onChange={() => setIsPaid(!isPaid)} 
                className="mr-2"
              />
              <label>Mark as Paid</label>
            </div>
            <textarea 
              className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
              rows="4"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              Approve
            </button>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveLeaveModal;
