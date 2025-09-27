import React from 'react';
import { X, Printer } from 'lucide-react';

const PurchaseOrderView = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-10">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="bg-white w-11/12 md:w-4/5 rounded-lg shadow-lg z-50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">View Order Details</h2>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-2">ID</th>
                                <th className="px-4 py-2">PRODUCT NAME</th>
                                <th className="px-4 py-2">PRODUCT ID</th>
                                <th className="px-4 py-2">BRAND</th>
                                <th className="px-4 py-2">QUANTITY</th>
                                <th className="px-4 py-2">SELLING PRICE</th>
                                <th className="px-4 py-2">TOTAL SELLING PRICE</th>
                                <th className="px-4 py-2">TAX</th>
                                <th className="px-4 py-2">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.rows || []).map((r, i) => (
                                <tr key={i} className="border-b">
                                    <td className="px-4 py-2">{i + 1}</td>
                                    <td className="px-4 py-2">{r.productName || 'Day Old Chicken'}</td>
                                    <td className="px-4 py-2">{r.productId || 'IAJN/001'}</td>
                                    <td className="px-4 py-2">{r.brand || 'Broiler Day Old Chicken India'}</td>
                                    <td className="px-4 py-2">{(r.quantity || '').toString()}</td>
                                    <td className="px-4 py-2">{r.supplierPrice || '0.000'}</td>
                                    <td className="px-4 py-2">{(r.total || 0).toString()}</td>
                                    <td className="px-4 py-2">{r.tax || '0.000'}</td>
                                    <td className="px-4 py-2">{(parseFloat(r.total) || 0).toFixed(3)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded inline-flex items-center space-x-2"><Printer /><span>Print</span></button>
                    <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Close</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderView;
