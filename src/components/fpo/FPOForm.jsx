import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, Send, Download, Plus, Trash2, Truck, Calendar, User, Building, MapPin } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { faker } from '@faker-js/faker';
import { useSalesOrders } from '../../context/SalesOrdersContext';

const FPOForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const { salesOrders } = useSalesOrders();
  const salesOrderItem = location.state?.salesOrderItem;
  const isEdit = !!id || id === 'FPO-2024-001';
  const isManager = user?.role === 'Sales Manager';

  // Generate comprehensive dummy data
  const generateDummyFPO = (fpoId) => {
    const vendors = [
      'Steel Dynamics Corp', 'Industrial Metals Ltd', 'Global Suppliers Inc',
      'Premier Materials Co', 'Advanced Components Ltd', 'Quality Parts Pvt Ltd'
    ];

    const products = [
      { name: 'Steel Rod - Grade A40', code: 'STL-A40-001', unit: 'PCS' },
      { name: 'Cement Bags - OPC 53', code: 'CEM-OPC-053', unit: 'BAGS' },
      { name: 'Wire Mesh - 8mm', code: 'WM-8MM-001', unit: 'SQM' },
      { name: 'Reinforcement Bars', code: 'RB-12MM-001', unit: 'MT' },
      { name: 'Aluminum Sheets', code: 'AL-SHT-001', unit: 'PCS' }
    ];

    const createdDate = faker.date.recent({ days: 15 });
    const expectedDelivery = new Date(createdDate);
    expectedDelivery.setDate(expectedDelivery.getDate() + faker.number.int({ min: 7, max: 30 }));

    return {
      id: fpoId || `FPO-2024-${String(faker.number.int({ min: 1, max: 150 })).padStart(3, '0')}`,
      salesOrderId: 'SO-2024-021',
      status: faker.helpers.arrayElement(['Draft', 'Submitted', 'Approved', 'Vendor Confirmed', 'In Transit', 'Delivered']),
      vendor: faker.helpers.arrayElement(vendors),
      vendorContact: faker.person.fullName(),
      vendorEmail: faker.internet.email(),
      vendorPhone: faker.phone.number(),
      leadTime: faker.number.int({ min: 7, max: 45 }),
      createdDate: createdDate.toLocaleDateString(),
      createdBy: faker.person.fullName(),
      approvedBy: user?.role === 'Sales Manager' ? user.name : 'Sarah Johnson - Sales Manager',
      approvedDate: faker.date.recent({ days: 10 }).toLocaleDateString(),
      expectedDelivery: expectedDelivery.toLocaleDateString(),
      shippingAddress: `AL Rouba Warehouse\n123 Industrial Avenue\nMetro City, State 12345\nCountry`,
      billingAddress: `AL Rouba Enterprises\n456 Business District\nMetro City, State 12345\nCountry`,
      paymentTerms: faker.helpers.arrayElement(['Net 30', 'Net 60', '50% Advance, 50% on Delivery', 'LC at Sight']),
      currency: faker.helpers.arrayElement(['USD', 'EUR', 'INR']),
      taxRate: faker.number.float({ min: 5, max: 18, multipleOf: 0.5 }),
      notes: 'Material should meet industry standards. Delivery to be coordinated with warehouse team.',
      items: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, index) => {
        const product = faker.helpers.arrayElement(products);
        const quantity = faker.number.int({ min: 10, max: 500 });
        const rate = faker.number.float({ min: 15, max: 250, multipleOf: 0.01 });
        return {
          id: index + 1,
          product: product.name,
          productCode: product.code,
          description: faker.commerce.productDescription(),
          quantity,
          unit: product.unit,
          vendorRate: rate,
          currency: 'USD',
          total: quantity * rate,
          deliveryDate: expectedDelivery.toLocaleDateString(),
          specifications: faker.helpers.arrayElement([
            'Grade A quality, ISI certified',
            'Standard industry specifications',
            'Custom specifications as per drawing',
            'Premium quality, tested and certified'
          ])
        };
      })
    };
  };

  const [fpo, setFpo] = useState(() => {
    if (isEdit && id === 'FPO-2024-001') {
      return generateDummyFPO('FPO-2024-001');
    } else if (isEdit) {
      return generateDummyFPO(id);
    } else {
      return {
        id: 'DRAFT',
        salesOrderId: salesOrderItem?.salesOrderId || 'SO-2024-021',
        status: 'Draft',
        vendor: '',
        vendorContact: '',
        vendorEmail: '',
        vendorPhone: '',
        // salesOrderId will be chosen in Order Details section for new FPO
        createdDate: new Date().toLocaleDateString(),
        createdBy: user?.name || 'Current User',
        expectedDelivery: '',
        shippingAddress: 'AL Rouba Warehouse\n123 Industrial Avenue\nMetro City, State 12345\nCountry',
        billingAddress: 'AL Rouba Enterprises\n456 Business District\nMetro City, State 12345\nCountry',
        paymentTerms: 'Net 30',
        currency: 'USD',
        taxRate: 10,
        notes: '',
        items: salesOrderItem ? [{
          id: 1,
          product: salesOrderItem.product,
          productCode: salesOrderItem.code,
          quantity: salesOrderItem.requestedQty,
          unit: 'PCS',
          vendorRate: 0,
          currency: 'USD',
          total: 0,
          specifications: ''
        }] : []
      };
    }
  });

  const handleInputChange = (field, value) => {
    setFpo(prev => ({ ...prev, [field]: value }));
  };

  const loadSalesOrderDetails = (soId) => {
    if (!soId) return;
    // Try find existing sales order
    const so = salesOrders.find(o => o.id === soId);
    if (so) {
      // Map sales order items into FPO items shape
      const mappedItems = (so.items || []).map((it, idx) => ({
        id: idx + 1,
        product: it.product,
        productCode: it.code,
        quantity: it.requestedQty || it.allocatedQty || 0,
        unit: 'PCS',
        vendorRate: 0,
        currency: 'USD',
        total: 0,
        specifications: ''
      }));
      setFpo(prev => ({
        ...prev,
        salesOrderId: soId,
        vendor: prev.vendor || faker.company.name(),
        vendorContact: prev.vendorContact || faker.person.fullName(),
        vendorEmail: prev.vendorEmail || faker.internet.email(),
        vendorPhone: prev.vendorPhone || faker.phone.number(),
        items: mappedItems.length ? mappedItems : prev.items
      }));
      return;
    }
    // Fallback dummy if SO not found
    const dummyItems = [
      { id: 1, product: 'Generic Component A', productCode: 'GEN-A', quantity: 50, unit: 'PCS', vendorRate: 0, currency: 'USD', total: 0, specifications: '' },
      { id: 2, product: 'Generic Component B', productCode: 'GEN-B', quantity: 120, unit: 'PCS', vendorRate: 0, currency: 'USD', total: 0, specifications: '' }
    ];
    setFpo(prev => ({
      ...prev,
      salesOrderId: soId,
      vendor: prev.vendor || faker.company.name(),
      vendorContact: prev.vendorContact || faker.person.fullName(),
      vendorEmail: prev.vendorEmail || faker.internet.email(),
      vendorPhone: prev.vendorPhone || faker.phone.number(),
      items: dummyItems
    }));
  };

  // On mount (edit mode) ensure linked sales order data is loaded
  useEffect(() => {
    if (isEdit && fpo.salesOrderId) {
      loadSalesOrderDetails(fpo.salesOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  const handleItemChange = (itemId, field, value) => {
    setFpo(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'vendorRate') {
            updatedItem.total = updatedItem.quantity * updatedItem.vendorRate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const addItem = () => {
    const newItem = {
      id: fpo.items.length + 1,
      product: '',
      productCode: '',
      description: '',
      quantity: 0,
      unit: 'PCS',
      vendorRate: 0,
      currency: fpo.currency,
      total: 0,
      specifications: ''
    };
    setFpo(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (itemId) => {
    setFpo(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const submitForApproval = () => {
    setFpo(prev => ({ ...prev, status: 'Submitted' }));
    alert('FPO submitted for approval.');
  };

  const approveFPO = () => {
    setFpo(prev => ({
      ...prev,
      status: 'Approved',
      approvedBy: user?.name,
      approvedDate: new Date().toLocaleDateString()
    }));
    alert('FPO has been approved.');
  };

  const calculateSubtotal = () => {
    return fpo.items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (fpo.taxRate / 100);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? `FPO ${fpo.id}` : 'New FPO'}
            </h1>
            <p className="text-gray-600">Linked to Sales Order: {fpo.salesOrderId}</p>
            {fpo.createdDate && (
              <p className="text-sm text-gray-500">
                Created on {fpo.createdDate} by {fpo.createdBy}
              </p>
            )}
          </div>
          <StatusBadge status={fpo.status} />
        </div>
        <div className="flex items-center space-x-3">
          {user.role !== 'Sales Manager' && fpo.status === 'Draft' && (
            <>
              <button
                onClick={() => handleInputChange('status', 'Draft')}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Save className="h-4 w-4 mr-2" />Save Draft
              </button>
              <button
                onClick={submitForApproval}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />Submit for Approval
              </button>
            </>
          )}
          {isManager && fpo.status === 'Submitted' && (
            <button
              onClick={approveFPO}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-2" />Approve FPO
            </button>
          )}
          {fpo.status === 'Approved' && (
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Truck className="h-4 w-4 mr-2" />Track Shipment
            </button>
          )}
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />Download PDF
          </button>
        </div>
      </div>

      {/* FPO Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-gray-600" />
            Vendor Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
              <input
                type="text"
                placeholder="Select Vendor"
                value={fpo.vendor}
                onChange={e => handleInputChange('vendor', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={fpo.vendorContact}
                  onChange={e => handleInputChange('vendorContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={fpo.vendorPhone}
                  onChange={e => handleInputChange('vendorPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={fpo.vendorEmail}
                onChange={e => handleInputChange('vendorEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-600" />
            Order Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order</label>
                <input
                  list="salesOrderOptions"
                  type="text"
                  value={fpo.salesOrderId}
                  onChange={e => {
                    handleInputChange('salesOrderId', e.target.value);
                    if (e.target.value.trim()) {
                      loadSalesOrderDetails(e.target.value.trim());
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select or enter Sales Order ID"
                />
                <datalist id="salesOrderOptions">
                  {salesOrders.map(so => (
                    <option key={so.id} value={so.id}>{so.id} - {so.customer}</option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
                <input
                  type="date"
                  value={fpo.expectedDelivery}
                  onChange={e => handleInputChange('expectedDelivery', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select
                  value={fpo.paymentTerms}
                  onChange={e => handleInputChange('paymentTerms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Net 30">Net 30</option>
                  <option value="Net 60">Net 60</option>
                  <option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</option>
                  <option value="LC at Sight">LC at Sight</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={fpo.currency}
                  onChange={e => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            {fpo.approvedBy && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <strong>Approved by:</strong> {fpo.approvedBy} on {fpo.approvedDate}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shipping & Billing Addresses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-gray-600" />
            Shipping Address
          </h2>
          <textarea
            rows="4"
            value={fpo.shippingAddress}
            onChange={e => handleInputChange('shippingAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Building className="h-5 w-5 mr-2 text-gray-600" />
            Billing Address
          </h2>
          <textarea
            rows="4"
            value={fpo.billingAddress}
            onChange={e => handleInputChange('billingAddress', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Items to Procure */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Items to Procure</h2>
          {fpo.status === 'Draft' && (
            <button
              onClick={addItem}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate ({fpo.currency})</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                {fpo.status === 'Draft' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fpo.items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{item.product}</div>
                      <div className="text-sm text-gray-500">Code: {item.productCode}</div>
                      {item.specifications && (
                        <div className="text-xs text-gray-400 mt-1">{item.specifications}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {fpo.status === 'Draft' ? (
                      <textarea
                        rows="2"
                        value={item.description || ''}
                        onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Item description..."
                      />
                    ) : (
                      <div className="text-sm text-gray-600">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {fpo.status === 'Draft' ? (
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-medium">{item.quantity.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                  <td className="px-6 py-4">
                    {fpo.status === 'Draft' ? (
                      <input
                        type="number"
                        step="0.01"
                        value={item.vendorRate}
                        onChange={e => handleItemChange(item.id, 'vendorRate', parseFloat(e.target.value) || 0)}
                        className="w-28 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="font-medium">{item.vendorRate.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    {fpo.currency} {(item.total || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.deliveryDate || fpo.expectedDelivery}
                  </td>
                  {fpo.status === 'Draft' && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {fpo.items.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Plus className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-lg font-medium">No items added yet</p>
                      <p className="text-sm">Click "Add Item" to start adding products to this FPO</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        {fpo.items.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{fpo.currency} {calculateSubtotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({fpo.taxRate}%):</span>
                    <span className="font-medium">{fpo.currency} {calculateTax().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total:</span>
                      <span className="text-blue-600">{fpo.currency} {calculateGrandTotal().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Notes & Terms</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
            <input
              type="number"
              step="0.5"
              value={fpo.taxRate}
              onChange={e => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
            <textarea
              rows="4"
              value={fpo.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special requirements, quality standards, delivery instructions..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPOForm;
