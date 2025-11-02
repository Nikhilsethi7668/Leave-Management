import React from "react";
import { useLeaveStore } from "../utils/stores/useLeaveStore";

const PendingLeaveAlert = ({ pendingLeave, onDelete }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDurationText = (leave) => {
        if (leave.durationType === 'half-day') {
            return `Half Day (${leave.halfDayPeriod === 'first-half' ? 'First Half' : 'Second Half'})`;
        } else if (leave.durationType === 'full-day') {
            return 'Full Day';
        } else {
            return `${leave.numberOfDays} Days`;
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <h3 className="text-lg font-semibold text-yellow-800">
                            You have a pending leave request
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                        <div>
                            <p><strong>Period:</strong> {formatDate(pendingLeave.startDate)}
                                {pendingLeave.endDate && ` to ${formatDate(pendingLeave.endDate)}`}
                            </p>
                            <p><strong>Type:</strong> {pendingLeave.leaveType} • {getDurationText(pendingLeave)}</p>
                        </div>
                        <div>
                            <p><strong>Category:</strong> {pendingLeave.category?.name || 'N/A'}</p>
                            <p><strong>Applied:</strong> {formatDate(pendingLeave.appliedAt)}</p>
                        </div>
                    </div>

                    {pendingLeave.description && (
                        <div className="mt-2">
                            <p><strong>Reason:</strong> {pendingLeave.description}</p>
                        </div>
                    )}
                </div>

                <button
                    onClick={onDelete}
                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default PendingLeaveAlert;