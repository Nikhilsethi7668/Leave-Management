import React, { useState } from 'react';

const LeaveCategoryForm = ({ onSubmit, onClose, loading }) => {
    const [name, setName] = useState('');
    const [bonusLeaves, setBonusLeaves] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name,
            bonusLeaves: bonusLeaves ? Number(bonusLeaves) : null,
            description,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add New Leave Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Category Name</label>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Bonus Leaves (optional)</label>
                        <input
                            type="number"
                            className="w-full border rounded px-3 py-2"
                            value={bonusLeaves}
                            onChange={(e) => setBonusLeaves(e.target.value)}
                            min="0"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Description</label>
                        <textarea
                            className="w-full border rounded px-3 py-2"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={onClose}>Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeaveCategoryForm;
