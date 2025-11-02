import React, { useState } from "react";

const LongLeaveForm = ({ categories, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        category: "",
        description: "",
        leaveType: "paid",
        durationType: "multiple-days",
        numberOfDays: 1
    });

    const calculateNumberOfDays = (start, end) => {
        if (!start || !end) return 1;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.startDate || !formData.endDate || !formData.category) {
            alert("Please fill all required fields");
            return;
        }
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert("End date cannot be before start date");
            return;
        }
        onSubmit(formData);
    };

    const handleChange = (field, value) => {
        const updatedData = {
            ...formData,
            [field]: value
        };

        // Calculate number of days when dates change
        if ((field === 'startDate' || field === 'endDate') && updatedData.startDate && updatedData.endDate) {
            updatedData.numberOfDays = calculateNumberOfDays(updatedData.startDate, updatedData.endDate);
        }

        setFormData(updatedData);
    };

    const selectedCategory = categories.find(cat => cat._id === formData.category);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4">Long Leave Application</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date *
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
                            End Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.endDate}
                            onChange={(e) => handleChange('endDate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                        />
                    </div>
                </div>

                {formData.startDate && formData.endDate && (
                    <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm text-blue-700">
                            Total Leave Days: <strong>{formData.numberOfDays}</strong>
                        </p>
                    </div>
                )}

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

export default LongLeaveForm;