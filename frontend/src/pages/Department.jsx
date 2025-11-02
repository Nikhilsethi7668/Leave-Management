import React, { useEffect } from 'react';
import { useDepartmentStore } from '../utils/stores/useDepartmentStore';
import DepartmentCard from '../components/departments/DepartmentCard';
import AddDepartmentModal from '../components/modals/AddDepartmentModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { FiPlus } from 'react-icons/fi';

export default function Department() {
    const {
        departments,
        load,
        create,
        isAddModalOpen,
        isConfirmModalOpen,
        openAddModal,
        closeAddModal,
        openConfirmModal,
        confirmDelete,
        closeConfirmModal,
    } = useDepartmentStore();

    useEffect(() => {
        load();
    }, [load]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-purple-700">Departments</h1>
                <button
                    onClick={openAddModal}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                    <FiPlus />
                    Add Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map(dept => (
                    <DepartmentCard key={dept._id} department={dept} onDelete={openConfirmModal} />
                ))}
            </div>

            <AddDepartmentModal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                onSave={create}
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this department? This action cannot be undone."
            />
        </div>
    );
}
