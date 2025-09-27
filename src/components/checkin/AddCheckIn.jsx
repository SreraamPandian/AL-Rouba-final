import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddCheckIn = ({ onClose }) => {
    const [orderId, setOrderId] = useState('');
    const [supplierInvoice, setSupplierInvoice] = useState('');

    const dummyProducts = [
        { sl: 1, productId: 'P-1001', name: 'Day Old Chicken', price: '0.30', qty: 33233, good: 33233, bad: 0, shortage: 0 },
        { sl: 2, productId: 'P-1002', name: 'Day Old Chicken', price: '0.30', qty: 335, good: 335, bad: 0, shortage: 0 }
    ];

    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-10">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="bg-white w-11/12 md:w-4/5 rounded-lg shadow-lg z-50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Add Check In</h2>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm text-gray-600">Order Id</label>
                        <select value={orderId} onChange={e => setOrderId(e.target.value)} className="w-full border rounded p-2 mt-1">
                            <option value="">Select Order ID</option>
                            <option value="47">47</option>
                            <option value="46">46</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded">Search</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3">SL</th>
                                <th className="px-4 py-3">PRODUCT ID</th>
                                <th className="px-4 py-3">PRODUCT NAME</th>
                                <th className="px-4 py-3">PRICE</th>
                                <th className="px-4 py-3">QUANTITY</th>
                                <th className="px-4 py-3">GOOD QUANTITY</th>
                                <th className="px-4 py-3">BAD QUANTITY</th>
                                <th className="px-4 py-3">SHORTAGE QUANTITY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyProducts.map(p => (
                                <tr key={p.sl} className="border-b">
                                    <td className="px-4 py-3">{p.sl}</td>
                                    <td className="px-4 py-3">{p.productId}</td>
                                    <td className="px-4 py-3">{p.name}</td>
                                    <td className="px-4 py-3">{p.price}</td>
                                    <td className="px-4 py-3">{p.qty.toLocaleString()}</td>
                                    <td className="px-4 py-3">{p.good.toLocaleString()}</td>
                                    <td className="px-4 py-3">{p.bad}</td>
                                    <td className="px-4 py-3">{p.shortage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4">
                    <label className="block text-sm text-gray-600">Supplier Invoice No</label>
                    <input value={supplierInvoice} onChange={e => setSupplierInvoice(e.target.value)} className="w-full border rounded p-2 mt-1" />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => { alert('Direct Save (stub)'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded">Direct Save</button>
                    <button onClick={() => { alert('Save With Debit Note (stub)'); onClose(); }} className="px-4 py-2 bg-blue-600 text-white rounded">Save With Debit Note</button>
                    <button onClick={onClose} className="px-4 py-2 border rounded text-orange-500">Close</button>
                </div>
            </div>
        </div>
    );
};

export default AddCheckIn;
