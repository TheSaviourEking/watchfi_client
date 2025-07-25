import React from 'react';
import {
    BarChart3, Package, ShoppingCart, CreditCard, Users, Image, TrendingUp, Settings, Shield, Menu
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, mockData }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3, badge: null },
        { id: 'inventory', label: 'Inventory', icon: Package, badge: mockData.metrics.lowStockAlerts },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: mockData.metrics.pendingOrders },
        { id: 'payments', label: 'Payments', icon: CreditCard, badge: mockData.metrics.pendingPayments },
        { id: 'customers', label: 'Customers', icon: Users, badge: null },
        { id: 'content', label: 'Content', icon: Image, badge: null },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp, badge: null },
        { id: 'settings', label: 'Settings', icon: Settings, badge: null }
    ];

    return (
        <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                    </div>
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">WatchAdmin</h1>
                            <p className="text-xs text-gray-600">Luxury Management</p>
                        </div>
                    )}
                </div>
            </div>

            <nav className="px-4 pb-6">
                <ul className="space-y-2">
                    {menuItems.map(item => (
                        <li key={item.id}>
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {sidebarOpen && (
                                    <>
                                        <span className="font-medium">{item.label}</span>
                                        {item.badge && (
                                            <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;