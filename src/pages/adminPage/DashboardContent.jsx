import React from 'react';
import MetricCard from './MetricCard.jsx';
import OrderRow from './OrderRow.jsx';
import WatchRow from './WatchRow.jsx';
import PaymentRow from './PaymentRow.jsx';
import { DollarSign, Clock, AlertTriangle, Users, ShoppingCart, Plus, Search, Filter } from 'lucide-react';

const DashboardContent = ({ activeTab, searchQuery, setSearchQuery, mockData, currentUser }) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                            <p className="text-gray-600">Welcome back, {currentUser.name}. Here's what's happening with your watch store.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <MetricCard
                                title="Total Revenue"
                                value={`$${(mockData.metrics.totalRevenue / 1000000).toFixed(1)}M`}
                                icon={DollarSign}
                                trend={12.5}
                                color="green"
                            />
                            <MetricCard
                                title="Pending Payments"
                                value={mockData.metrics.pendingPayments}
                                icon={Clock}
                                color="yellow"
                            />
                            <MetricCard
                                title="Low Stock Alerts"
                                value={mockData.metrics.lowStockAlerts}
                                icon={AlertTriangle}
                                color="red"
                            />
                            <MetricCard
                                title="Active Customers"
                                value={mockData.metrics.activeCustomers}
                                icon={Users}
                                trend={8.2}
                                color="blue"
                            />
                            <MetricCard
                                title="Pending Orders"
                                value={mockData.metrics.pendingOrders}
                                icon={ShoppingCart}
                                color="purple"
                            />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
                                </div>
                                <div className="space-y-2">
                                    {mockData.recentOrders.map(order => (
                                        <OrderRow key={order.id} order={order} />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Crypto Payments</h3>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Verify All</button>
                                </div>
                                <div className="space-y-2">
                                    {mockData.cryptoPayments.map(payment => (
                                        <PaymentRow key={payment.id} payment={payment} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'inventory':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Inventory Management</h1>
                                <p className="text-gray-600">Manage your luxury watch catalog</p>
                            </div>
                            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                <Plus className="h-4 w-4" />
                                Add New Watch
                            </button>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1 max-w-md">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search watches..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <Filter className="h-4 w-4" />
                                        Filter
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-2">
                                    {mockData.watches.map(watch => (
                                        <WatchRow key={watch.id} watch={watch} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'orders':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h1>
                            <p className="text-gray-600">Process and track customer orders</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                            <div className="space-y-2">
                                {mockData.recentOrders.map(order => (
                                    <OrderRow key={order.id} order={order} />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'payments':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Management</h1>
                            <p className="text-gray-600">Monitor and verify cryptocurrency payments</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Crypto Payment Queue</h3>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                                        Auto Verify
                                    </button>
                                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
                                        Refresh All
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {mockData.cryptoPayments.map(payment => (
                                    <PaymentRow key={payment.id} payment={payment} />
                                ))}
                            </div>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
                        <p className="text-gray-600">This section is under development</p>
                    </div>
                );
        }
    };

    return renderContent();
};

export default DashboardContent;