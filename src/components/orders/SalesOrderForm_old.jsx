import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useSalesOrders } from '../../context/SalesOrdersContext';

const SalesOrderForm = ({ isModal = false, onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSalesOrder, updateSalesOrder } = useSalesOrders();

  // State for the order being edited
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    customer: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    deliveryDate: '',
    items: []
  });

  // Load order data when component mounts
  useEffect(() => {
    if (id) {
      const order = getSalesOrder(id);
      if (order) {
        setOrderData(order);
        setFormData({
          customer: order.customer || '',
          contactPerson: order.contactPerson || '',
          phone: order.phone || '',
          email: order.email || '',
          address: order.address || '',
          deliveryDate: order.deliveryDate || '',
          items: order.items || []
        });
      }
      setLoading(false);
    }
  }, [id, getSalesOrder]);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle item changes
  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Add new item
  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: prev.items.length + 1,
        product: '',
        code: '',
        requestedQty: 0,
        availableQty: 0,
        allocatedQty: 0,
        lineStatus: 'Not Allocated'
      }]
    }));
  };

  // Remove item
  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      // Calculate total value
      const totalValue = formData.items.reduce((sum, item) =>
        sum + (item.allocatedQty * 100), 0 // Simplified calculation
      );

      // Calculate status based on items
      const calculateStatus = (items) => {
        if (!items || items.length === 0) return 'Draft';
        const fullyAllocated = items.filter(item => item.allocatedQty >= item.requestedQty);
        const partiallyAllocated = items.filter(item => item.allocatedQty > 0 && item.allocatedQty < item.requestedQty);

        if (fullyAllocated.length === items.length) return 'Fully Allocated';
        if (fullyAllocated.length > 0 || partiallyAllocated.length > 0) return 'Partially Allocated';
        return 'Pending Allocation';
      };

      const updatedOrder = {
        ...orderData,
        ...formData,
        totalValue,
        status: calculateStatus(formData.items)
      };

      updateSalesOrder(id, updatedOrder);

      alert('Sales Order updated successfully!');

      if (isModal && onClose) {
        onClose();
      } else {
        navigate('/sales-orders');
      }
    } catch (error) {
      console.error('Error updating sales order:', error);
      alert('Error updating sales order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading order details...</div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Order not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {!isModal && (
            <button
              onClick={() => navigate('/sales-orders')}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Sales Order</h1>
            <p className="text-gray-600">Order ID: {orderData.id}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          {isModal && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Order Details Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date *</label>
            <input
              type="date"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
          <button
            onClick={addItem}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={item.code}
                      onChange={(e) => handleItemChange(index, 'code', e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.requestedQty}
                      onChange={(e) => handleItemChange(index, 'requestedQty', parseInt(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded"
                      min="0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.availableQty}
                      onChange={(e) => handleItemChange(index, 'availableQty', parseInt(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded"
                      min="0"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      value={item.allocatedQty}
                      onChange={(e) => handleItemChange(index, 'allocatedQty', parseInt(e.target.value) || 0)}
                      className="w-20 p-1 border border-gray-300 rounded"
                      min="0"
                      max={item.availableQty}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.allocatedQty >= item.requestedQty
                      ? 'bg-green-100 text-green-800'
                      : item.allocatedQty > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {item.allocatedQty >= item.requestedQty
                        ? 'Fully Allocated'
                        : item.allocatedQty > 0
                          ? 'Partially Allocated'
                          : 'Not Allocated'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total Items: {formData.items.length}</span>
          <span className="text-lg font-semibold">
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderForm;
