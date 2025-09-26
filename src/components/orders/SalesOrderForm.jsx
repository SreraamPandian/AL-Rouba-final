import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, User, Phone, Mail, Building, Package, Hash, DollarSign, Clock, Save, ArrowLeft, Search, Plus, Trash2, ChevronDown } from 'lucide-react';
import DataTable from '../ui/DataTable';
import { useSalesOrders } from '../../context/SalesOrdersContext';
import { useReceivedOrders } from '../../context/ReceivedOrdersContext';

const SalesOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { salesOrders, addSalesOrder, updateSalesOrder, getSalesOrder } = useSalesOrders();
  const { orders: receivedOrders } = useReceivedOrders();

  const [formData, setFormData] = useState({
    salesOrderId: '',
    customerName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    status: 'Pending', // Will be updated based on allocation
    items: []
  });

  const [allocations, setAllocations] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [showTable, setShowTable] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const order = getSalesOrder(id);
      if (order) {
        // Pre-fill form data directly from existing sales order
        setFormData(prev => ({
          ...prev,
          salesOrderId: order.id,
          customerName: order.customer || order.customerName || '',
          contactPerson: order.contactPerson || order.customer || '',
          phone: order.phone || '',
          email: order.email || '',
          address: order.address || '',
          date: order.date || new Date().toISOString().split('T')[0],
          deliveryDate: order.deliveryDate || '',
          status: order.status || 'Pending',
          items: order.items || []
        }));
        setAllocations(order.items || []);
        // Use the linked received order id for the dropdown selection if present
        setSearchId(order.receivedOrderId || '');
        setShowTable(true);
        // If we have a received order reference and it's in the list, refresh customer details from it (authoritative)
        if (order.receivedOrderId) {
          const ro = receivedOrders.find(r => r.budgetId === order.receivedOrderId);
          if (ro) {
            setFormData(prev => ({
              ...prev,
              customerName: prev.customerName || ro.employee || '',
              contactPerson: prev.contactPerson || ro.employee || '',
              address: prev.address || ro.branch || ''
            }));
          }
        }
      }
    }
  }, [id, isEditing, getSalesOrder, receivedOrders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchOrder = () => {
    if (!searchId.trim()) return;

    // Find the selected received order
    const selectedOrder = receivedOrders.find(order => order.budgetId === searchId);

    if (selectedOrder) {
      setFormData(prev => ({
        ...prev,
        salesOrderId: searchId,
        customerName: selectedOrder.employee || '',
        contactPerson: selectedOrder.employee || '',
        phone: selectedOrder.phone || '',
        email: selectedOrder.email || '',
        address: selectedOrder.branch || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        salesOrderId: searchId
      }));
    }

    // Mock data for demonstration - in real app, this would fetch from API
    const mockItems = [
      {
        id: 1,
        partNumber: 'PT001',
        description: 'Engine Component A',
        requiredQty: 100,
        allocatedQty: 100,
        rate: 150.00,
        amount: 15000.00,
        status: 'Fully Allocated'
      },
      {
        id: 2,
        partNumber: 'PT002',
        description: 'Transmission Part B',
        requiredQty: 50,
        allocatedQty: 30,
        rate: 250.00,
        amount: 7500.00,
        status: 'Partially Allocated'
      }
    ];

    setAllocations(mockItems);
    setShowTable(true);
  };

  const handleAllocationChange = (index, field, value) => {
    const updatedAllocations = [...allocations];
    updatedAllocations[index] = {
      ...updatedAllocations[index],
      [field]: value
    };

    // Calculate amount
    if (field === 'allocatedQty' || field === 'rate') {
      const qty = field === 'allocatedQty' ? value : updatedAllocations[index].allocatedQty;
      const rate = field === 'rate' ? value : updatedAllocations[index].rate;
      updatedAllocations[index].amount = qty * rate;
    }

    // Update status based on allocation
    const required = updatedAllocations[index].requiredQty;
    const allocated = updatedAllocations[index].allocatedQty;
    updatedAllocations[index].status = allocated >= required ? 'Fully Allocated' : 'Partially Allocated';

    setAllocations(updatedAllocations);
  };

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      partNumber: '',
      description: '',
      requiredQty: 0,
      allocatedQty: 0,
      rate: 0.00,
      amount: 0.00,
      status: 'Not Allocated'
    };
    setAllocations([...allocations, newItem]);
  };

  const removeItem = (index) => {
    const updatedAllocations = allocations.filter((_, i) => i !== index);
    setAllocations(updatedAllocations);
  };

  const calculateOverallStatus = () => {
    if (allocations.length === 0) return 'Pending';

    const fullyAllocated = allocations.every(item => item.status === 'Fully Allocated');
    const hasAllocations = allocations.some(item => item.allocatedQty > 0);

    if (fullyAllocated) return 'Fully Allocated';
    if (hasAllocations) return 'Partially Allocated';
    return 'Not Allocated';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      items: allocations,
      status: calculateOverallStatus(),
      totalAmount: allocations.reduce((sum, item) => sum + item.amount, 0)
    };

    if (isEditing) {
      updateSalesOrder(parseInt(id), orderData);
    } else {
      addSalesOrder(orderData);
    }

    navigate('/sales-orders');
  };

  const allocationColumns = [
    {
      key: 'partNumber',
      label: 'Part Number',
      render: (value, row, index) => (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleAllocationChange(index, 'partNumber', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          placeholder="Enter part number"
        />
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (value, row, index) => (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleAllocationChange(index, 'description', e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          placeholder="Enter description"
        />
      )
    },
    {
      key: 'requiredQty',
      label: 'Required Qty',
      render: (value, row, index) => (
        <input
          type="number"
          value={value || 0}
          onChange={(e) => handleAllocationChange(index, 'requiredQty', parseInt(e.target.value) || 0)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          min="0"
        />
      )
    },
    {
      key: 'allocatedQty',
      label: 'Allocated Qty',
      render: (value, row, index) => (
        <input
          type="number"
          value={value || 0}
          onChange={(e) => handleAllocationChange(index, 'allocatedQty', parseInt(e.target.value) || 0)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          min="0"
        />
      )
    },
    {
      key: 'rate',
      label: 'Rate',
      render: (value, row, index) => (
        <input
          type="number"
          value={value || 0}
          onChange={(e) => handleAllocationChange(index, 'rate', parseFloat(e.target.value) || 0)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
          min="0"
          step="0.01"
        />
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value) => (
        <span className="text-sm font-medium">₹{value?.toFixed(2) || '0.00'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${value === 'Fully Allocated' ? 'bg-green-100 text-green-800' :
          value === 'Partially Allocated' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value, row, index) => (
        <button
          onClick={() => removeItem(index)}
          className="text-red-600 hover:text-red-800 p-1"
          title="Remove item"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/sales-orders')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Sales Orders
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Sales Order' : 'Create New Sales Order'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sales Order Search Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sales Order Information</h2>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Received Order ID
              </label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <select
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select Received Order ID</option>
                    {/* Ensure the currently linked received order id appears even if not in receivedOrders array */}
                    {searchId && !receivedOrders.some(o => o.budgetId === searchId) && (
                      <option value={searchId}>{searchId} (linked)</option>
                    )}
                    {receivedOrders.map((order) => (
                      <option key={order.id} value={order.budgetId}>
                        {order.budgetId} - {order.employee} ({order.branch})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
                <button
                  type="button"
                  onClick={handleSearchOrder}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                  disabled={!searchId}
                >
                  <Search size={16} />
                  <span>Load Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline mr-2" size={16} />
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline mr-2" size={16} />
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline mr-2" size={16} />
                Order Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline mr-2" size={16} />
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline mr-2" size={16} />
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter customer address"
            />
          </div>
        </div>

        {/* Order Details Columns */}
        {showTable && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="inline mr-2" size={16} />
                  Sales Order ID
                </label>
                <input
                  type="text"
                  name="salesOrderId"
                  value={formData.salesOrderId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Order Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline mr-2" size={16} />
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${calculateOverallStatus() === 'Fully Allocated' ? 'bg-green-100 text-green-800' :
                    calculateOverallStatus() === 'Partially Allocated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {calculateOverallStatus()}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline mr-2" size={16} />
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-2" size={16} />
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline mr-2" size={16} />
                  Total Amount
                </label>
                <input
                  type="text"
                  value={`₹${allocations.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Items Allocation Table */}
        {showTable && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Inventory Allocation</h2>
              <button
                type="button"
                onClick={addNewItem}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Item</span>
              </button>
            </div>

            {allocations.length > 0 ? (
              <div className="overflow-x-auto">
                <DataTable
                  data={allocations}
                  columns={allocationColumns}
                  className="min-w-full"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No items added yet. Click "Add Item" to get started.</p>
              </div>
            )}

            {allocations.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Status:
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${calculateOverallStatus() === 'Fully Allocated' ? 'bg-green-100 text-green-800' :
                    calculateOverallStatus() === 'Partially Allocated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {calculateOverallStatus()}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  Total Amount: ₹{allocations.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/sales-orders')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{isEditing ? 'Update' : 'Create'} Sales Order</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesOrderForm;
