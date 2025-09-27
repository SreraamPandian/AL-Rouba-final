import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import ConfirmOrderView from './ConfirmOrderView';

const sample = Array.from({ length: 10 }).map((_, i) => ({
    id: 76 - i,
    customer: 'Runaq Al Faaw Al Lama L.L.C.',
    createdOn: '19-08-2025'
}));

const ConfirmOrder = () => {
    const [orders] = useState(sample);
    const [view, setView] = useState(null);

    const handleExport = () => {
        const csv = [['ORDER ID', 'CUSTOMER NAME', 'CREATED ON'], ...orders.map(o => [o.id, o.customer, o.createdOn])].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'confirm-orders.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Confirm Orders</h1>
                <div className="space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Create</button>
                    <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center space-x-2"><Download size={16} /><span>Export</span></button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <table className="min-w-full border">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="px-4 py-3">ORDER ID</th>
                            <th className="px-4 py-3">CUSTOMER NAME</th>
                            <th className="px-4 py-3">CREATED ON</th>
                            <th className="px-4 py-3">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b">
                                <td className="px-4 py-3">{o.id}</td>
                                <td className="px-4 py-3 text-blue-600">{o.customer}</td>
                                <td className="px-4 py-3">{o.createdOn}</td>
                                <td className="px-4 py-3"><button onClick={() => setView(o)} className="bg-green-500 text-white px-3 py-1 rounded inline-flex items-center"><Eye size={14} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {view && <ConfirmOrderView order={view} onClose={() => setView(null)} />}
        </div>
    );
};

export default ConfirmOrder;
