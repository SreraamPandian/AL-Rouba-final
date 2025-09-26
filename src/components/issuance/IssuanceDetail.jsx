import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Truck, AlertCircle } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const IssuanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const issuance = {
    id,
    salesOrderId: 'SO-2024-018',
    sourceFpoId: 'FPO-2024-009',
    sourceInwardId: 'INW-2024-012',
    customer: 'Industrial Ltd',
    issuedBy: 'Mike Wilson (Storekeeper)',
    issuedDate: '2024-03-10',
    status: 'Issued',
    items: [
      { code: 'MOT-001', name: 'Motor Parts', issuedQty: 10, batchNo: 'B-MP-0310', allocatedTo: 'SO-2024-018 Line 1' },
      { code: 'SEN-005', name: 'Sensor Array', issuedQty: 5, batchNo: 'B-SA-0310', allocatedTo: 'SO-2024-018 Line 2' },
    ],
    notes: 'Items packed and ready for dispatch. Awaiting pickup by logistics partner.',
    attachments: [
      { name: 'vendor_invoice_VI-5823.pdf', url: '#' },
      { name: 'packing_list_PL-5823.pdf', url: '#' },
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/issuance')} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issuance Confirmation {issuance.id}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>From Inward: 
                    <button className="text-blue-600 hover:underline ml-1">{issuance.sourceInwardId}</button>
                </span>
                <span>Source FPO: 
                    <button className="text-blue-600 hover:underline ml-1">{issuance.sourceFpoId}</button>
                </span>
            </div>
          </div>
          <StatusBadge status={issuance.status} />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Download Issuance Note
        </button>
      </div>

      {/* Details Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Issuance Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <p className="text-sm text-gray-500">Allocated to Sales Order</p>
                <p className="font-medium text-blue-600 hover:underline cursor-pointer">{issuance.salesOrderId}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{issuance.customer}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">Issued By / Date</p>
                <p className="font-medium">{issuance.issuedBy} on {issuance.issuedDate}</p>
            </div>
        </div>
      </div>
      
      {/* Issued Items Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b"><h2 className="text-lg font-medium text-gray-900">Issued Items</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch/Serial No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Allocated To</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {issuance.items.map(item => (
                <tr key={item.code}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.name} ({item.code})</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.issuedQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.batchNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.allocatedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes & Attachments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Issuance Notes</h2>
            <p className="text-sm text-gray-700">{issuance.notes || 'No notes provided.'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Linked Attachments</h2>
            <ul className="space-y-2">
                {issuance.attachments.map((file, index) => (
                    <li key={index} className="flex items-center text-sm">
                        <FileText className="h-4 w-4 mr-2 text-gray-500"/>
                        <a href={file.url} className="text-blue-600 hover:underline">{file.name}</a>
                    </li>
                ))}
            </ul>
        </div>
      </div>

      {/* Post-Issuance Status */}
      <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg" role="alert">
        <div className="flex">
          <div className="py-1"><AlertCircle className="h-5 w-5 mr-3"/></div>
          <div>
            <p className="font-bold">Inventory Updated</p>
            <p className="text-sm">The issued quantities have been deducted from available stock. The linked Sales Order lines now show as 'Allocated' and are ready for dispatch scheduling.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssuanceDetail;
