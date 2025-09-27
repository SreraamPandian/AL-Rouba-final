import React from 'react';
import { X } from 'lucide-react';

const CheckInView = ({ row, onClose }) => {
    const items = [
        { name: 'Day Old Chicken', good: 33233, bad: 0, shortage: 0 },
        { name: 'Day Old Chicken', good: 335, bad: 0, shortage: 0 }
    ];

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-10">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="bg-white w-11/12 md:w-3/5 rounded-lg shadow-lg z-50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Check In Details (# {row.orderId} - {row.supplier})</h2>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ITEMS</th>
                                <th className="px-4 py-3">GOOD QUANTITY</th>
                                <th className="px-4 py-3">BAD QUANTITY</th>
                                <th className="px-4 py-3">SHORTAGE QUANTITY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="px-4 py-3">{it.name}</td>
                                    <td className="px-4 py-3">{it.good.toLocaleString()}</td>
                                    <td className="px-4 py-3">{it.bad}</td>
                                    <td className="px-4 py-3">{it.shortage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 border rounded text-orange-500">Close</button>
                </div>
            </div>
        </div>
    );
};

export default CheckInView;
