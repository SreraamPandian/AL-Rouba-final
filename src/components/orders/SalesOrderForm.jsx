import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, User, Phone, Mail, Building, Package, Hash, DollarSign, Clock, Save, ArrowLeft, Search, Plus, Trash2, ChevronDown } from 'lucide-react';
import DataTable from '../ui/DataTable';
import ProductDropdown from '../ui/ProductDropdown';
import BlockRequestModal from '../inventory/BlockRequestModal';
import { useSalesOrders } from '../../context/SalesOrdersContext';
import { useReceivedOrders } from '../../context/ReceivedOrdersContext';

const SalesOrderForm = ({ isModal = false, onClose }) => {
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
  const [selectedRows, setSelectedRows] = useState([]); // store item ids
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockItem, setBlockItem] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [showTable, setShowTable] = useState(true);

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
        partNumber: 'COMP-001',
        description: 'High-Performance Processor',
        requiredQty: 50,
        availableQty: 75,
        blockedQty: 10,
        allocatedQty: 0,
        rate: 150.00,
        amount: 15000.00,
        status: 'Fully Allocated'
      },
      {
        id: 2,
        partNumber: 'MEM-002',
        description: 'DDR5 Memory Module',
        requiredQty: 100,
        availableQty: 80,
        blockedQty: 0,
        allocatedQty: 0,
        rate: 100.00,
        amount: 10000.00,
        status: 'Partially Allocated'
      },
      {
        id: 3,
        partNumber: 'STO-003',
        description: 'NVMe SSD Drive',
        requiredQty: 25,
        availableQty: 0,
        blockedQty: 0,
        allocatedQty: 0,
        rate: 200.00,
        amount: 0,
        status: 'Backordered'
      },
      {
        id: 4,
        partNumber: 'CASE-007',
        description: 'Server Casing',
        requiredQty: 10,
        availableQty: 10,
        blockedQty: 0,
        allocatedQty: 0,
        rate: 75.00,
        amount: 0,
        status: 'Fully Allocated'
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
      availableQty: 0,
      blockedQty: 0,
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

    if (isModal && typeof onClose === 'function') {
      onClose();
    } else {
      navigate('/sales-orders');
    }
  };

  // Helpers for UI rendering
  const getAllocatable = (item) => Math.max(0, (item.availableQty || 0) - (item.blockedQty || 0));
  const getLineStatus = (item) => {
    if (getAllocatable(item) === 0) return 'Backordered';
    if ((item.allocatedQty || 0) >= (item.requiredQty || 0) && (item.requiredQty || 0) > 0) return 'Fully Allocated';
    if ((item.allocatedQty || 0) > 0) return 'Partially Allocated';
    return 'Not Allocated';
  };
  const statusClass = (value) => (
    value === 'Fully Allocated' ? 'bg-green-100 text-green-800' :
      value === 'Partially Allocated' ? 'bg-yellow-100 text-yellow-800' :
        value === 'Backordered' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {!isModal && (
            <button
              onClick={() => navigate('/sales-orders')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} className="mr-1" />
              Back to Sales Orders
            </button>
          )}
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Direct Sales Order' : 'Create Direct Sales Order'}
          </h1>
        </div>
      </div>

      <form id={isModal ? 'sales-order-form-modal' : undefined} onSubmit={handleSubmit} className="space-y-6">
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
                  <input
                    type="text"
                    list="received-order-ids"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Type or choose Received Order ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <datalist id="received-order-ids">
                    {searchId && !receivedOrders.some(o => o.budgetId === searchId) && (
                      <option value={searchId} />
                    )}
                    {receivedOrders.map((order) => (
                      <option key={order.id} value={order.budgetId} />
                    ))}
                  </datalist>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Sales Order ID"
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
                <table className="min-w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">
                        <input
                          type="checkbox"
                          checked={selectedRows.length > 0 && selectedRows.length === allocations.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows(allocations.map(a => a.id));
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Requested</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Available</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Blocked</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Allocatable</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Allocate Qty</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Line Status</th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allocations.map((item, index) => {
                      const allocatable = getAllocatable(item);
                      const status = getLineStatus(item);
                      const rowBg = status === 'Partially Allocated' ? 'bg-yellow-50' : '';
                      return (
                        <tr key={item.id} className={`border-b border-gray-200 ${rowBg}`}>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(item.id)}
                              onChange={(e) => {
                                setSelectedRows(prev => {
                                  if (e.target.checked) return [...new Set([...prev, item.id])];
                                  return prev.filter(id => id !== item.id);
                                });
                              }}
                            />
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="mb-2">
                              <ProductDropdown
                                value={item.description || ''}
                                onProductSelect={(product) => {
                                  const updated = [...allocations];
                                  const current = { ...updated[index] };
                                  current.description = product.name;
                                  current.partNumber = product.id;
                                  // If rate exists in allocation logic, set it from product price
                                  if (typeof current.rate !== 'undefined') {
                                    current.rate = product.price;
                                    current.amount = (current.allocatedQty || 0) * (current.rate || 0);
                                  }
                                  updated[index] = current;
                                  setAllocations(updated);
                                }}
                                placeholder="Select product..."
                                className="w-full"
                              />
                            </div>
                            <div className="text-xs text-gray-500">Code: {item.partNumber || '—'}</div>
                          </td>
                          <td className="px-4 py-3 text-center font-medium">{item.requiredQty || 0}</td>
                          <td className="px-4 py-3 text-center">{item.availableQty || 0}</td>
                          <td className="px-4 py-3 text-center">{item.blockedQty || 0}</td>
                          <td className="px-4 py-3 text-center font-semibold">{allocatable}</td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="number"
                              value={item.allocatedQty || 0}
                              onChange={(e) => handleAllocationChange(index, 'allocatedQty', parseInt(e.target.value) || 0)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded"
                              min="0"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(status)}`}>{status}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                type="button"
                                className="px-3 py-1 text-purple-700 border border-purple-400 rounded-md hover:bg-purple-50 text-xs"
                                onClick={() => {
                                  setBlockItem({
                                    product: item.description,
                                    code: item.partNumber,
                                    requestedQty: item.requiredQty,
                                    availableQty: item.availableQty,
                                    blockedQty: item.blockedQty
                                  }); setBlockModalOpen(true);
                                }}
                              >
                                Block
                              </button>
                              <button
                                type="button"
                                className="px-3 py-1 text-orange-700 border border-orange-400 rounded-md hover:bg-orange-50 text-xs"
                                onClick={() => navigate('/fpo/new', { state: { salesOrderItem: item } })}
                              >
                                FPO
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                  Total Amount: ₹{allocations.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}
                </div>
              </div>
            )}

            {/* Footer actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <>
                    <button
                      type="button"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      onClick={() => {
                        const selected = allocations.filter(a => selectedRows.includes(a.id));
                        const target = (selected[0] || allocations[0]);
                        if (target) {
                          setBlockItem({
                            product: target.description,
                            code: target.partNumber,
                            requestedQty: target.requiredQty,
                            availableQty: target.availableQty,
                            blockedQty: target.blockedQty
                          });
                          setBlockModalOpen(true);
                        }
                      }}
                    >
                      Block Selected
                    </button>
                    {/* FPO for Selected removed - creation of FPO from multiple selected items disabled per new UX */}
                  </>
                )}
              </div>
              {/* Navigation buttons removed per request */}
            </div>
          </div>
        )}

        {/* Form Actions - modal uses sticky footer so it's always visible */}
        {isModal ? (
          <div className="sticky bottom-0 left-0 w-full bg-white border-t py-4 flex justify-end space-x-3 px-6 z-40">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Close</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Save size={16} /><span>Create Sale Order</span></button>
          </div>
        ) : (
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
        )}
      </form>
      {blockModalOpen && blockItem && (
        <BlockRequestModal item={blockItem} onClose={() => setBlockModalOpen(false)} onSubmit={() => { setBlockModalOpen(false); navigate('/blocking'); }} />
      )}
    </div>
  );
};

export default SalesOrderForm;
