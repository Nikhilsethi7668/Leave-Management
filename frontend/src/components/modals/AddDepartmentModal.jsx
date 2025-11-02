import React, { useState } from 'react';

const AddDepartmentModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (name.trim()) {
            onSave({ name });
            setName('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Department</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Department Name"
                    className="w-full p-2 border rounded-md mb-4"
                />
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddDepartmentModal;
