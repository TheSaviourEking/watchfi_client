import React from 'react';
import { Bell, User, Menu } from 'lucide-react';

const Header = ({ sidebarOpen, setSidebarOpen, currentUser, pendingPayments }) => {
    return (
        <header className="bg-white shadow-sm border-b bg-background px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {pendingPayments}
                        </span>
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                            <div className="text-xs text-gray-600">{currentUser.role}</div>
                        </div>
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;