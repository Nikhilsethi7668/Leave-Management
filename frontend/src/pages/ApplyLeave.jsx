// src/pages/ApplyLeave.jsx
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../utils/stores/useAuthStore";
import { useLeaveStore } from "../utils/stores/useLeaveStore";
import { useNavigate } from "react-router-dom";
import PendingLeaveAlert from "../components/PendingLeaveAlert";
import OneDayLeaveForm from "../components/leave-forms/OneDayLeaveForm";
import HalfDayLeaveForm from "../components/leave-forms/HalfDayLeaveForm";
import LongLeaveForm from "../components/leave-forms/LongLeaveForm";

const ApplyLeave = () => {
    const user = useAuthStore((s) => s.user);
    const {
        myLeaves,
        loadMyLeaves,
        leaveCategories,
        loadLeaveCategories,
        apply,
        deleteLeave
    } = useLeaveStore();
    const navigate = useNavigate();

    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            loadMyLeaves(user._id);
            loadLeaveCategories();
        }
    }, [user, loadMyLeaves, loadLeaveCategories]);

    // Check for pending leaves
    const pendingLeaves = myLeaves.filter(leave => leave.status === 'pending');
    const hasPendingLeave = pendingLeaves.length > 0;

    const handleLeaveTypeSelect = (type) => {
        setSelectedLeaveType(type);
    };

    const handleFormCancel = () => {
        setSelectedLeaveType(null);
    };

    const handleFormSubmit = async (formData) => {
        try {
            setLoading(true);
            await apply({
                ...formData,
                user: user._id
            });

            // Reload leaves to reflect the new application
            await loadMyLeaves(user._id);
            setSelectedLeaveType(null);

            alert("Leave application submitted successfully!");
            navigate("/history");
        } catch (error) {
            console.error("Error applying for leave:", error);
            alert("Failed to submit leave application. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLeave = async (leaveId) => {
        if (window.confirm("Are you sure you want to delete this leave application?")) {
            try {
                await deleteLeave(leaveId);
                alert("Leave application deleted successfully!");
            } catch (error) {
                console.error("Error deleting leave:", error);
                alert("Failed to delete leave application. Please try again.");
            }
        }
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
            <h1 className="text-2xl font-bold text-purple-700 mb-6">Apply for Leave</h1>

            {/* Show pending leave alert if exists */}
            {hasPendingLeave && (
                <PendingLeaveAlert
                    pendingLeave={pendingLeaves[0]}
                    onDelete={() => handleDeleteLeave(pendingLeaves[0]._id)}
                />
            )}

            {/* Main content */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {hasPendingLeave ? (
                    // Show message when pending leave exists
                    <div className="text-center py-8">
                        <div className="text-yellow-600 text-lg font-semibold mb-4">
                            You have a pending leave request. Please wait for it to be reviewed before applying for another leave.
                        </div>
                        <button
                            onClick={() => navigate("/history")}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            View Leave History
                        </button>
                    </div>
                ) : selectedLeaveType ? (
                    // Show selected form
                    <div>
                        {selectedLeaveType === "one-day" && (
                            <OneDayLeaveForm
                                categories={leaveCategories}
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                            />
                        )}
                        {selectedLeaveType === "half-day" && (
                            <HalfDayLeaveForm
                                categories={leaveCategories}
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                            />
                        )}
                        {selectedLeaveType === "long-leave" && (
                            <LongLeaveForm
                                categories={leaveCategories}
                                onSubmit={handleFormSubmit}
                                onCancel={handleFormCancel}
                            />
                        )}
                    </div>
                ) : (
                    // Show leave type selection
                    <div>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Warrior need a break?
                            </h2>
                            <p className="text-gray-600">
                                You may apply for leave. Choose the type of leave you want to apply for.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* One Day Leave Card */}
                            <div
                                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                                onClick={() => handleLeaveTypeSelect("one-day")}
                            >
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">📅</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">One Day Leave</h3>
                                <p className="text-gray-600 text-sm">
                                    Apply for a single day off. Perfect for appointments or personal work.
                                </p>
                            </div>

                            {/* Half Day Leave Card */}
                            <div
                                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                                onClick={() => handleLeaveTypeSelect("half-day")}
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">⏰</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Half Day Leave</h3>
                                <p className="text-gray-600 text-sm">
                                    Need just a few hours? Apply for first or second half of the day.
                                </p>
                            </div>

                            {/* Long Leave Card */}
                            <div
                                className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
                                onClick={() => handleLeaveTypeSelect("long-leave")}
                            >
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl">🏖️</span>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">Long Leave</h3>
                                <p className="text-gray-600 text-sm">
                                    Planning a vacation? Apply for multiple days with start and end dates.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApplyLeave;