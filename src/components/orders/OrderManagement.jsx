import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import OrderView from './OrderView';

const sampleOrders = Array.from({ length: 10 }).map((_, i) => ({
    id: 76 - i,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    type: 'Regular',
    grandTotal: (Math.random() * 10000).toFixed(3),
    totalItems: Math.floor(Math.random() * 12000) + 1000,
    createdOn: '19-08-2025',
    branchName: 'IKLIL AL JABAL NATIONAL LLC'
}));

const OrderManagement = () => {
    const [orders] = useState(sampleOrders);
    const [view, setView] = useState(null);

    const handleExport = () => {
        const csv = [['Order ID', 'Customer Name', 'Regular/FOC', 'Grand Total', 'Total Items', 'Created On', 'Branch Name'], ...orders.map(o => [o.id, o.customerName, o.type, o.grandTotal, o.totalItems, o.createdOn, o.branchName])].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <div className="space-x-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md">Create Sale Order</button>
                    <button onClick={handleExport} className="px-4 py-2 bg-slate-800 text-white rounded-md inline-flex items-center space-x-2"><Download size={16} /><span>Export</span></button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ORDER ID</th>
                                <th className="px-4 py-3">CUSTOMER NAME</th>
                                <th className="px-4 py-3">REGULAR / FOC</th>
                                <th className="px-4 py-3">GRAND TOTAL</th>
                                <th className="px-4 py-3">TOTAL ITEMS</th>
                                <th className="px-4 py-3">CREATED ON</th>
                                <th className="px-4 py-3">BRANCH NAME</th>
                                <th className="px-4 py-3">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} className="border-b">
                                    <td className="px-4 py-3">{o.id}</td>
                                    <td className="px-4 py-3 text-blue-600">{o.customerName}</td>
                                    <td className="px-4 py-3">{o.type}</td>
                                    <td className="px-4 py-3">{o.grandTotal}</td>
                                    <td className="px-4 py-3">{o.totalItems.toLocaleString()}</td>
                                    <td className="px-4 py-3">{o.createdOn}</td>
                                    <td className="px-4 py-3">{o.branchName}</td>
                                    <td className="px-4 py-3"><button onClick={() => setView(o)} className="bg-green-500 text-white px-3 py-1 rounded inline-flex items-center"><Eye size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {view && <OrderView order={view} onClose={() => setView(null)} />}
        </div>
    );
};

export default OrderManagement;
