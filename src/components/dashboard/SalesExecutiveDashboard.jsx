import React from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Calculator, FileText, ShoppingCart,
  TrendingUp, Clock, CheckCircle, AlertCircle,
  Plus, Eye
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const SalesExecutiveDashboard = () => {
  const stats = [
    {
      name: 'Pending Approvals',
      value: '3',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/budgets?status=pending'
    },
    {
      name: 'New Enquiries',
      value: '8',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/enquiries?status=new'
    },
    {
      name: 'Active Quotations',
      value: '12',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/quotations?status=active'
    },
    {
      name: 'Sales Orders Today',
      value: '5',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/sales-orders?date=today'
    }
  ];

  const quickActions = [
    { name: 'New Enquiry', href: '/enquiries/new', icon: MessageSquare },
    { name: 'Create Budget', href: '/budget/new', icon: Calculator },
    { name: 'Generate Quotation', href: '/quotations/new', icon: FileText },
    { name: 'New Sales Order', href: '/sales-orders/new', icon: ShoppingCart }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'Budget',
      action: 'submitted for approval',
      item: 'B-2024-001',
      time: '2 hours ago',
      status: 'Pending'
    },
    {
      id: 2,
      type: 'Quotation',
      action: 'sent to customer',
      item: 'Q-2024-015',
      time: '4 hours ago',
      status: 'Sent'
    },
    {
      id: 3,
      type: 'Enquiry',
      action: 'received from',
      item: 'ABC Corp',
      time: '6 hours ago',
      status: 'New'
    },
    {
      id: 4,
      type: 'Sales Order',
      action: 'created',
      item: 'SO-2024-023',
      time: '1 day ago',
      status: 'Ready'
    }
  ];

  const enquiriesByStage = [
    { stage: 'New Enquiry', count: 8, color: 'bg-blue-500' },
    { stage: 'Budget Drafted', count: 5, color: 'bg-yellow-500' },
    { stage: 'Budget Submitted', count: 3, color: 'bg-orange-500' },
    { stage: 'Quotation Generated', count: 12, color: 'bg-green-500' },
    { stage: 'Received Order', count: 7, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.href}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <div className="p-2 bg-blue-50 rounded-lg mr-3">
                  <action.icon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">{action.name}</span>
                <Plus className="h-4 w-4 text-gray-400 ml-auto" />
              </Link>
            ))}
          </div>
        </div>

        {/* Enquiries by Stage */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Enquiries by Stage</h3>
          </div>
          <div className="space-y-4">
            {enquiriesByStage.map((item) => (
              <div key={item.stage} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.stage}</span>
                </div>
                <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-full">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'Budget' && <div className="p-2 bg-orange-100 rounded-lg"><Calculator className="h-4 w-4 text-orange-600" /></div>}
                  {activity.type === 'Quotation' && <div className="p-2 bg-green-100 rounded-lg"><FileText className="h-4 w-4 text-green-600" /></div>}
                  {activity.type === 'Enquiry' && <div className="p-2 bg-blue-100 rounded-lg"><MessageSquare className="h-4 w-4 text-blue-600" /></div>}
                  {activity.type === 'Sales Order' && <div className="p-2 bg-purple-100 rounded-lg"><ShoppingCart className="h-4 w-4 text-purple-600" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.type}</span> {activity.action} <span className="font-semibold text-blue-600">{activity.item}</span>
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    <StatusBadge status={activity.status} />
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

export default SalesExecutiveDashboard;
