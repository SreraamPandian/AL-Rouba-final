import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit } from 'lucide-react';
import DataTable from '../ui/DataTable';
import StatusBadge from '../ui/StatusBadge';
import { useSalesOrders } from '../../context/SalesOrdersContext';

const SalesOrderList = () => {
  const navigate = useNavigate();
  const { salesOrders } = useSalesOrders();

  const columns = [
    {
      key: 'id',
      label: 'Sales Order No.',
      render: (value, row) => <button onClick={() => navigate(`/sales-orders/${row.id}`)} className="text-blue-600 hover:text-blue-800 font-medium">{value}</button>,
    },
    {
      key: 'receivedOrderId',
      label: 'Linked Received Order',
      render: (value) => <span className="text-gray-700">{value}</span>
    },
    { key: 'customer', label: 'Customer' },
    { key: 'deliveryDate', label: 'Scheduled Delivery' },
    {
      key: 'totalValue',
      label: 'Value',
      render: (value) => `$${value.toFixed(2)}`
    },
    { key: 'status', label: 'Status', render: (value) => <StatusBadge status={value} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button onClick={() => navigate(`/sales-orders/${row.id}`)} className="p-1 text-blue-600" title="View"><Eye className="h-4 w-4" /></button>
          <button onClick={() => navigate(`/sales-orders/${row.id}`)} className="p-1 text-gray-600" title="Edit"><Edit className="h-4 w-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-gray-600">Manage delivery orders and fulfillment.</p>
        </div>
        <button
          onClick={() => navigate('/sales-orders/new')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Sales Order
        </button>
      </div>
      <DataTable columns={columns} data={salesOrders} onRowClick={(row) => navigate(`/sales-orders/${row.id}`)} selectable={true} />
    </div>
  );
};

export default SalesOrderList;
