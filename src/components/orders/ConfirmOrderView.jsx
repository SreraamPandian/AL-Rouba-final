import React from 'react';
import { X, Printer } from 'lucide-react';

const ConfirmOrderView = ({ order, onClose }) => {
    const rows = Array.from({ length: 7 }).map((_, i) => ({
        id: i + 1,
        productId: 'IAJN/002',
        product: 'Live Chicken',
        price: (0.75 + i * 0.05).toFixed(3),
        qty: [377, 52, 604, 3385, 2002, 709, 91][i]
    }));

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-10">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="bg-white w-11/12 md:w-4/5 rounded-lg shadow-lg z-50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Order Details | {order.customer} | #{order.id}</h2>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-2">PRODUCT ID</th>
                                <th className="px-4 py-2">PRODUCT NAME</th>
                                <th className="px-4 py-2">PRICE</th>
                                <th className="px-4 py-2">QTY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id} className={r.id === 4 ? 'bg-blue-500 text-white' : ''}>
                                    <td className="px-4 py-2">{r.productId}</td>
                                    <td className="px-4 py-2">{r.product}</td>
                                    <td className="px-4 py-2">{r.price}</td>
                                    <td className="px-4 py-2">{r.qty.toLocaleString()}</td>
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

export default ConfirmOrderView;
