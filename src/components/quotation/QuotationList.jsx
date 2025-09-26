import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, MoreHorizontal } from 'lucide-react';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import { faker } from '@faker-js/faker';

const QuotationList = () => {
  const navigate = useNavigate();

  const quotations = Array.from({ length: 20 }, (_, index) => ({
    id: `QTN-2024-${String(index + 1).padStart(3, '0')}`,
    linkedBudget: `B-2024-${String(faker.number.int({ min: 1, max: 15 })).padStart(3, '0')}`,
    customer: faker.company.name(),
    status: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
    createdDate: faker.date.recent({ days: 30 }).toLocaleDateString(),
    totalValue: faker.finance.amount(5000, 50000, 2, '$'),
    version: `v${faker.number.int({ min: 1, max: 3 })}`,
    quoteSentStatus: faker.helpers.arrayElement(['YES', 'NO'])
  }));

  const [openMenuId, setOpenMenuId] = React.useState(null);

  const handleMenuAction = (id, action) => {
    console.log(`Quotation action '${action}' on ${id}`);
    setOpenMenuId(null);
  };

  const columns = [
    {
      key: 'id',
      label: 'Quotation No.',
      sortable: true,
      render: (value, row) => (
        <button
          onClick={() => navigate(`/quotations/${row.id}`)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {value}
        </button>
      )
    },
    {
      key: 'linkedBudget',
      label: 'Linked Budget',
      sortable: true,
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
    },
    {
      key: 'version',
      label: 'Version',
      render: (value) => <span className="text-sm text-gray-600">{value}</span>
    },
    {
      key: 'totalValue',
      label: 'Total Value',
      sortable: true,
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />
    },
    {
      key: 'quoteSentStatus',
      label: 'QUOTE SENT STATUS',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded ${value === 'YES' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{value}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="relative">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/quotations/${row.id}/view`)}
              className="p-1 text-blue-600 hover:text-blue-800"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate(`/quotations/${row.id}`)}
              className="p-1 text-green-600 hover:text-green-700"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
              className="p-1 text-gray-600 hover:text-gray-800"
              title="More"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          {openMenuId === row.id && (
            <div className="absolute right-0 mt-2 w-40 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1 text-sm">
                <button onClick={() => { setOpenMenuId(null); navigate(`/quotations/${row.id}`); }} className="block w-full text-left px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">Revise</button>
                <button onClick={() => handleMenuAction(row.id, 'Quote Sent')} className="block w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium">Quote Sent</button>
                <button onClick={() => handleMenuAction(row.id, 'Download')} className="block w-full text-left px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium">Download</button>
                <button onClick={() => handleMenuAction(row.id, 'Won')} className="block w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium">Won</button>
                <button onClick={() => handleMenuAction(row.id, 'Lose')} className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium">Lose</button>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  const handleRowClick = (row) => {
    navigate(`/quotations/${row.id}/view`);
  };

  const handleCreateNew = () => {
    navigate('/quotations/new');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quotations</h1>
          <p className="text-gray-600">Manage customer quotations and revisions</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </button>
      </div>

      <DataTable
        columns={columns}
        data={quotations}
        onRowClick={handleRowClick}
        selectable={true}
      />
    </div>
  );
};

export default QuotationList;
