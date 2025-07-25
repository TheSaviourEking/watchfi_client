import React from 'react';

const MetricCard = ({ title, value, icon: Icon, trend, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                {trend && (
                    <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trend > 0 ? '+' : ''}{trend}% from last month
                    </p>
                )}
            </div>
            <div className={`p-3 rounded-full bg-${color}-100`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
        </div>
    </div>
);

export default MetricCard;