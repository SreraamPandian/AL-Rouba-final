import React from 'react';
import DataTable from '../ui/DataTable';
import { faker } from '@faker-js/faker';

const AuditTrail = () => {
  const auditLogs = Array.from({ length: 100 }, (_, index) => {
    const entityType = faker.helpers.arrayElement(['Budget', 'Quotation', 'Sales Order', 'FPO', 'Inventory']);
    const action = faker.helpers.arrayElement(['Created', 'Updated', 'Approved', 'Rejected', 'Submitted', 'Deleted', 'Viewed']);
    let details = '';
    if (action === 'Updated') {
        details = `Status: ${faker.helpers.arrayElement(['Pending', 'Draft'])} -> ${faker.helpers.arrayElement(['Submitted', 'Awaiting Approval'])}`;
    } else if (action === 'Approved' || action === 'Rejected') {
        details = `Comment: ${faker.lorem.sentence()}`;
    } else {
        details = `Details: ${faker.lorem.sentence()}`;
    }

    return {
      id: index + 1,
      timestamp: faker.date.recent({ days: 30 }).toISOString(),
      user: faker.person.fullName(),
      entity: `${entityType} ${faker.string.alphanumeric(8).toUpperCase()}`,
      action: action,
      details: details,
    };
  });

  const columns = [
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (ts) => new Date(ts).toLocaleString() },
    { key: 'user', label: 'User', sortable: true },
    { key: 'entity', label: 'Entity', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'details', label: 'Details' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Audit Trail</h1>
          <p className="text-gray-600">Track all significant actions across the system.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-lg font-medium">Filters</h3>
          <input type="text" placeholder="Filter by User" className="px-3 py-2 border rounded-md" />
          <input type="date" className="px-3 py-2 border rounded-md" />
          <select className="px-3 py-2 border rounded-md">
            <option>All Entities</option>
            <option>Enquiry</option>
            <option>Budget</option>
            <option>Sales Order</option>
          </select>
          <select className="px-3 py-2 border rounded-md">
            <option>All Actions</option>
            <option>Created</option>
            <option>Updated</option>
            <option>Approved</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={auditLogs} />
    </div>
  );
};

export default AuditTrail;
