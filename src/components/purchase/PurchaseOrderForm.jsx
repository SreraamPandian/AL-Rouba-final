import React, { useState } from 'react';
import { X, Plus, File } from 'lucide-react';

const emptyRow = { productId: '', productName: '', brand: '', quantity: '', supplierPrice: '', tax: '', total: '' };

const PurchaseOrderForm = ({ onClose, onCreate }) => {
    const [rows, setRows] = useState([{ ...emptyRow }]);
    const [summary, setSummary] = useState({ total: 0, tax: 0, expenses: 0, grandTotal: 0, advance: 0 });

    const addRow = () => setRows(prev => [...prev, { ...emptyRow }]);
    const updateCell = (idx, key, value) => {
        const next = [...rows];
        next[idx][key] = value;
        next[idx].total = (parseFloat(next[idx].supplierPrice || 0) * parseFloat(next[idx].quantity || 0)) || 0;
        setRows(next);
        recalc(next);
    };

    const recalc = (currentRows) => {
        const total = currentRows.reduce((s, r) => s + (parseFloat(r.total) || 0), 0);
        const tax = 0; // placeholder
        const grand = total + tax + (parseFloat(summary.expenses) || 0);
        setSummary(prev => ({ ...prev, total, tax, grandTotal: grand }));
    };

    const handleCreate = () => {
        const po = {
            id: Date.now(),
            purchaseType: 'Local Purchase Order',
            supplierInvoice: '',
            date: new Date().toLocaleDateString('en-GB'),
            supplier: '',
            deliveryDate: new Date().toLocaleDateString('en-GB'),
            itemsQty: rows.reduce((s, r) => s + (parseFloat(r.quantity) || 0), 0),
            branch: '',
            rows
        };
        onCreate(po);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-10">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="bg-white w-11/12 md:w-4/5 rounded-lg shadow-lg z-50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Add Purchase Order</h2>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <select className="border p-2 rounded"><option>--Select Purchase Type--</option></select>
                    <select className="border p-2 rounded"><option>Select Supplier*</option></select>
                    <select className="border p-2 rounded"><option>Select Branch*</option></select>
                    <input className="border p-2 rounded" defaultValue={new Date().toLocaleDateString('en-GB')} />
                    <input className="border p-2 rounded" defaultValue={new Date().toLocaleDateString('en-GB')} />
                    <input className="border p-2 rounded" defaultValue={new Date().toLocaleDateString('en-GB')} />
                </div>

                <div className="overflow-x-auto border rounded">
                    <table className="min-w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-2">PRODUCT ID</th>
                                <th className="px-4 py-2">PRODUCT NAME</th>
                                <th className="px-4 py-2">BRAND</th>
                                <th className="px-4 py-2">QUANTITY</th>
                                <th className="px-4 py-2">SUPPLIER PRICE</th>
                                <th className="px-4 py-2">TAX</th>
                                <th className="px-4 py-2">TOTAL</th>
                                <th className="px-4 py-2"> </th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="px-2 py-2"><input className="w-full border p-1" value={r.productId} onChange={e => updateCell(idx, 'productId', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input className="w-full border p-1" value={r.productName} onChange={e => updateCell(idx, 'productName', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input className="w-full border p-1" value={r.brand} onChange={e => updateCell(idx, 'brand', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input className="w-24 border p-1" value={r.quantity} onChange={e => updateCell(idx, 'quantity', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input className="w-28 border p-1" value={r.supplierPrice} onChange={e => updateCell(idx, 'supplierPrice', e.target.value)} /></td>
                                    <td className="px-2 py-2"><input className="w-24 border p-1" value={r.tax} onChange={e => updateCell(idx, 'tax', e.target.value)} /></td>
                                    <td className="px-2 py-2">{(r.total || 0).toFixed ? (r.total || 0).toFixed(3) : r.total}</td>
                                    <td className="px-2 py-2"><button onClick={addRow} className="bg-pink-500 text-white px-2 py-1 rounded"><Plus /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex items-start justify-between">
                    <div className="w-1/2">
                        <div className="mb-3">Bulk Order Create</div>
                        <div className="flex items-center space-x-2">
                            <div className="border p-2 rounded flex items-center gap-2"><File /> Upload CSV</div>
                            <button className="px-3 py-2 bg-sky-600 text-white rounded">File</button>
                        </div>
                        <div className="mt-3 space-x-3">
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Preview</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded">Download Template</button>
                        </div>
                    </div>

                    <div className="w-1/3 bg-gray-50 rounded p-4 shadow">
                        <div className="text-sm mb-2">Summary</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-600">Total</div><div>{summary.total.toFixed ? summary.total.toFixed(3) : summary.total}</div>
                            <div className="text-gray-600">Total Tax</div><div>{summary.tax.toFixed ? summary.tax.toFixed(3) : summary.tax}</div>
                            <div className="text-gray-600">Expenses</div><div><input className="border p-1 w-full" placeholder="Expenses Details" onChange={e => setSummary(s => ({ ...s, expenses: parseFloat(e.target.value || 0) }))} /></div>
                            <div className="text-gray-600">Grand Total</div><div className="font-semibold">{summary.grandTotal.toFixed ? summary.grandTotal.toFixed(3) : summary.grandTotal}</div>
                            <div className="text-gray-600">Advance Amount</div><div><input className="border p-1 w-full" onChange={e => setSummary(s => ({ ...s, advance: parseFloat(e.target.value || 0) }))} /></div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={handleCreate} className="px-6 py-2 bg-blue-600 text-white rounded">Create Purchase Order</button>
                    <button onClick={onClose} className="px-6 py-2 border rounded text-gray-700">Close</button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderForm;
