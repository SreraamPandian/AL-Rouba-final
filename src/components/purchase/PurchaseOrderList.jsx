import React, { useState } from 'react';
import { Plus, Download, Eye } from 'lucide-react';
import PurchaseOrderForm from './PurchaseOrderForm';
import PurchaseOrderView from './PurchaseOrderView';

const sampleOrders = Array.from({ length: 10 }).map((_, i) => ({
    id: 38 + i,
    purchaseType: 'Local Purchase Order',
    supplierInvoice: `00${68 + i}`,
    date: new Date(2025, 5 + (i % 3), 16 + i).toLocaleDateString('en-GB'),
    supplier: ['Modern Khuwairat Farms Ltd.', 'Naseem Al Laajal', 'Hamad Saif Hamed Al Ghafri Trad.'][i % 3],
    deliveryDate: new Date(2025, 5 + (i % 3), 16 + i).toLocaleDateString('en-GB'),
    itemsQty: (i + 1) * 50,
    branch: 'IKLIL AL JABAL NATIONAL LLC'
}));

const PurchaseOrderList = () => {
    const [orders, setOrders] = useState(sampleOrders);
    const [showForm, setShowForm] = useState(false);
    const [viewOrder, setViewOrder] = useState(null);

    const handleAddOpen = () => setShowForm(true);
    const handleAddClose = () => setShowForm(false);

    const handleCreate = (po) => {
        setOrders(prev => [{ ...po, id: prev.length ? prev[0].id + 1 : 1 }, ...prev]);
        setShowForm(false);
    };

    const handleExport = () => {
        const csv = [
            ['Order ID', 'Purchase Type', 'Supplier Invoice No', 'Date', 'Supplier', 'Delivery Date', 'Items Qty', 'Branch'],
            ...orders.map(o => [o.id, o.purchaseType, o.supplierInvoice, o.date, o.supplier, o.deliveryDate, o.itemsQty, o.branch])
        ].map(r => r.join(',')).join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'purchase-orders.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Create Purchase Order</h1>
                <div className="space-x-3">
                    <button onClick={handleAddOpen} className="px-4 py-2 bg-blue-600 text-white rounded-md inline-flex items-center space-x-2">
                        <Plus size={16} />
                        <span>Add Purchase Order</span>
                    </button>
                    <button onClick={handleExport} className="px-4 py-2 bg-slate-800 text-white rounded-md inline-flex items-center space-x-2">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <select className="border rounded px-3 py-2">
                            <option>Select Branch</option>
                        </select>
                        <button className="px-3 py-2 bg-white border rounded">Reset</button>
                    </div>
                    <div>
                        <label className="mr-2">Show</label>
                        <select className="border rounded px-2 py-1">
                            <option>10</option>
                        </select>
                        <label className="ml-4 mr-2">Search:</label>
                        <input className="border rounded px-2 py-1" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ORDER ID</th>
                                <th className="px-4 py-3">PURCHASE TYPE</th>
                                <th className="px-4 py-3">SUPPLIER INVOICE NO</th>
                                <th className="px-4 py-3">DATE</th>
                                <th className="px-4 py-3">SUPPLIER</th>
                                <th className="px-4 py-3">DELIVERY DATE</th>
                                <th className="px-4 py-3">ITEMS QTY</th>
                                <th className="px-4 py-3">BRANCH</th>
                                <th className="px-4 py-3">DETAILS</th>
                                <th className="px-4 py-3">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} className="border-b">
                                    <td className="px-4 py-3">{o.id}</td>
                                    <td className="px-4 py-3">{o.purchaseType}</td>
                                    <td className="px-4 py-3">{o.supplierInvoice}</td>
                                    <td className="px-4 py-3">{o.date}</td>
                                    <td className="px-4 py-3 text-blue-600">{o.supplier}</td>
                                    <td className="px-4 py-3">{o.deliveryDate}</td>
                                    <td className="px-4 py-3">{o.itemsQty.toLocaleString()}</td>
                                    <td className="px-4 py-3">{o.branch}</td>
                                    <td className="px-4 py-3">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setViewOrder(o)}>
                                            <Eye size={14} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">{/* Action column - reserved */}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showForm && <PurchaseOrderForm onClose={handleAddClose} onCreate={handleCreate} />}
            {viewOrder && <PurchaseOrderView order={viewOrder} onClose={() => setViewOrder(null)} />}
        </div>
    );
};

export default PurchaseOrderList;
