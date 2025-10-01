import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Upload, Lock, Settings } from 'lucide-react';
import { useSalesOrders } from '../../context/SalesOrdersContext';

const CreateNewSaleOrder = () => {
    const navigate = useNavigate();
    const { addSalesOrder } = useSalesOrders();

    const [formData, setFormData] = useState({
        salesOrderNo: '',
        customerName: '',
        expectedDeliveryDate: '',
        salesOrderDate: new Date().toISOString().split('T')[0],
        salesRepresentative: '',
        status: 'Draft'
    });

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showProductTable, setShowProductTable] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedProductForBlock, setSelectedProductForBlock] = useState(null);

    // Sample sales orders for dropdown
    const [salesOrders] = useState([
        { id: 'SO-2024-001', customer: 'Tech Solutions Inc.', deliveryDate: '2025-10-15' },
        { id: 'SO-2024-002', customer: 'Digital Systems Ltd.', deliveryDate: '2025-10-20' },
        { id: 'SO-2024-003', customer: 'Enterprise Corp', deliveryDate: '2025-11-01' }
    ]);

    // Sample customers for dropdown
    const [customers] = useState([
        'Tech Solutions Inc.',
        'Digital Systems Ltd.',
        'Enterprise Corp',
        'Innovation Partners',
        'Future Tech LLC'
    ]);

    // Sample sales representatives for dropdown
    const [salesRepresentatives] = useState([
        'John Smith',
        'Sarah Johnson',
        'Michael Brown',
        'Emily Davis',
        'David Wilson',
        'Lisa Anderson'
    ]);

    const [products, setProducts] = useState([
        {
            id: 1,
            name: 'High-Performance Processor (COMP-001)',
            requested: 50,
            available: 75,
            blocked: 10,
            allocatable: 65,
            allocated: 0,
            lineStatus: 'Pending'
        },
        {
            id: 2,
            name: 'DDR5 Memory Module (MEM-002)',
            requested: 100,
            available: 80,
            blocked: 0,
            allocatable: 80,
            allocated: 0,
            lineStatus: 'Pending'
        },
        {
            id: 3,
            name: 'NVMe SSD Drive (STO-003)',
            requested: 25,
            available: 0,
            blocked: 0,
            allocatable: 0,
            allocated: 0,
            lineStatus: 'Pending'
        },
        {
            id: 4,
            name: 'Server Casing (CASE-007)',
            requested: 10,
            available: 10,
            blocked: 0,
            allocatable: 10,
            allocated: 0,
            lineStatus: 'Pending'
        }
    ]);

    const [shippingInstructions, setShippingInstructions] = useState('');

    const handleAllocatedQtyChange = (productId, value) => {
        setProducts(prev => prev.map(product =>
            product.id === productId
                ? { ...product, allocated: Math.min(parseInt(value) || 0, product.allocatable) }
                : product
        ));
    };

    const handleAllocateAll = () => {
        setProducts(prev => prev.map(product => ({
            ...product,
            allocated: product.allocatable
        })));
    };

    const handleGenerateSalesOrder = () => {
        // Validate required fields
        if (!formData.salesOrderNo || !formData.customerName || !formData.expectedDeliveryDate) {
            alert('Please fill in all required fields (Sales Order No., Customer Name, Expected Delivery Date)');
            return;
        }

        // Calculate total value from allocated products
        const allocatedProducts = products.filter(p => p.allocated > 0);
        if (allocatedProducts.length === 0) {
            alert('Please allocate at least one product before generating the sales order.');
            return;
        }

        const totalValue = allocatedProducts.reduce((sum, product) => {
            // Assuming a base price for calculation (in real app, this would come from product data)
            const basePrice = product.id * 250; // Mock pricing
            return sum + (product.allocated * basePrice);
        }, 0);

        // Prepare order data
        const orderData = {
            receivedOrderId: `RO-${formData.salesOrderNo.split('-')[1]}`, // Generate received order ID
            customer: formData.customerName,
            deliveryDate: formData.expectedDeliveryDate,
            totalValue: totalValue,
            items: allocatedProducts.map(product => ({
                id: product.id,
                product: product.name,
                code: product.name.match(/\(([^)]+)\)/)?.[1] || `PROD-${product.id}`,
                requestedQty: product.requested,
                availableQty: product.available,
                allocatedQty: product.allocated,
                lineStatus: product.allocated === product.requested ? 'Fully Allocated' : 'Partially Allocated'
            }))
        };

        // Add to sales orders context
        const newOrder = addSalesOrder(orderData);

        // Show success message and navigate
        alert(`Sales Order ${newOrder.id} has been generated successfully!`);
        navigate('/sales-orders');
    };

    const handleBlock = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            setSelectedProductForBlock(product);
            setShowBlockModal(true);
        }
    };

    const handleFPO = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            navigate('/fpo/new', {
                state: {
                    salesOrderItem: {
                        product: product.name,
                        code: product.name.match(/\(([^)]+)\)/)?.[1] || '',
                        requestedQty: product.requested,
                        allocatedQty: product.allocated
                    }
                }
            });
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // If sales order number is entered, show product table and load sample data
        if (field === 'salesOrderNo' && value.trim()) {
            setShowProductTable(true);
            // Simulate loading products for the sales order
            const selectedOrder = salesOrders.find(order => order.id === value);
            if (selectedOrder) {
                setFormData(prev => ({
                    ...prev,
                    customerName: selectedOrder.customer,
                    expectedDeliveryDate: selectedOrder.deliveryDate
                }));
            }
        } else if (field === 'salesOrderNo' && !value.trim()) {
            setShowProductTable(false);
        }
    };

    const handleProductSelection = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const handleSelectAllProducts = () => {
        if (selectedProducts.length === products.length) {
            setSelectedProducts([]);
        } else {
            setSelectedProducts(products.map(p => p.id));
        }
    };

    const handleAddShipment = () => {
        console.log('Adding shipment...');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/sales-orders')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">New Sales Order</h1>
                                <p className="text-sm text-gray-500">Create and manage sales order allocation</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                                {formData.status}
                            </span>
                            <button
                                onClick={handleAllocateAll}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                            >
                                Allocate All Available
                            </button>
                            <button
                                onClick={handleGenerateSalesOrder}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
                            >
                                <Save className="h-4 w-4" />
                                <span>Generate Sales Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-6">
                    {/* Sales Order Form Fields */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900">Sales Order Information</h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Order No. *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.salesOrderNo}
                                            onChange={(e) => handleInputChange('salesOrderNo', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter or select sales order"
                                            list="salesOrders"
                                        />
                                        <datalist id="salesOrders">
                                            {salesOrders.map(order => (
                                                <option key={order.id} value={order.id}>{order.id} - {order.customer}</option>
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.customerName}
                                            onChange={(e) => handleInputChange('customerName', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter or select customer"
                                            list="customers"
                                        />
                                        <datalist id="customers">
                                            {customers.map(customer => (
                                                <option key={customer} value={customer}>{customer}</option>
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Order Date *</label>
                                    <input
                                        type="date"
                                        value={formData.salesOrderDate}
                                        onChange={(e) => handleInputChange('salesOrderDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Delivery Date *</label>
                                    <input
                                        type="date"
                                        value={formData.expectedDeliveryDate}
                                        onChange={(e) => handleInputChange('expectedDeliveryDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Representative *</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.salesRepresentative}
                                            onChange={(e) => handleInputChange('salesRepresentative', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter or select sales representative"
                                            list="salesReps"
                                        />
                                        <datalist id="salesReps">
                                            {salesRepresentatives.map(rep => (
                                                <option key={rep} value={rep}>{rep}</option>
                                            ))}
                                        </datalist>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inventory Allocation - Only show when sales order number is entered */}
                    {showProductTable && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Inventory Allocation</h2>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-500">
                                            {selectedProducts.length} of {products.length} selected
                                        </span>
                                        <button
                                            onClick={handleSelectAllProducts}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.length === products.length && products.length > 0}
                                                    onChange={handleSelectAllProducts}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Product</th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Blocked</th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Allocatable</th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Allocate Qty</th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Line Status</th>
                                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id} className={`hover:bg-gray-50 ${selectedProducts.includes(product.id) ? 'bg-blue-50' : ''}`}>
                                                <td className="px-4 py-5 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(product.id)}
                                                        onChange={() => handleProductSelection(product.id)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                </td>
                                                <td className="px-4 py-5 text-center text-sm text-gray-900">{product.requested}</td>
                                                <td className="px-4 py-5 text-center text-sm text-gray-900">{product.available}</td>
                                                <td className="px-4 py-5 text-center text-sm text-gray-900">{product.blocked}</td>
                                                <td className="px-4 py-5 text-center text-sm font-semibold text-gray-900">{product.allocatable}</td>
                                                <td className="px-4 py-5 text-center">
                                                    <input
                                                        type="number"
                                                        value={product.allocated}
                                                        onChange={(e) => handleAllocatedQtyChange(product.id, e.target.value)}
                                                        className="w-24 px-3 py-2 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        min="0"
                                                        max={product.allocatable}
                                                    />
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                        {product.lineStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <div className="flex items-center justify-center space-x-2">
                                                        <button
                                                            onClick={() => handleBlock(product.id)}
                                                            className="px-3 py-1 text-xs border border-purple-300 text-purple-700 rounded hover:bg-purple-50"
                                                        >
                                                            <Lock className="h-3 w-3 inline mr-1" />
                                                            Block
                                                        </button>
                                                        <button
                                                            onClick={() => handleFPO(product.id)}
                                                            className="px-3 py-1 text-xs border border-orange-300 text-orange-700 rounded hover:bg-orange-50"
                                                        >
                                                            <Settings className="h-3 w-3 inline mr-1" />
                                                            FPO
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Delivery Schedule - Only show when products are visible */}
                    {showProductTable && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-medium text-gray-900">Delivery Schedule</h2>
                                    <button
                                        onClick={handleAddShipment}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2 text-sm"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Add Shipment</span>
                                    </button>
                                </div>
                            </div>
                            <div className="px-6 py-8">
                                <p className="text-gray-500 text-center">No shipments scheduled. Add one to plan deliveries.</p>
                            </div>
                        </div>
                    )}

                    {/* Shipping Instructions & Attachments - Only show when products are visible */}
                    {showProductTable && (
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Shipping Instructions & Attachments</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <textarea
                                        value={shippingInstructions}
                                        onChange={(e) => setShippingInstructions(e.target.value)}
                                        placeholder="Add special notes or instructions for shipping..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Upload LPO or other supporting docs</p>
                                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                                        Browse files
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Request Inventory Block Modal */}
            {showBlockModal && selectedProductForBlock && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowBlockModal(false);
                        }
                    }}
                >
                    <div
                        className="bg-white w-full max-w-md rounded-lg shadow-lg p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Request Inventory Block</h2>
                            <button
                                onClick={() => setShowBlockModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <p className="text-sm text-gray-900">{selectedProductForBlock.name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Block</label>
                                <input
                                    type="number"
                                    defaultValue="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    min="0"
                                    max={selectedProductForBlock.available}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Blocking Period</label>
                                <div className="flex items-center space-x-2">
                                    <div className="relative">
                                        <input
                                            type="date"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <span className="text-gray-500">to</span>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Justification</label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g., Securing stock for confirmed high-priority order."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload supporting documents</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                onClick={() => setShowBlockModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Handle block request submission
                                    console.log('Submitting block request for:', selectedProductForBlock.name);
                                    setShowBlockModal(false);
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateNewSaleOrder;