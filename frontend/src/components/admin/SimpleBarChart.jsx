import React from 'react';

const SimpleBarChart = ({ data, title }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
            <div className="flex justify-around items-end h-48 space-x-2">
                {data.map(item => (
                    <div key={item.label} className="flex flex-col items-center w-full">
                        <div
                            className="w-3/4 bg-purple-400 hover:bg-purple-500 rounded-t-md transition-all"
                            style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                            title={`${item.label}: ${item.value}`}
                        ></div>
                        <span className="text-xs text-gray-500 mt-2">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleBarChart;
