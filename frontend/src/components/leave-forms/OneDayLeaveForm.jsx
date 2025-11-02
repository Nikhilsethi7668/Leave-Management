import React, { useState } from "react";

const OneDayLeaveForm = ({ categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        startDate: "",
        category: "",
        description: "",
        leaveType: "paid",
        durationType: "full-day",
        numberOfDays: 1
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.startDate || !formData.category) {
            alert("Please fill all required fields");
            return;
        }
        onSubmit(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const selectedCategory = categories.find(cat => cat._id === formData.category);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4">One Day Leave Application</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                    </label>
                    <input
                        type="date"
                        required
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave Category *
                    </label>
                    <select
                        required
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    {selectedCategory && (
                        <div className="mt-2 text-sm text-blue-700">
                            Bonus Leaves: <strong>{selectedCategory.bonusLeaves || 0}</strong>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Leave Type
                    </label>
                    <select
                        value={formData.leaveType}
                        onChange={(e) => handleChange('leaveType', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="paid">Paid Leave</option>
                        <option value="unpaid">Unpaid Leave</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reason/Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        rows="3"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Brief reason for your leave..."
                    />
                </div>

                <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium"
                    >
                        Apply for Leave
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OneDayLeaveForm;