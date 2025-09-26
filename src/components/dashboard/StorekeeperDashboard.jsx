import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Truck, ArrowDownCircle, ArrowUpCircle, 
  AlertTriangle, CheckCircle, Clock, Archive
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const StorekeeperDashboard = () => {
  const stats = [
    {
      name: 'FPOs in Transit',
      value: '4',
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/fpo?status=shipped'
    },
    {
      name: 'Pending Receipts',
      value: '6',
      icon: ArrowDownCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/inward?status=pending'
    },
    {
      name: 'Ready to Issue',
      value: '12',
      icon: ArrowUpCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/issuance?status=ready'
    },
    {
      name: 'Low Stock Items',
      value: '8',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/inventory?status=low'
    }
  ];

  const inventorySnapshot = [
    { category: 'Available', count: 1245, color: 'bg-green-500' },
    { category: 'Blocked', count: 56, color: 'bg-purple-500' },
    { category: 'Reserved', count: 89, color: 'bg-blue-500' },
    { category: 'Low Stock', count: 8, color: 'bg-red-500' }
  ];

  const recentDeliveries = [
    {
      id: 1,
      fpo: 'F-2024-003',
      vendor: 'ABC Supplies',
      items: 'Electronic Components',
      received: '45/50 units',
      status: 'Partial',
      time: '2 hours ago'
    },
    {
      id: 2,
      fpo: 'F-2024-001',
      vendor: 'XYZ Parts',
      items: 'Mechanical Parts',
      received: '100/100 units',
      status: 'Complete',
      time: '1 day ago'
    },
    {
      id: 3,
      fpo: 'F-2024-005',
      vendor: 'DEF Materials',
      items: 'Raw Materials',
      received: '75/80 units',
      status: 'Partial',
      time: '2 days ago'
    }
  ];

  const pendingIssuances = [
    {
      id: 1,
      so: 'SO-2024-015',
      customer: 'Tech Corp',
      items: 'Laptop Components',
      quantity: '25 units',
      priority: 'High',
      dueDate: 'Today'
    },
    {
      id: 2,
      so: 'SO-2024-018',
      customer: 'Industrial Ltd',
      items: 'Motor Parts',
      quantity: '10 units',
      priority: 'Medium',
      dueDate: 'Tomorrow'
    },
    {
      id: 3,
      so: 'SO-2024-012',
      customer: 'Manufacturing Co',
      items: 'Steel Components',
      quantity: '15 units',
      priority: 'Low',
      dueDate: 'Next Week'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Snapshot */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Snapshot</h3>
          <div className="space-y-4">
            {inventorySnapshot.map((item) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-sm text-gray-700">{item.category}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deliveries */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Deliveries</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentDeliveries.map((delivery) => (
              <div key={delivery.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {delivery.fpo}
                      </span>
                      <StatusBadge status={delivery.status} />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{delivery.vendor}</p>
                    <p className="text-sm text-gray-600">{delivery.items}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {delivery.received} • {delivery.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Issuances */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Pending Issuances</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingIssuances.map((issuance) => (
              <div key={issuance.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {issuance.so}
                      </span>
                      <StatusBadge 
                        status={issuance.priority === 'High' ? 'awaiting approval' : 'pending'} 
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{issuance.customer}</p>
                    <p className="text-sm text-gray-600">{issuance.items}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {issuance.quantity} • Due: {issuance.dueDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorekeeperDashboard;
