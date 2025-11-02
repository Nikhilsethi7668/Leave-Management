// src/pages/admin/CreateLeaveCategory.jsx
import React, { useState, useEffect } from 'react';
import { useLeaveStore } from '../../utils/stores/useLeaveStore';
import LeaveCategoryForm from '../../components/modals/LeaveCategoryForm';
import { FiTrash2 } from 'react-icons/fi';

const CreateLeaveCategory = () => {
    const { leaveCategories, loadLeaveCategories, createLeaveCategory, deleteLeaveCategory } = useLeaveStore();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLeaveCategories();
    }, [loadLeaveCategories]);

    const handleAddCategory = async (formData) => {
        setLoading(true);
        try {
            await createLeaveCategory(formData);
            setShowForm(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category?')) {
            await deleteLeaveCategory(id);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-purple-800 mb-6">Leave Categories</h1>
            <button
                className="mb-4 px-4 py-2 bg-purple-600 text-white rounded"
                onClick={() => setShowForm(true)}
            >
                Add New Category
            </button>
            <div className="bg-white rounded-lg shadow p-4">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Bonus Leaves</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leaveCategories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">No categories found.</td>
                            </tr>
                        ) : (
                            leaveCategories.map((cat) => (
                                <tr key={cat._id} className="border-b">
                                    <td className="px-4 py-2 font-medium">{cat.name}</td>
                                    <td className="px-4 py-2">{cat.bonusLeaves ?? '-'}</td>
                                    <td className="px-4 py-2">{cat.description}</td>
                                    <td className="px-4 py-2">
                                        <button onClick={() => handleDelete(cat._id)} title="Delete category">
                                            <FiTrash2 className="text-red-500 hover:text-red-700" size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {showForm && (
                <LeaveCategoryForm
                    onSubmit={handleAddCategory}
                    onClose={() => setShowForm(false)}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default CreateLeaveCategory;