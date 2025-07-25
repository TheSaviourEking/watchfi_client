export const mockData = {
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

export const currentUser = {
    name: 'DebarFx',
    role: 'Admin',
    permissions: ['watches', 'orders', 'customers', 'payments', 'analytics']
};