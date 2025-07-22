import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Search, Filter, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('brands');
  const [data, setData] = useState({
    brands: [],
    categories: [],
    colors: [],
    materials: [],
    concepts: [],
    watches: [],
    customers: [],
    bookings: []
  });
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock API URL - replace with your Fastify API endpoint
  const API_BASE = 'http://localhost:3000/api';

  // Simulated data for demonstration
  useEffect(() => {
    // In real implementation, fetch data from your API
    setData({
      brands: [
        { id: '1', name: 'Rolex', logoUrl: 'https://example.com/rolex.png', createdAt: new Date().toISOString() },
        { id: '2', name: 'Omega', logoUrl: 'https://example.com/omega.png', createdAt: new Date().toISOString() }
      ],
      categories: [
        { id: '1', name: 'Luxury', createdAt: new Date().toISOString() },
        { id: '2', name: 'Sport', createdAt: new Date().toISOString() }
      ],
      colors: [
        { id: '1', name: 'Silver', hex: '#C0C0C0', createdAt: new Date().toISOString() },
        { id: '2', name: 'Gold', hex: '#FFD700', createdAt: new Date().toISOString() }
      ],
      materials: [
        { id: '1', name: 'Stainless Steel', createdAt: new Date().toISOString() },
        { id: '2', name: 'Titanium', createdAt: new Date().toISOString() }
      ],
      concepts: [
        { id: '1', name: 'Classic', createdAt: new Date().toISOString() },
        { id: '2', name: 'Modern', createdAt: new Date().toISOString() }
      ],
      watches: [
        {
          id: '1',
          name: 'Submariner',
          price: 8500,
          referenceCode: 'REF-001',
          description: 'Iconic diving watch',
          primaryPhotoUrl: 'https://example.com/submariner.jpg',
          brandId: '1',
          stockQuantity: 5,
          isAvailable: true,
          createdAt: new Date().toISOString()
        }
      ],
      customers: [],
      bookings: []
    });
  }, []);

  const tabs = [
    { key: 'brands', label: 'Brands', icon: '🏷️' },
    { key: 'categories', label: 'Categories', icon: '📂' },
    { key: 'colors', label: 'Colors', icon: '🎨' },
    { key: 'materials', label: 'Materials', icon: '⚙️' },
    { key: 'concepts', label: 'Concepts', icon: '💡' },
    { key: 'watches', label: 'Watches', icon: '⌚' },
    { key: 'customers', label: 'Customers', icon: '👥' },
    { key: 'bookings', label: 'Bookings', icon: '📋' }
  ];

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        // Update existing item
        const response = await fetch(`${API_BASE}/${activeTab}/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const updatedItem = await response.json();
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].map(item =>
              item.id === editingItem.id ? updatedItem : item
            )
          }));
        }
      } else {
        // Create new item
        const response = await fetch(`${API_BASE}/${activeTab}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (response.ok) {
          const newItem = await response.json();
          setData(prev => ({
            ...prev,
            [activeTab]: [...prev[activeTab], newItem]
          }));
        }
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`${API_BASE}/${activeTab}/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setData(prev => ({
            ...prev,
            [activeTab]: prev[activeTab].filter(item => item.id !== id)
          }));
        }
      } catch (error) {
        console.error('Error deleting data:', error);
        alert('Error deleting data. Please try again.');
      }
    }
  };

  const filteredData = data[activeTab].filter(item => {
    const matchesSearch = Object.values(item).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );

    let matchesFilter = true;
    if (filterStatus !== 'all') {
      if (activeTab === 'watches') {
        matchesFilter = filterStatus === 'available' ? item.isAvailable : !item.isAvailable;
      } else if (activeTab === 'bookings') {
        matchesFilter = item.status === filterStatus;
      }
    }

    return matchesSearch && matchesFilter;
  });

  const renderForm = () => {
    if (!showForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditingItem(null); }}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <FormComponent
            type={activeTab}
            initialData={editingItem}
            onSubmit={handleSubmit}
            brands={data.brands}
            categories={data.categories}
            colors={data.colors}
            materials={data.materials}
            concepts={data.concepts}
          />
        </div>
      </div>
    );
  };

  const renderTable = () => {
    const columns = getColumns(activeTab);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(col => (
                  <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {columns.map(col => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderCell(item, col)}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => { setEditingItem(item); setShowForm(true); }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No {activeTab} found</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Watch Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage your watch inventory and orders</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {(activeTab === 'watches' || activeTab === 'bookings') && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                {activeTab === 'watches' && (
                  <>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </>
                )}
                {activeTab === 'bookings' && (
                  <>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
              </select>
            )}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New {activeTab.slice(0, -1)}
          </button>
        </div>

        {/* Data Table */}
        {renderTable()}
      </div>

      {/* Form Modal */}
      {renderForm()}
    </div>
  );
};

// Form Component
const FormComponent = ({ type, initialData, onSubmit, brands, categories, colors, materials, concepts }) => {
  const [formData, setFormData] = useState(initialData || {});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field) => {
    const commonClasses = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500";

    switch (field.type) {
      case 'text':
      case 'email':
        return (
          <input
            type={field.type}
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={commonClasses}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            rows={3}
            className={commonClasses}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            step={field.step || "1"}
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, parseFloat(e.target.value) || 0)}
            className={commonClasses}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={commonClasses}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={formData[field.key] || false}
            onChange={(e) => handleInputChange(field.key, e.target.checked)}
            className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        );

      case 'color':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={formData[field.key] || '#000000'}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              className="mt-1 h-10 w-20 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={formData[field.key] || ''}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder="#000000"
              className="mt-1 flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        );

      default:
        return (
          <input
            type="text"
            value={formData[field.key] || ''}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={commonClasses}
          />
        );
    }
  };

  const fields = getFormFields(type, { brands, categories, colors, materials, concepts });

  return (
    <div className="space-y-6">
      {fields.map(field => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => { setShowForm(false); setEditingItem(null); }}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSubmit(formData)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};

// Helper functions
const getColumns = (type) => {
  const columnMap = {
    brands: [
      { key: 'name', label: 'Name' },
      { key: 'logoUrl', label: 'Logo URL' },
      { key: 'createdAt', label: 'Created' }
    ],
    categories: [
      { key: 'name', label: 'Name' },
      { key: 'createdAt', label: 'Created' }
    ],
    colors: [
      { key: 'name', label: 'Name' },
      { key: 'hex', label: 'Hex Code' },
      { key: 'createdAt', label: 'Created' }
    ],
    materials: [
      { key: 'name', label: 'Name' },
      { key: 'createdAt', label: 'Created' }
    ],
    concepts: [
      { key: 'name', label: 'Name' },
      { key: 'createdAt', label: 'Created' }
    ],
    watches: [
      { key: 'name', label: 'Name' },
      { key: 'referenceCode', label: 'Reference' },
      { key: 'price', label: 'Price' },
      { key: 'stockQuantity', label: 'Stock' },
      { key: 'isAvailable', label: 'Available' }
    ],
    customers: [
      { key: 'pseudonym', label: 'Pseudonym' },
      { key: 'walletAddress', label: 'Wallet' },
      { key: 'createdAt', label: 'Joined' }
    ],
    bookings: [
      { key: 'id', label: 'ID' },
      { key: 'totalPrice', label: 'Total' },
      { key: 'status', label: 'Status' },
      { key: 'paymentStatus', label: 'Payment' },
      { key: 'createdAt', label: 'Created' }
    ]
  };
  return columnMap[type] || [];
};

const getFormFields = (type, options) => {
  const fieldMap = {
    brands: [
      { key: 'name', label: 'Brand Name', type: 'text', required: true },
      { key: 'logoUrl', label: 'Logo URL', type: 'text' }
    ],
    categories: [
      { key: 'name', label: 'Category Name', type: 'text', required: true }
    ],
    colors: [
      { key: 'name', label: 'Color Name', type: 'text', required: true },
      { key: 'hex', label: 'Hex Code', type: 'color', required: true }
    ],
    materials: [
      { key: 'name', label: 'Material Name', type: 'text', required: true }
    ],
    concepts: [
      { key: 'name', label: 'Concept Name', type: 'text', required: true }
    ],
    watches: [
      { key: 'name', label: 'Watch Name', type: 'text', required: true },
      { key: 'referenceCode', label: 'Reference Code', type: 'text', required: true },
      { key: 'price', label: 'Price', type: 'number', step: '0.01', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'primaryPhotoUrl', label: 'Primary Photo URL', type: 'text' },
      {
        key: 'brandId',
        label: 'Brand',
        type: 'select',
        required: true,
        options: options.brands.map(b => ({ value: b.id, label: b.name }))
      },
      { key: 'stockQuantity', label: 'Stock Quantity', type: 'number', required: true },
      { key: 'isAvailable', label: 'Available', type: 'checkbox' }
    ],
    customers: [
      { key: 'pseudonym', label: 'Pseudonym', type: 'text', required: true },
      { key: 'walletAddress', label: 'Wallet Address', type: 'text', required: true }
    ],
    bookings: [
      { key: 'totalPrice', label: 'Total Price', type: 'number', step: '0.01', required: true },
      { key: 'discount', label: 'Discount', type: 'number', step: '0.01' },
      {
        key: 'paymentStatus',
        label: 'Payment Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'completed', label: 'Completed' },
          { value: 'failed', label: 'Failed' }
        ]
      },
      {
        key: 'status',
        label: 'Order Status',
        type: 'select',
        options: [
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'shipped', label: 'Shipped' },
          { value: 'delivered', label: 'Delivered' },
          { value: 'cancelled', label: 'Cancelled' }
        ]
      },
      { key: 'shipmentAddress', label: 'Shipment Address', type: 'textarea' }
    ]
  };
  return fieldMap[type] || [];
};

const renderCell = (item, col) => {
  const value = item[col.key];

  if (col.key === 'createdAt' || col.key === 'updatedAt') {
    return new Date(value).toLocaleDateString();
  }

  if (col.key === 'price' || col.key === 'totalPrice') {
    return `${value?.toFixed(2) || '0.00'}`;
  }

  if (col.key === 'isAvailable') {
    return value ? '✅' : '❌';
  }

  if (col.key === 'hex') {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-gray-300"
          style={{ backgroundColor: value }}
        />
        <span>{value}</span>
      </div>
    );
  }

  if (col.key === 'logoUrl' || col.key === 'primaryPhotoUrl') {
    return value ? (
      <img src={value} alt="Preview" className="w-10 h-10 object-cover rounded" />
    ) : (
      <span className="text-gray-400">No image</span>
    );
  }

  if (col.key === 'walletAddress') {
    return value ? `${value.slice(0, 6)}...${value.slice(-4)}` : '';
  }

  return value || '-';
};

export default AdminDashboard;