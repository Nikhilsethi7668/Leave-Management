import React from 'react';
import { FiTrash2 } from 'react-icons/fi';

const DepartmentCard = ({ department, onDelete }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">{department.name}</h3>
            <button
                onClick={() => onDelete(department._id)}
                className="text-gray-400 hover:text-red-500"
                title="Delete Department"
            >
                <FiTrash2 size={20} />
            </button>
        </div>
    );
};

export default DepartmentCard;
