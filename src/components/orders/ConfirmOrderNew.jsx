import React, { useState } from 'react';
import { Eye, Download, Search } from 'lucide-react';
import ConfirmOrderDetailsModal from './ConfirmOrderDetailsModal';

const sampleConfirmOrders = [
    { id: 76, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 75, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 74, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 73, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 72, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 71, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 70, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 69, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 68, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' },
    { id: 67, customerName: 'Runaq Al Faaw Al Lama L.L.C.', createdOn: '19-08-2025' }
];

const ConfirmOrderNew = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredData = sampleConfirmOrders.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    const totalPages = Math.ceil(filteredData.length / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + entriesPerPage);

    const handleViewClick = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const handleExport = () => {
        const csv = [['Order ID', 'Customer Name', 'Created On'], ...filteredData.map(o => [o.id, o.customerName, o.createdOn])].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'confirm-orders.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Confirm Orders</h1>
                        <button
                            onClick={handleExport}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export
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
                                <th className="px-4 py-3 text-left font-medium">CUSTOMER NAME</th>
                                <th className="px-4 py-3 text-left font-medium">CREATED ON</th>
                                <th className="px-4 py-3 text-left font-medium">ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentData.map((order, index) => (
                                <tr key={order.id} className={`hover:bg-gray-50 ${order.id === 72 ? 'bg-blue-100' : ''}`}>
                                    <td className="px-4 py-3 text-sm font-medium">{order.id === 67 ? '66/Rev1' : order.id}</td>
                                    <td className="px-4 py-3 text-sm">{order.customerName}</td>
                                    <td className="px-4 py-3 text-sm">{order.createdOn}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleViewClick(order)}
                                            className={`p-2 text-white rounded hover:opacity-80 ${order.id === 67 ? 'bg-yellow-500' : 'bg-green-500'
                                                }`}
                                            title="View Details"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </button>
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

                        {Array.from({ length: Math.min(8, totalPages) }, (_, i) => {
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
            {showModal && selectedOrder && (
                <ConfirmOrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default ConfirmOrderNew;