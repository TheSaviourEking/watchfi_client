import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Package,
    ShoppingCart,
    CreditCard,
    Users,
    Image,
    Settings,
    TrendingUp,
    AlertTriangle,
    Clock,
    DollarSign,
    Eye,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Bell,
    User,
    Shield,
    Menu,
    X
} from 'lucide-react';

// Mock data for demonstration
const mockData = {
    metrics: {
        totalRevenue: 2450000,
        pendingPayments: 12,
        lowStockAlerts: 8,
        activeCustomers: 1247,
        pendingOrders: 23
    },
    recentOrders: [
        { id: 'ORD-001', customer: 'WatchLover92', amount: 15500, status: 'pending_crypto', watch: 'Rolex Submariner' },
        { id: 'ORD-002', customer: 'LuxuryCollector', amount: 28900, status: 'confirmed', watch: 'Patek Philippe Nautilus' },
        { id: 'ORD-003', customer: 'TimeKeeper', amount: 8750, status: 'shipped', watch: 'Omega Speedmaster' }
    ],
    watches: [
        { id: 'W001', name: 'Rolex Submariner Date', brand: 'Rolex', price: 15500, stock: 3, status: 'active' },
        { id: 'W002', name: 'Patek Philippe Nautilus', brand: 'Patek Philippe', price: 89900, stock: 1, status: 'active' },
        { id: 'W003', name: 'Omega Speedmaster', brand: 'Omega', price: 8750, stock: 0, status: 'out_of_stock' },
        { id: 'W004', name: 'TAG Heuer Monaco', brand: 'TAG Heuer', price: 6200, stock: 5, status: 'active' }
    ],
    cryptoPayments: [
        { id: 'CP001', hash: '0x1a2b3c...', amount: 15500, type: 'USDC', confirmations: 12, status: 'confirmed' },
        { id: 'CP002', hash: '0x4d5e6f...', amount: 28900, type: 'SOL', confirmations: 8, status: 'confirming' },
        { id: 'CP003', hash: '0x7g8h9i...', amount: 8750, type: 'USDC', confirmations: 3, status: 'pending' }
    ]
};

// User roles mock data
const currentUser = {
    name: 'DebarFx',
    role: 'Admin',
    permissions: ['watches', 'orders', 'customers', 'payments', 'analytics']
};

const NewAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                            <p className="text-gray-600">Welcome back, {currentUser.name}. Here's what's happening with your watch store.</p>
                        </div>

                        {/* Metrics Grid */}
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

                        {/* Quick Actions */}
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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
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
                                    {mockData.metrics.pendingPayments}
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

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default NewAdminDashboard;