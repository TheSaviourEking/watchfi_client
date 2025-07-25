import React from 'react';

const PaymentRow = ({ payment }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
        <div className="flex-1">
            <div className="flex items-center gap-3">
                <div className="font-mono text-sm text-gray-900">{payment.hash}</div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    payment.status === 'confirming' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {payment.confirmations} confirmations
                </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
                {payment.type} • ${payment.amount.toLocaleString()}
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                payment.status === 'confirming' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {payment.status}
            </span>
            {payment.status !== 'confirmed' && (
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700">
                    Verify
                </button>
            )}
        </div>
    </div>
);

export default PaymentRow;