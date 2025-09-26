import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, History } from 'lucide-react';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import { faker } from '@faker-js/faker';

const EnquiryList = () => {
  const navigate = useNavigate();

  // Generate mock data
  const enquiries = Array.from({ length: 25 }, (_, index) => ({
    id: `ENQ-2024-${String(index + 1).padStart(3, '0')}`,
    customer: faker.company.name(),
    productSummary: `${faker.commerce.productName()} (${faker.number.int({ min: 1, max: 10 })} items)`,
    assignedManager: faker.person.fullName(),
    createdDate: faker.date.recent({ days: 30 }).toLocaleDateString(),
    currentStage: faker.helpers.arrayElement([
      'New Enquiry', 'Budget Drafted', 'Budget Submitted', 'Budget Approved',
      'Quotation Generated', 'Quotation Revised', 'Received Order', 'Sales Order Generated', 'Closed'
    ]),
    nextAction: faker.helpers.arrayElement([
      'Create Budget', 'Submit for Approval', 'Generate Quote', 'Follow up'
    ])
  }));

  const columns = [
    {
      key: 'id',
      label: 'Enquiry ID',
      sortable: true,
      render: (value, row) => (
        <button
          onClick={() => navigate(`/enquiries/${row.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {value}
        </button>
      )
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true
    },
    {
      key: 'productSummary',
      label: 'Product Summary',
      render: (value) => (
        <div className="max-w-xs">
          <span title={value} className="truncate block">
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'assignedManager',
      label: 'Assigned Manager',
      sortable: true
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true
    },
    {
      key: 'currentStage',
      label: 'Current Stage',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'nextAction',
      label: 'Next Action',
      render: (value) => (
        <span className="text-sm text-gray-600" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/enquiries/${row.id}`)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/enquiries/${row.id}/edit`)}
            className="p-1 text-gray-600 hover:text-gray-800"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate(`/enquiries/${row.id}/history`)}
            className="p-1 text-purple-600 hover:text-purple-800"
            title="History"
          >
            <History className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const handleRowClick = (row) => {
    navigate(`/enquiries/${row.id}`);
  };

  const handleCreateNew = () => {
    navigate('/enquiries/new');
  };

  const bulkActions = [
    {
      label: 'Export Selected',
      icon: Eye,
      onClick: (selectedIds) => {
        console.log('Exporting:', selectedIds);
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Purple gradient header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 -m-6 mb-6 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Enquiries</h1>
            <p className="text-purple-100 mt-1">Manage customer enquiries and track progress</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Enquiry
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={enquiries}
        onRowClick={handleRowClick}
        selectable={true}
        actions={bulkActions}
        searchable={true}
        filterable={true}
        exportable={true}
      />
    </div>
  );
};

export default EnquiryList;
