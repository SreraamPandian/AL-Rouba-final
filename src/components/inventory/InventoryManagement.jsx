import React, { useState } from 'react';
import { Printer, FileText, Eye, Download } from 'lucide-react';
import InventoryView from './InventoryView';

const sample = [
    { id: 1, productId: 'IAJN/003', name: 'Broiler Feed Starter - Oman Flour', uom: 'Bag', category: 'Feed', branch: 'IKLIL AL JABAL NATIONAL LLC', qtyOnHand: 1660, sellingPrice: 10.65, allocatedQty: 100 },
    { id: 2, productId: 'IAJN/002', name: 'Live Chicken', uom: 'Nos', category: 'Live Chicken', branch: 'IKLIL AL JABAL NATIONAL LLC', qtyOnHand: 3234, sellingPrice: 0.85, allocatedQty: 52 },
    { id: 3, productId: 'IAJN/001', name: 'Day Old Chicken', uom: 'Nos', category: 'Day Old Chicken', branch: 'IKLIL AL JABAL NATIONAL LLC', qtyOnHand: 33568, sellingPrice: 0.3, allocatedQty: 33568 },
    { id: 4, productId: 'IAJN/004', name: 'Broiler Feed Finisher-Omanflour', uom: 'Bag', category: 'Feed', branch: 'IKLIL AL JABAL NATIONAL LLC', qtyOnHand: 3374, sellingPrice: 10.55, allocatedQty: 200 }
];

const InventoryManagement = () => {
    const [items] = useState(sample);
    const [viewItem, setViewItem] = useState(null);

    const handleExport = () => {
        const csv = [['SL.NO', 'PRODUCT ID', 'PRODUCT NAME', 'UOM', 'CATEGORY', 'BRANCH', 'QUANTITY ON HAND', 'BLOCKED QUANTITY'], ...items.map((it, idx) => [idx + 1, it.productId, it.name, it.uom, it.category, it.branch, it.qtyOnHand, it.allocatedQty])].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'inventory.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Inventory Management</h1>
                <div className="flex items-center space-x-2">
                    <button onClick={handleExport} className="px-3 py-2 bg-slate-800 text-white rounded inline-flex items-center"><Download size={16} /><span className="ml-2">Export</span></button>
                    <button onClick={() => window.print()} className="px-3 py-2 bg-blue-600 text-white rounded inline-flex items-center"><Printer size={16} /><span className="ml-2">Print</span></button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3">SL.NO</th>
                                <th className="px-4 py-3">PRODUCT ID</th>
                                <th className="px-4 py-3">PRODUCT NAME</th>
                                <th className="px-4 py-3">UOM</th>
                                <th className="px-4 py-3">CATEGORY</th>
                                <th className="px-4 py-3">BRANCH</th>
                                <th className="px-4 py-3">QUANTITY ON HAND</th>
                                <th className="px-4 py-3">BLOCKED QUANTITY</th>
                                <th className="px-4 py-3">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((it, idx) => (
                                <tr key={it.id} className="border-b">
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">{it.productId}</td>
                                    <td className="px-4 py-3">{it.name}</td>
                                    <td className="px-4 py-3">{it.uom}</td>
                                    <td className="px-4 py-3">{it.category}</td>
                                    <td className="px-4 py-3">{it.branch}</td>
                                    <td className="px-4 py-3">{it.qtyOnHand}</td>
                                    <td className="px-4 py-3">{it.allocatedQty}</td>
                                    <td className="px-4 py-3"><button onClick={() => setViewItem(it)} className="bg-yellow-400 text-white px-3 py-1 rounded inline-flex items-center"><Eye size={16} /><span className="ml-2">View</span></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {viewItem && <InventoryView item={viewItem} onClose={() => setViewItem(null)} />}
        </div>
    );
};

export default InventoryManagement;
