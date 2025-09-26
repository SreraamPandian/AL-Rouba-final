import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Plus } from 'lucide-react';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import { faker } from '@faker-js/faker';

const IssuanceList = () => {
  const navigate = useNavigate();

  const issuances = Array.from({ length: 15 }, (_, index) => ({
    id: `ISS-2024-${String(index + 1).padStart(4, '0')}`,
    salesOrderId: `SO-2024-${String(faker.number.int({ min: 1, max: 22 })).padStart(3, '0')}`,
    source: `FPO-${String(faker.number.int({ min: 1, max: 10 })).padStart(3, '0')}`,
    customer: faker.company.name(),
    status: faker.helpers.arrayElement(['Issued', 'Partial', 'Pending']),
    issuedBy: faker.person.fullName(),
    issuedDate: faker.date.recent({ days: 10 }).toLocaleDateString(),
  }));

  const columns = [
    {
      key: 'id',
      label: 'Issuance ID',
      render: (value, row) => <button onClick={() => navigate(`/issuance/${row.id}`)} className="text-blue-600 hover:text-blue-800 font-medium">{value}</button>,
    },
    { key: 'salesOrderId', label: 'Sales Order' },
    { key: 'source', label: 'Source' },
    { key: 'customer', label: 'Customer' },
    { key: 'issuedBy', label: 'Issued By' },
    { key: 'issuedDate', label: 'Issued Date' },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/issuance/${row.id}`)} className="p-1 text-blue-600" title="View Details"><Eye className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Issuance</h1>
          <p className="text-gray-600">Track items issued from the warehouse for delivery.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Manual Issuance
        </button>
      </div>
      <DataTable columns={columns} data={issuances} onRowClick={(row) => navigate(`/issuance/${row.id}`)} />
    </div>
  );
};

export default IssuanceList;
