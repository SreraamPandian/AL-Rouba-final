import React from 'react';
import { X } from 'lucide-react';

const sampleOrderDetails = {
    76: [
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.750', qty: 377 },
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.800', qty: 52 },
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.800', qty: 604 },
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.825', qty: 3385 },
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.850', qty: 2002 },
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.875', qty: 709 },
        { productId: 'IAJN/002', productName: 'Live Chicken', price: '0.875', qty: 91 }
    ]
};

const ConfirmOrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    const orderDetails = sampleOrderDetails[order.id] || sampleOrderDetails[76];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Order Details | {order.customerName} | #{order.id}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Products Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-blue-600 text-white">
                            <div className="grid grid-cols-4 gap-4 p-3 font-medium text-sm">
                                <div>PRODUCT ID</div>
                                <div>PRODUCT NAME</div>
                                <div className="text-center">PRICE</div>
                                <div className="text-center">QTY</div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {orderDetails.map((item, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 p-3 text-sm hover:bg-gray-50">
                                    <div className="font-medium text-gray-900">{item.productId}</div>
                                    <div className="text-gray-700">{item.productName}</div>
                                    <div className="text-center">{item.price}</div>
                                    <div className="text-center">{item.qty.toLocaleString()}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-4 border-t border-gray-200 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrderDetailsModal;