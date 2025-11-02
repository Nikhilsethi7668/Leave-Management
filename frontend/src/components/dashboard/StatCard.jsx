import React from 'react';

const StatCard = ({ title, value, subtitle, colorClass = 'border-gray-200' }) => {
    return (
        <div className={`p-4 bg-white rounded-lg shadow border-l-4 ${colorClass}`}>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
    );
};

export default StatCard;
