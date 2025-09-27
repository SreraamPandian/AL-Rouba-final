import React from 'react';
import { X, Printer } from 'lucide-react';

const OrderView = ({ order, onClose }) => {
    const rows = Array.from({ length: 7 }).map((_, i) => ({
        id: i + 1,
        product: 'Live Chicken',
        category: 'Live Chicken',
        brand: 'Broiler Feed Finisher-Omanflour',
        uom: 'Nos',
        price: (0.75 + i * 0.05).toFixed(3),
        allocatedQty: [377, 52, 604, 3385, 2002, 709, 91][i],
        taxPct: 0,
        total: ((0.75 + i * 0.05) * [377, 52, 604, 3385, 2002, 709, 91][i]).toFixed(3)
    }));

    const grandTotal = rows.reduce((s, r) => s + parseFloat(r.total), 0).toFixed(3);

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
                                <th className="px-4 py-2">CATEGORY</th>
                                <th className="px-4 py-2">BRAND</th>
                                <th className="px-4 py-2">UOM</th>
                                <th className="px-4 py-2">PRICE</th>
                                <th className="px-4 py-2">ALLOCATED QTY</th>
                                <th className="px-4 py-2">TAX (%)</th>
                                <th className="px-4 py-2">TAX AMOUNT</th>
                                <th className="px-4 py-2">TOTAL AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(r => (
                                <tr key={r.id} className={r.id === 4 ? 'bg-blue-500 text-white' : ''}>
                                    <td className="px-4 py-2">{r.id}</td>
                                    <td className="px-4 py-2">{r.product}</td>
                                    <td className="px-4 py-2">{r.category}</td>
                                    <td className="px-4 py-2">{r.brand}</td>
                                    <td className="px-4 py-2">{r.uom}</td>
                                    <td className="px-4 py-2">{r.price}</td>
                                    <td className="px-4 py-2">{r.allocatedQty.toLocaleString()}</td>
                                    <td className="px-4 py-2">{r.taxPct}</td>
                                    <td className="px-4 py-2">0.000</td>
                                    <td className="px-4 py-2">{r.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 bg-blue-600 text-white p-3 font-semibold">Grand Total: {grandTotal}</div>

                <div className="mt-4 flex justify-end space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded inline-flex items-center space-x-2"><Printer /><span>Print</span></button>
                    <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Close</button>
                </div>
            </div>
        </div>
    );
};

export default OrderView;
