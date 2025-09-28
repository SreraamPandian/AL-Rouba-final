import React, { useState } from 'react';
import { Eye, Printer, Search, ChevronDown } from 'lucide-react';
import CheckInDetailsModal from './CheckInDetailsModal';
import AddCheckIn from './AddCheckIn';

const sampleCheckInData = [
    {
        id: 47,
        checkInId: 46,
        supplierInvoiceNo: '0658',
        batchNo: '47/00047',
        supplier: 'Modern Khuwairat Farms Ltd.',
        totalQuantity: 33568,
        goodQuantity: 33568,
        badQuantity: 0,
        items: [
            { name: 'Day Old Chicken', goodQuantity: 33233, badQuantity: 0, shortageQuantity: 0 },
            { name: 'Day Old Chicken', goodQuantity: 335, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 46,
        checkInId: 45,
        supplierInvoiceNo: '10496',
        batchNo: '46/00046',
        supplier: 'Naseem Al Laajal',
        totalQuantity: 120,
        goodQuantity: 0,
        badQuantity: 0,
        items: [
            { name: 'Feed Supplement', goodQuantity: 0, badQuantity: 0, shortageQuantity: 120 }
        ]
    },
    {
        id: 45,
        checkInId: 44,
        supplierInvoiceNo: '05072025',
        batchNo: '45/00045',
        supplier: 'Hamad Saif Hamed Al Ghafri Trad.',
        totalQuantity: 50,
        goodQuantity: 50,
        badQuantity: 0,
        items: [
            { name: 'Poultry Equipment', goodQuantity: 50, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 44,
        checkInId: 43,
        supplierInvoiceNo: '0068',
        batchNo: '44/00044',
        supplier: 'FIAFY AL BAREEK TRADING',
        totalQuantity: 400,
        goodQuantity: 400,
        badQuantity: 0,
        items: [
            { name: 'Veterinary Supplies', goodQuantity: 400, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 43,
        checkInId: 42,
        supplierInvoiceNo: '95218A',
        batchNo: '43/00043',
        supplier: 'Rahim Rumays',
        totalQuantity: 240,
        goodQuantity: 240,
        badQuantity: 0,
        items: [
            { name: 'Feed Concentrate', goodQuantity: 240, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 42,
        checkInId: 41,
        supplierInvoiceNo: '38559',
        batchNo: '42/00042',
        supplier: 'Hamad Saif Hamed Al Ghafri Trad.',
        totalQuantity: 274,
        goodQuantity: 274,
        badQuantity: 0,
        items: [
            { name: 'Medical Equipment', goodQuantity: 274, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 41,
        checkInId: 40,
        supplierInvoiceNo: '47288',
        batchNo: '41/00041',
        supplier: 'Hamad Saif Hamed Al Ghafri Trad.',
        totalQuantity: 50,
        goodQuantity: 50,
        badQuantity: 0,
        items: [
            { name: 'Cleaning Supplies', goodQuantity: 50, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 40,
        checkInId: 39,
        supplierInvoiceNo: 'SO 000170969',
        batchNo: '40/00040',
        supplier: 'Oman Flour Mills Company (S.A.O.G)',
        totalQuantity: 300,
        goodQuantity: 300,
        badQuantity: 0,
        items: [
            { name: 'Flour Products', goodQuantity: 300, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 39,
        checkInId: 38,
        supplierInvoiceNo: '239',
        batchNo: '39/00039',
        supplier: 'Modern Khuwairat Farms Ltd.',
        totalQuantity: 32356,
        goodQuantity: 32356,
        badQuantity: 0,
        items: [
            { name: 'Live Birds', goodQuantity: 32356, badQuantity: 0, shortageQuantity: 0 }
        ]
    },
    {
        id: 38,
        checkInId: 37,
        supplierInvoiceNo: 'SO000170511',
        batchNo: '38/00038',
        supplier: 'Oman Flour Mills Company (S.A.O.G)',
        totalQuantity: 300,
        goodQuantity: 300,
        badQuantity: 0,
        items: [
            { name: 'Grain Products', goodQuantity: 300, badQuantity: 0, shortageQuantity: 0 }
        ]
    }
];

const CheckInProcess = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = sampleCheckInData.filter(item =>
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplierInvoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batchNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const handleViewClick = (record) => {
        setSelectedRecord(record);
        setShowModal(true);
    };

    const handlePrint = (record) => {
        // Print functionality
        window.print();
    };

    const [showAddCheckIn, setShowAddCheckIn] = useState(false);

    const handleCheckIn = () => {
        // Open the Add Check In modal
        setShowAddCheckIn(true);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Check In Process</h1>
                        <button
                            onClick={handleCheckIn}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            + Check In
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">Show</span>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 text-sm"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-sm text-gray-700">entries</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-700">Search:</span>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 pl-8 text-sm w-64"
                                    placeholder="Search..."
                                />
                                <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">ORDER ID</th>
                                <th className="px-4 py-3 text-left font-medium">CHECK IN ID</th>
                                <th className="px-4 py-3 text-left font-medium">SUPPLIER INVOICE NO</th>
                                <th className="px-4 py-3 text-left font-medium">BATCH NO</th>
                                <th className="px-4 py-3 text-left font-medium">SUPPLIER</th>
                                <th className="px-4 py-3 text-left font-medium">TOTAL QUANTITY</th>
                                <th className="px-4 py-3 text-left font-medium">GOOD QUANTITY</th>
                                <th className="px-4 py-3 text-left font-medium">BAD QUANTITY</th>
                                <th className="px-4 py-3 text-left font-medium">DETAILS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentData.map((record, index) => (
                                <tr key={record.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm">{record.id}</td>
                                    <td className="px-4 py-3 text-sm">{record.checkInId}</td>
                                    <td className="px-4 py-3 text-sm">{record.supplierInvoiceNo}</td>
                                    <td className="px-4 py-3 text-sm">{record.batchNo}</td>
                                    <td className="px-4 py-3 text-sm">{record.supplier}</td>
                                    <td className="px-4 py-3 text-sm">{record.totalQuantity.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm">{record.goodQuantity.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-sm">{record.badQuantity}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleViewClick(record)}
                                                className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePrint(record)}
                                                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                title="Print"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredData.length)} of {filteredData.length} entries
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 border rounded text-sm ${currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedRecord && (
                <CheckInDetailsModal
                    record={selectedRecord}
                    onClose={() => setShowModal(false)}
                />
            )}

            {showAddCheckIn && (
                <AddCheckIn onClose={() => setShowAddCheckIn(false)} />
            )}
        </div>
    );
};

export default CheckInProcess;