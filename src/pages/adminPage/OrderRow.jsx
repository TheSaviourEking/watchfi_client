import React from 'react';

const OrderRow = ({ order }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
        <div className="flex-1">
            <div className="flex items-center gap-3">
                <div className="font-medium text-gray-900">{order.id}</div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending_crypto' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                    {order.status.replace('_', ' ')}
                </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
                {order.customer} • {order.watch}
            </div>
        </div>
        <div className="text-right">
            <div className="font-semibold text-gray-900">${order.amount.toLocaleString()}</div>
            <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
        </div>
    </div>
);

export default OrderRow;