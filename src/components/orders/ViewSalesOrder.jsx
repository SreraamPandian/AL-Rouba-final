import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Calendar, User, Package, Truck, FileText } from 'lucide-react';

const ViewSalesOrder = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [salesOrder, setSalesOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sample sales order data - in real app this would come from API
    const sampleSalesOrders = {
        'SO-2024-001': {
            id: 'SO-2024-001',
            customerName: 'Tech Solutions Inc.',
            salesOrderDate: '2024-09-15',
            expectedDeliveryDate: '2025-10-15',
            status: 'Confirmed',
            totalValue: 125000,
            currency: 'USD',
            priority: 'High',
            salesRep: 'John Smith',
            customerPO: 'PO-TSI-2024-789',
            paymentTerms: 'Net 30',
            shippingAddress: '123 Tech Street, Silicon Valley, CA 94025',
            billingAddress: '123 Tech Street, Silicon Valley, CA 94025',
            notes: 'Urgent delivery required for Q4 project launch',
            products: [
                {
                    id: 1,
                    name: 'High-Performance Processor (COMP-001)',
                    requested: 50,
                    available: 75,
                    blocked: 10,
                    allocatable: 65,
                    allocated: 50,
                    unitPrice: 1200,
                    totalPrice: 60000,
                    lineStatus: 'Allocated'
                },
                {
                    id: 2,
                    name: 'DDR5 Memory Module (MEM-002)',
                    requested: 100,
                    available: 80,
                    blocked: 0,
                    allocatable: 80,
                    allocated: 80,
                    unitPrice: 300,
                    totalPrice: 24000,
                    lineStatus: 'Partially Allocated'
                },
                {
                    id: 3,
                    name: 'NVMe SSD Drive (STO-003)',
                    requested: 25,
                    available: 0,
                    blocked: 0,
                    allocatable: 0,
                    allocated: 0,
                    unitPrice: 250,
                    totalPrice: 0,
                    lineStatus: 'Pending'
                },
                {
                    id: 4,
                    name: 'Server Casing (CASE-007)',
                    requested: 10,
                    available: 10,
                    blocked: 0,
                    allocatable: 10,
                    allocated: 10,
                    unitPrice: 410,
                    totalPrice: 4100,
                    lineStatus: 'Allocated'
                }
            ],
            shipments: [
                {
                    id: 1,
                    scheduledDate: '2025-10-10',
                    trackingNumber: 'TRK-2024-001',
                    carrier: 'FedEx',
                    status: 'Scheduled',
                    items: ['COMP-001 x50', 'CASE-007 x10']
                },
                {
                    id: 2,
                    scheduledDate: '2025-10-12',
                    trackingNumber: 'TRK-2024-002',
                    carrier: 'UPS',
                    status: 'Scheduled',
                    items: ['MEM-002 x80']
                }
            ],
            attachments: [
                { name: 'Customer_PO_TSI_789.pdf', size: '2.4 MB', uploadDate: '2024-09-15' },
                { name: 'Technical_Specifications.docx', size: '1.2 MB', uploadDate: '2024-09-16' }
            ]
        }
    };

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const order = sampleSalesOrders[id] || null;
            setSalesOrder(order);
            setLoading(false);
        }, 500);
    }, [id]);

    const getStatusBadgeColor = (status) => {
        switch (status.toLowerCase()) {
            case 'allocated': return 'bg-green-100 text-green-800';
            case 'partially allocated': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-red-100 text-red-800';
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'scheduled': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sales order...</p>
                </div>
            </div>
        );
    }

    if (!salesOrder) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sales Order Not Found</h2>
                    <p className="text-gray-600 mb-4">The sales order with ID "{id}" could not be found.</p>
                    <button
                        onClick={() => navigate('/sales-orders')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Sales Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                                <h1 className="text-xl font-semibold text-gray-900">Sales Order: {salesOrder.id}</h1>
                                <p className="text-sm text-gray-500">View sales order details and allocation status</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusBadgeColor(salesOrder.status)}`}>
                                {salesOrder.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-6">
                    {/* Sales Order Information */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Sales Order Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order No.</label>
                                    <p className="text-sm text-gray-900 font-semibold">{salesOrder.id}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                    <p className="text-sm text-gray-900">{salesOrder.customerName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Order Date</label>
                                    <p className="text-sm text-gray-900">{new Date(salesOrder.salesOrderDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date</label>
                                    <p className="text-sm text-gray-900">{new Date(salesOrder.expectedDeliveryDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Representative</label>
                                    <p className="text-sm text-gray-900">{salesOrder.salesRep}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Allocation */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Package className="h-5 w-5 mr-2" />
                                Product Allocation
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Allocated</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salesOrder.products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                            </td>
                                            <td className="px-4 py-4 text-center text-sm text-gray-900">{product.requested}</td>
                                            <td className="px-4 py-4 text-center text-sm text-gray-900">{product.available}</td>
                                            <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">{product.allocated}</td>
                                            <td className="px-4 py-4 text-center text-sm text-gray-900">{salesOrder.currency} {product.unitPrice.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">{salesOrder.currency} {product.totalPrice.toLocaleString()}</td>
                                            <td className="px-4 py-4 text-center">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(product.lineStatus)}`}>
                                                    {product.lineStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Shipping Address</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-900">{salesOrder.shippingAddress}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Billing Address</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-900">{salesOrder.billingAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Schedule */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Truck className="h-5 w-5 mr-2" />
                                Delivery Schedule
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salesOrder.shipments.map((shipment) => (
                                        <tr key={shipment.id}>
                                            <td className="px-6 py-4 text-sm text-gray-900">{new Date(shipment.scheduledDate).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{shipment.carrier}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{shipment.items.join(', ')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(shipment.status)}`}>
                                                    {shipment.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Notes and Attachments */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Special Notes</h2>
                            </div>
                            <div className="p-6">
                                <p className="text-sm text-gray-900">{salesOrder.notes || 'No special notes for this order.'}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Attachments</h2>
                            </div>
                            <div className="p-6">
                                {salesOrder.attachments.length > 0 ? (
                                    <div className="space-y-2">
                                        {salesOrder.attachments.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-900">{file.name}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {file.size} • {new Date(file.uploadDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No attachments for this order.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewSalesOrder;