import React, { useState } from 'react';
import { Eye, Printer, Search, Download } from 'lucide-react';

import InvoiceDetailsModal from './InvoiceDetailsModal';

const sampleInvoiceData = [
  {
    id: 1,
    invoiceNumber: 'IAJ/INV/2025/0070',
    saleOrderId: 76,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    saleOrderDate: '19-08-2025',
    invoiceDate: '19-08-2025',
    invoiceAmount: 6001.875,
    status: 'PROCESSED'
  },
  {
    id: 2,
    invoiceNumber: 'IAJ/INV/2025/0069',
    saleOrderId: 75,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    saleOrderDate: '19-08-2025',
    invoiceDate: '19-08-2025',
    invoiceAmount: 4976.4,
    status: 'PROCESSED'
  },
  {
    id: 3,
    invoiceNumber: 'IAJ/INV/2025/0068',
    saleOrderId: 74,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    saleOrderDate: '19-08-2025',
    invoiceDate: '19-08-2025',
    invoiceAmount: 3577.975,
    status: 'PROCESSED'
  },
  {
    id: 4,
    invoiceNumber: 'IAJ/INV/2025/0067',
    saleOrderId: 73,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    saleOrderDate: '19-08-2025',
    invoiceDate: '19-08-2025',
    invoiceAmount: 5954.425,
    status: 'PROCESSED'
  },
  {
    id: 5,
    invoiceNumber: 'IAJ/INV/2025/0066',
    saleOrderId: 72,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    saleOrderDate: '19-08-2025',
    invoiceDate: '19-08-2025',
    invoiceAmount: 1644.925,
    status: 'PROCESSED'
  }
];

const InvoiceList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = sampleInvoiceData.filter(invoice =>
    invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.saleOrderId.toString().includes(searchTerm)
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / entriesPerPage));
  const startIndex = (currentPage - 1) * entriesPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const handleViewClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handlePrint = (invoice) => {
    // simple print placeholder
    window.print();
  };

  const handleExport = () => {
    const csv = [
      ['Invoice Number', 'Sale Order ID', 'Customer Name', 'Sale Order Date', 'Invoice Date', 'Invoice Amount', 'Status'],
      ...filteredData.map(inv => [
        inv.invoiceNumber,
        inv.saleOrderId,
        inv.customerName,
        inv.saleOrderDate,
        inv.invoiceDate,
        inv.invoiceAmount,
        inv.status
      ])
    ].map(r => r.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Invoice List</h1>
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
                <th className="px-4 py-3 text-left font-medium">INVOICE NUMBER</th>
                <th className="px-4 py-3 text-left font-medium">SALE ORDER ID</th>
                <th className="px-4 py-3 text-left font-medium">CUSTOMER NAME</th>
                <th className="px-4 py-3 text-left font-medium">SALE ORDER DATE</th>
                <th className="px-4 py-3 text-left font-medium">INVOICE DATE</th>
                <th className="px-4 py-3 text-left font-medium">INVOICE AMOUNT</th>
                <th className="px-4 py-3 text-left font-medium">STATUS</th>
                <th className="px-4 py-3 text-left font-medium">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{invoice.invoiceNumber}</td>
                  <td className="px-4 py-3 text-sm">{invoice.saleOrderId}</td>
                  <td className="px-4 py-3 text-sm text-blue-600">{invoice.customerName}</td>
                  <td className="px-4 py-3 text-sm">{invoice.saleOrderDate}</td>
                  <td className="px-4 py-3 text-sm">{invoice.invoiceDate}</td>
                  <td className="px-4 py-3 text-sm">{invoice.invoiceAmount}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewClick(invoice)}
                        className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handlePrint(invoice)}
                        className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
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
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm text-gray-700 text-center">
            copyright © 2025 Inventory System. All rights reserved.
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedInvoice && (
        <InvoiceDetailsModal
          invoice={selectedInvoice}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default InvoiceList;