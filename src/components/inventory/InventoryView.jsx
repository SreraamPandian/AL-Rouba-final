import React from 'react';
import { X } from 'lucide-react';

const InventoryView = ({ item, onClose }) => {
    return (
        <div className="fixed inset-0 z-40 flex items-start justify-center pt-10">
            <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
            <div className="bg-white w-11/12 md:w-4/5 rounded-lg shadow-lg z-50 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Inventory Details</h2>
                    <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">PRODUCT NAME</div><div className="font-medium">{item.name}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">CATEGORY</div><div className="font-medium">{item.category}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">BRAND</div><div className="font-medium">{item.name}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">PRODUCT ID</div><div className="font-medium">{item.productId}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">DESCRIPTION</div><div className="font-medium">{item.name} details</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">SELLING PRICE</div><div className="font-medium">{item.sellingPrice}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">COST PRICE</div><div className="font-medium">{(item.sellingPrice - 0.25).toFixed(3)}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">UOM</div><div className="font-medium">{item.uom}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">QUANTITY ON HAND</div><div className="font-medium">{item.qtyOnHand}</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">BRANCH</div><div className="font-medium">{item.branch} - Qty ({item.qtyOnHand})</div></div>
                    <div className="p-4 bg-white rounded shadow"> <div className="text-sm text-gray-500">BLOCKED QUANTITY</div><div className="font-medium">{item.allocatedQty}</div></div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 border rounded text-gray-700">Close View</button>
                </div>
            </div>
        </div>
    );
};

export default InventoryView;
