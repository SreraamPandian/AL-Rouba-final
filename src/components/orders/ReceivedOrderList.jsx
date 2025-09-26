import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Search, Download } from 'lucide-react';
import { useReceivedOrders } from '../../context/ReceivedOrdersContext';

const ReceivedOrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const { orders } = useReceivedOrders();

  const filteredOrders = orders.filter(order =>
    order.budgetId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">RECEIVED ORDERS</h1>
          <button
            onClick={() => navigate('/received-orders/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Received Order
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Export and Show entries */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Search:</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RECEIVED ORDER DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET VALUE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BRANCH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.slice(0, entriesPerPage).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.budgetId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.receivedOrderDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.budgetValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.branch}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/received-orders/edit/${order.id}`)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to {Math.min(entriesPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1 bg-gray-800 text-white rounded text-sm hover:bg-gray-700 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivedOrderList;
