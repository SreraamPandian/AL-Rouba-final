import React, { useState } from 'react';
import { PlusCircle, Eye, Printer } from 'lucide-react';
import AddCheckIn from './AddCheckIn';
import CheckInView from './CheckInView';

const sample = Array.from({ length: 10 }).map((_, i) => ({
    orderId: 47 - i,
    checkInId: 46 - i,
    supplierInvoiceNo: (i % 2 === 0) ? '0658' : (10000 + i).toString(),
    batchNo: `${47 - i}/0000${47 - i}`,
    supplier: ['Modern Khuwairat Farms Ltd.', 'Naseem Al Laajal', 'Hamad Saif Hamed Al Ghafri Trad.'][i % 3],
    totalQty: (i % 2 === 0) ? 33568 : 120,
    goodQty: (i % 2 === 0) ? 33568 : 0,
    badQty: 0
}));

const CheckInList = () => {
    const [data] = useState(sample);
    const [showAdd, setShowAdd] = useState(false);
    const [viewRow, setViewRow] = useState(null);

    const onPrint = (row) => {
        // simple print stub: open new window with printable content
        const w = window.open('', '_blank');
        w.document.write(`<pre>${JSON.stringify(row, null, 2)}</pre>`);
        w.print();
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Check In Process</h1>
                <button onClick={() => setShowAdd(true)} className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded"><PlusCircle className="mr-2" /> Check In</button>
            </div>

            <div className="bg-white rounded shadow">
                <div className="p-3 flex items-center justify-between">
                    <div>
                        Show <select className="border rounded p-1 ml-2 mr-2"><option>10</option><option>25</option></select> entries
                    </div>
                    <div className="flex items-center">
                        <input placeholder="Search:" className="border rounded px-3 py-1" />
                    </div>
                </div>

                <table className="w-full table-auto">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-3">ORDER ID</th>
                            <th className="p-3">CHECK IN ID</th>
                            <th className="p-3">SUPPLIER INVOICE NO</th>
                            <th className="p-3">BATCH NO</th>
                            <th className="p-3">SUPPLIER</th>
                            <th className="p-3">TOTAL QUANTITY</th>
                            <th className="p-3">GOOD QUANTITY</th>
                            <th className="p-3">BAD QUANTITY</th>
                            <th className="p-3">DETAILS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(row => (
                            <tr key={row.orderId} className="border-t">
                                <td className="p-3">{row.orderId}</td>
                                <td className="p-3">{row.checkInId}</td>
                                <td className="p-3">{row.supplierInvoiceNo}</td>
                                <td className="p-3">{row.batchNo}</td>
                                <td className="p-3">{row.supplier}</td>
                                <td className="p-3">{row.totalQty.toLocaleString()}</td>
                                <td className="p-3">{row.goodQty.toLocaleString()}</td>
                                <td className="p-3">{row.badQty}</td>
                                <td className="p-3">
                                    <button onClick={() => setViewRow(row)} className="inline-flex items-center bg-yellow-400 text-white px-3 py-1 rounded mr-2"><Eye /></button>
                                    <button onClick={() => onPrint(row)} className="inline-flex items-center bg-pink-600 text-white px-3 py-1 rounded">Print</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 flex items-center justify-between">
                    <div>Showing 1 to {data.length} of {data.length} entries</div>
                    <div className="space-x-2">
                        <button className="w-8 h-8 rounded-full bg-blue-600 text-white">1</button>
                        <button className="w-8 h-8 rounded-full bg-gray-200">2</button>
                        <button className="w-8 h-8 rounded-full bg-gray-200">3</button>
                        <button className="w-8 h-8 rounded-full bg-gray-200">4</button>
                        <button className="w-8 h-8 rounded-full bg-gray-200">5</button>
                    </div>
                </div>
            </div>

            {showAdd && <AddCheckIn onClose={() => setShowAdd(false)} />}
            {viewRow && <CheckInView row={viewRow} onClose={() => setViewRow(null)} />}
        </div>
    );
};

export default CheckInList;
