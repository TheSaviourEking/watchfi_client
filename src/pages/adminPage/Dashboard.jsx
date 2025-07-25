import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import DashboardContent from './DashboardContent.jsx';
import { mockData, currentUser } from './mockData.js';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
            />
            <div className="flex-1 flex flex-col">
                <Header 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    currentUser={currentUser} 
                    pendingPayments={mockData.metrics.pendingPayments} 
                />
                <main className="flex-1 p-6 overflow-auto">
                    <DashboardContent 
                        activeTab={activeTab} 
                        searchQuery={searchQuery} 
                        setSearchQuery={setSearchQuery} 
                        mockData={mockData} 
                        currentUser={currentUser} 
                    />
                </main>
            </div>
        </div>
    );
};

export default Dashboard;