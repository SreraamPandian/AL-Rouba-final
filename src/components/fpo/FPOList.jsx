import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit } from 'lucide-react';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import { faker } from '@faker-js/faker';

const FPOList = () => {
  const navigate = useNavigate();

  const fpos = Array.from({ length: 10 }, (_, index) => ({
    id: `FPO-2024-${String(index + 1).padStart(3, '0')}`,
    salesOrderId: `SO-2024-${String(faker.number.int({ min: 1, max: 22 })).padStart(3, '0')}`,
    vendor: faker.company.name(),
    status: faker.helpers.arrayElement(['Draft', 'Submitted', 'Approved', 'Vendor Confirmed', 'Shipped', 'Delivered']),
    eta: faker.date.future({ years: 0.2 }).toLocaleDateString(),
    totalValue: faker.finance.amount(2000, 20000, 2, '$'),
  }));

  const columns = [
    {
      key: 'id',
      label: 'FPO No.',
      render: (value, row) => <button onClick={() => navigate(`/fpo/${row.id}`)} className="text-blue-600 hover:text-blue-800 font-medium">{value}</button>,
    },
    { key: 'vendor', label: 'Vendor' },
    { key: 'salesOrderId', label: 'Linked Sales Order' },
    { key: 'eta', label: 'ETA' },
    { key: 'totalValue', label: 'Value' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/fpo/${row.id}`)} className="p-1 text-blue-600" title="View"><Eye className="h-4 w-4" /></button>
          <button onClick={() => navigate(`/fpo/${row.id}`)} className="p-1 text-gray-600" title="Edit"><Edit className="h-4 w-4" /></button>
          {/* Removed truck/track action per request */}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forward Purchase Orders (FPO)</h1>
          <p className="text-gray-600">Manage procurement from vendors for backorders.</p>
        </div>
        <button
          onClick={() => navigate('/fpo/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New FPO
        </button>
      </div>
      <DataTable columns={columns} data={fpos} onRowClick={(row) => navigate(`/fpo/${row.id}`)} selectable={true} />
    </div>
  );
};

export default FPOList;
