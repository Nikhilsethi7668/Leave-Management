import React from 'react';

const LeaveTypeCard = ({ icon, title, description, onClick, bgColorClass = 'bg-gray-100' }) => {
    return (
        <div
            className="border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-200"
            onClick={onClick}
        >
            <div className={`w-16 h-16 ${bgColorClass} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
};

export default LeaveTypeCard;
