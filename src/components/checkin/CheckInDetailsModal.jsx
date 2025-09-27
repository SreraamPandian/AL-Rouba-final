import React from 'react';
import { X } from 'lucide-react';

const CheckInDetailsModal = ({ record, onClose }) => {
    if (!record) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Check In Details (#{record.id} - {record.supplier})
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
                    {/* Summary Info */}
                    <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Order ID:</span>
                            <span className="ml-2">{record.id}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Check In ID:</span>
                            <span className="ml-2">{record.checkInId}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Supplier Invoice:</span>
                            <span className="ml-2">{record.supplierInvoiceNo}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Batch No:</span>
                            <span className="ml-2">{record.batchNo}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="font-medium text-gray-700">Supplier:</span>
                            <span className="ml-2">{record.supplier}</span>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-blue-600 text-white">
                            <div className="grid grid-cols-4 gap-4 p-3 font-medium text-sm">
                                <div>ITEMS</div>
                                <div className="text-center">GOOD QUANTITY</div>
                                <div className="text-center">BAD QUANTITY</div>
                                <div className="text-center">SHORTAGE QUANTITY</div>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {record.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 p-3 text-sm hover:bg-gray-50">
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                    <div className="text-center">{item.goodQuantity.toLocaleString()}</div>
                                    <div className="text-center">{item.badQuantity}</div>
                                    <div className="text-center">{item.shortageQuantity}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <div className="font-medium text-gray-700 mb-1">Total Quantity</div>
                                <div className="text-lg font-bold text-gray-900">{record.totalQuantity.toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                                <div className="font-medium text-gray-700 mb-1">Good Quantity</div>
                                <div className="text-lg font-bold text-green-600">{record.goodQuantity.toLocaleString()}</div>
                            </div>
                            <div className="text-center">
                                <div className="font-medium text-gray-700 mb-1">Bad Quantity</div>
                                <div className="text-lg font-bold text-red-600">{record.badQuantity}</div>
                            </div>
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

export default CheckInDetailsModal;