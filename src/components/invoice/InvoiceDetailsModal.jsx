import React from 'react';
import { X } from 'lucide-react';

const sampleInvoiceDetails = {
    'IAJ/INV/2025/0070': [
        { sl: 1, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 377, price: 0.750 },
        { sl: 2, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 52, price: 0.800 },
        { sl: 3, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 604, price: 0.800 },
        { sl: 4, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 3385, price: 0.825 },
        { sl: 5, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 2002, price: 0.850 },
        { sl: 6, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 709, price: 0.875 },
        { sl: 7, productName: 'Live Chicken', category: 'Live Chicken', brand: 'Broiler Feed Finisher-Omanfou', uom: '', qty: 91, price: 0.875 }
    ]
};

const InvoiceDetailsModal = ({ invoice, onClose }) => {
    if (!invoice) return null;

    const invoiceDetails = sampleInvoiceDetails[invoice.invoiceNumber] || sampleInvoiceDetails['IAJ/INV/2025/0070'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Invoice Details
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
                    {/* Invoice Info */}
                    <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Invoice Number:</span>
                            <span className="ml-2">{invoice.invoiceNumber}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Sale Order ID:</span>
                            <span className="ml-2">{invoice.saleOrderId}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Customer:</span>
                            <span className="ml-2">{invoice.customerName}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Invoice Date:</span>
                            <span className="ml-2">{invoice.invoiceDate}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Amount:</span>
                            <span className="ml-2">{invoice.invoiceAmount}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                {invoice.status}
                            </span>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-blue-600 text-white">
                            <div className="grid grid-cols-7 gap-4 p-3 font-medium text-sm">
                                <div className="text-center">SL</div>
                                <div>PRODUCT NAME</div>
                                <div>CATEGORY</div>
                                <div>BRAND</div>
                                <div className="text-center">UOM</div>
                                <div className="text-center">QTY</div>
                                <div className="text-center">PRICE</div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {invoiceDetails.map((item, index) => (
                                <div key={index} className="grid grid-cols-7 gap-4 p-3 text-sm hover:bg-gray-50">
                                    <div className="text-center font-medium text-gray-900">{item.sl}</div>
                                    <div className="text-gray-700">{item.productName}</div>
                                    <div className="text-gray-700">{item.category}</div>
                                    <div className="text-gray-700">{item.brand}</div>
                                    <div className="text-center">{item.uom}</div>
                                    <div className="text-center">{item.qty.toLocaleString()}</div>
                                    <div className="text-center">{item.price}</div>
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

export default InvoiceDetailsModal;