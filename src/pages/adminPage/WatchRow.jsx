import React from 'react';
import { MoreVertical } from 'lucide-react';

const WatchRow = ({ watch }) => (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
        <div className="flex-1">
            <div className="font-medium text-gray-900">{watch.name}</div>
            <div className="text-sm text-gray-600">{watch.brand} • {watch.id}</div>
        </div>
        <div className="flex items-center gap-4">
            <div className="text-right">
                <div className="font-semibold">${watch.price.toLocaleString()}</div>
                <div className={`text-sm ${watch.stock === 0 ? 'text-red-600' : watch.stock <= 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    Stock: {watch.stock}
                </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="h-4 w-4" />
            </button>
        </div>
    </div>
);

export default WatchRow;