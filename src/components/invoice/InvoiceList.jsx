import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DataTable from '../ui/DataTable';
import { useInvoices } from '../../context/InvoicesContext';

const InvoiceList = () => {
  const navigate = useNavigate();
  const { invoices, deleteInvoice } = useInvoices();

  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'INVOICE ID',
      render: (value, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/invoices/${row.id}`); }}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >{value}</button>
      )
    },
    { key: 'budgetId', label: 'BUDGET ID' },
    { key: 'customer', label: 'CUSTOMER' },
    { key: 'orderValue', label: 'ORDER VALUE', render: (val) => `₹${Number(val).toLocaleString()}` },
    { key: 'createdDate', label: 'ORDER CREATED DATE', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'employee', label: 'EMPLOYEE' },
    { key: 'branch', label: 'BRANCH' },
    {
      key: 'actions',
      label: 'ACTION',
      render: (_, row) => (
        <div className="flex items-center space-x-3" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/invoices/${row.id}`)}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteInvoice(row.id)}
            className="text-sm text-red-600 hover:text-red-700 flex items-center"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ], [navigate, deleteInvoice]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">ORDER LIST</h2>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => navigate('/invoices/new')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Invoice
        </button>
      </div>
      <DataTable
        columns={columns}
        data={invoices}
        onRowClick={(row) => navigate(`/invoices/${row.id}`)}
        selectable={false}
      />
    </div>
  );
};

export default InvoiceList;
