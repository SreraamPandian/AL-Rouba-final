import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Unlock, ArrowLeft } from 'lucide-react';
import { faker } from '@faker-js/faker';

const makeBlock = (id) => {
    const created = new Date(2025, 8, 9, 23, 47); // 9 Sep 2025 11:47 PM
    const expiry = new Date(2025, 8, 18);
    const product = `Copper Pipes - 1/2" (OV5AT1NS)`;
    return {
        id: id || 'BLK-0001',
        salesOrderId: 'SO-2024-060',
        customer: 'Acme Construction Co',
        enquiryId: 'ENQ-2024-112',
        salesPerson: 'Ravi Kumar',
        product,
        blockedQty: 335,
        unit: 'PCS',
        status: 'Released',
        warehouse: 'WH-C',
        location: 'C-11-7',
        batchNumber: 'BATCH-2025-8A8INI',
        supplierRef: 'SUP-14NTEDA0',
        createdDate: created.toLocaleDateString(),
        createdTime: created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expiryDate: expiry.toLocaleDateString(),
        notes: 'Single order contains multiple blocks. Customer contacted for confirmation.'
    };
};

const InventoryBlockDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [selected, setSelected] = useState({ [id || 'BLK-0001']: true });
    const [localBlocks, setLocalBlocks] = useState(() => Array.from({ length: 3 }, (_, i) => makeBlock(`BLK-${String(i + 1).padStart(4, '0')}`)));

    const block = useMemo(() => localBlocks.find(b => b.id === id) || localBlocks[0], [localBlocks, id]);

    const getDaysToExpiry = (expiryDateStr) => {
        if (!expiryDateStr) return null;
        const ex = new Date(expiryDateStr);
        const now = new Date();
        const diff = Math.ceil((ex - now) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const toggleSelect = (blkId) => {
        setSelected(prev => ({ ...prev, [blkId]: !prev[blkId] }));
    };

    const releaseSelected = () => {
        const ids = Object.keys(selected).filter(k => selected[k]);
        if (ids.length === 0) {
            alert('No blocks selected');
            return;
        }
        setLocalBlocks(prev => prev.map(b => ids.includes(b.id) ? { ...b, status: 'Released' } : b));
        alert('Released blocks (mock): ' + ids.join(', '));
    };

    const updateExpiry = (blkId, newDateISO) => {
        // newDateISO expected as yyyy-mm-dd
        const dateStr = new Date(newDateISO).toLocaleDateString();
        setLocalBlocks(prev => prev.map(b => b.id === blkId ? { ...b, expiryDate: dateStr } : b));
    };

    return (
        <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded"><ArrowLeft className="h-5 w-5" /></button>
                <h1 className="text-2xl font-bold">Block Details</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Block Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm text-gray-600">Block ID</label>
                            <p className="font-medium">{block.id}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Sales Order ID</label>
                            <p className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate(`/sales-orders/${block.salesOrderId}`)}>{block.salesOrderId}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Customer</label>
                            <p className="font-medium">{block.customer}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Enquiry ID</label>
                            <p className="font-medium">{block.enquiryId}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Sales Person</label>
                            <p className="font-medium">{block.salesPerson}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Product</label>
                            <p className="font-medium">{block.product}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Blocked Quantity</label>
                            <p className="font-medium">{block.blockedQty} {block.unit}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Status</label>
                            <p className="font-medium">{block.status}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Warehouse Location</label>
                            <p className="font-medium">{block.warehouse} - {block.location}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Batch Number</label>
                            <p className="font-medium font-mono">{block.batchNumber}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-600">Supplier Reference</label>
                            <p className="font-medium font-mono">{block.supplierRef}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Actions</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-600">Select Blocks</label>
                            <div className="mt-2 space-y-2">
                                {localBlocks.map(b => (
                                    <div key={b.id} className="flex items-center justify-between border p-2 rounded">
                                        <div>
                                            <div className="font-medium">{b.id}</div>
                                            <div className="text-xs text-gray-500">{b.product}</div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" checked={!!selected[b.id]} onChange={() => toggleSelect(b.id)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button onClick={releaseSelected} className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded"><Unlock className="w-4 h-4 mr-2" /> Release Selected</button>
                        </div>

                        <div className="pt-4 border-t">
                            <h3 className="text-sm text-gray-600">Timeline</h3>
                            <div className="mt-2 text-sm text-gray-800">
                                <div><span className="font-medium">Created Date:</span> {block.createdDate} {block.createdTime}</div>
                                <div className="mt-1"><span className="font-medium">Expiry Date:</span>
                                    <div className="mt-1">
                                        <input type="date" value={block.expiryDate ? new Date(block.expiryDate).toISOString().slice(0, 10) : ''} onChange={(e) => updateExpiry(block.id, e.target.value)} className="px-2 py-1 border rounded" />
                                    </div>
                                </div>
                                <div className="mt-1"><span className="font-medium">Days to Expiry:</span> {(() => { const d = getDaysToExpiry(block.expiryDate); return d === null ? '-' : (d > 0 ? `${d} days left` : `${Math.abs(d)} days overdue`); })()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-2">Customer Details</h3>
                <p className="text-sm text-gray-700">{block.customer} — {faker.address.city()}, {faker.address.country()}</p>
                <p className="text-sm text-gray-600 mt-2">{block.notes}</p>
            </div>
        </div>
    );
};

export default InventoryBlockDetails;
