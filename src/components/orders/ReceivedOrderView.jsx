import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, User, Calendar, DollarSign, MapPin } from 'lucide-react';
import { useReceivedOrders } from '../../context/ReceivedOrdersContext';

const ReceivedOrderView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getOrder } = useReceivedOrders();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const orderData = getOrder(id);
            if (orderData) {
                // Enhance the order data with additional details for display
                const enhancedOrder = {
                    ...orderData,
                    customerName: 'Tech Solutions Inc.',
                    customerEmail: 'contact@techsolutions.com',
                    customerPhone: '+968 2400 1234',
                    poNumber: `PO-${orderData.budgetId.replace('/', '-')}`,
                    deliveryDate: '2025-10-15',
                    priority: 'High',
                    status: 'Confirmed',
                    notes: 'Standard delivery terms apply. Customer requires advance notification before delivery.',
                    items: [
                        {
                            id: 1,
                            product: 'Enterprise Server Rack',
                            description: 'Dell PowerEdge R750 Server with 32GB RAM',
                            quantity: 2,
                            unit: 'Pieces',
                            unitPrice: 2500.00,
                            totalPrice: 5000.00
                        },
                        {
                            id: 2,
                            product: 'Network Infrastructure',
                            description: 'Cisco Catalyst 9300 Series Switch',
                            quantity: 1,
                            unit: 'Pieces',
                            unitPrice: 1800.00,
                            totalPrice: 1800.00
                        },
                        {
                            id: 3,
                            product: 'Security Appliance',
                            description: 'Fortinet FortiGate 100F Firewall',
                            quantity: 1,
                            unit: 'Pieces',
                            unitPrice: 1200.00,
                            totalPrice: 1200.00
                        }
                    ],
                    shipping: {
                        method: 'Express Delivery',
                        address: '123 Technology Park, Muscat, Oman',
                        trackingNumber: 'TRK-2025-001'
                    },
                    billing: {
                        address: '123 Technology Park, Muscat, Oman',
                        paymentTerms: 'Net 30 Days',
                        currency: 'OMR'
                    }
                };
                setOrder(enhancedOrder);
            }
            setLoading(false);
        }
    }, [id, getOrder]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading received order...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Received Order Not Found</h2>
                    <p className="text-gray-600 mb-4">The received order with ID "{id}" could not be found.</p>
                    <button
                        onClick={() => navigate('/received-orders')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Received Orders
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
                                onClick={() => navigate('/received-orders')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Received Order: {order.budgetId}</h1>
                                <p className="text-sm text-gray-500">View received order details and information</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-6">
                    {/* Order Information */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Order Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order ID</label>
                                    <p className="text-sm text-gray-900 font-semibold">{order.budgetId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">PO Number</label>
                                    <p className="text-sm text-gray-900">{order.poNumber}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
                                    <p className="text-sm text-gray-900">{new Date(order.receivedOrderDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                                    <p className="text-sm text-gray-900">{new Date(order.deliveryDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                    <p className="text-sm text-gray-900">{order.employee}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                                    <p className="text-sm text-gray-900">{order.branch}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                                    <p className="text-sm text-gray-900">{order.priority}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Budget Value</label>
                                    <p className="text-sm text-gray-900 font-semibold">${order.budgetValue.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Customer Information
                            </h2>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                    <p className="text-sm text-gray-900">{order.customerName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-sm text-gray-900">{order.customerEmail}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <p className="text-sm text-gray-900">{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <DollarSign className="h-5 w-5 mr-2" />
                                Order Items
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{item.product}</div>
                                                    <div className="text-sm text-gray-500">{item.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-center text-sm text-gray-900">{item.quantity}</td>
                                            <td className="px-4 py-4 text-center text-sm text-gray-900">{item.unit}</td>
                                            <td className="px-4 py-4 text-center text-sm text-gray-900">${item.unitPrice.toFixed(2)}</td>
                                            <td className="px-4 py-4 text-center text-sm font-semibold text-gray-900">${item.totalPrice.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Shipping & Billing Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <MapPin className="h-5 w-5 mr-2" />
                                    Shipping Information
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
                                        <p className="text-sm text-gray-900">{order.shipping.method}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                                        <p className="text-sm text-gray-900">{order.shipping.address}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                                        <p className="text-sm text-gray-900">{order.shipping.trackingNumber}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                                        <p className="text-sm text-gray-900">{order.billing.address}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                                        <p className="text-sm text-gray-900">{order.billing.paymentTerms}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                        <p className="text-sm text-gray-900">{order.billing.currency}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-medium text-gray-900">Special Notes</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-900">{order.notes || 'No special notes for this order.'}</p>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total Items: {order.items.length}</span>
                            <span className="text-lg font-semibold">
                                Total Value: ${order.items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceivedOrderView;