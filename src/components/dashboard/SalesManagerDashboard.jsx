import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle, Clock, Users, DollarSign,
  AlertTriangle
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { useBudgets } from '../../context/BudgetContext';
import PendingApprovals from './PendingApprovals';
import { getAllPendingApprovals } from '../../data/mockApprovals';

const SalesManagerDashboard = () => {
  const navigate = useNavigate();
  const { budgets, updateBudget } = useBudgets();

  // Get total pending approvals from all categories
  const allPendingApprovals = getAllPendingApprovals(budgets);
  const totalPendingCount = allPendingApprovals.length;

  const stats = [
    {
      name: 'Pending Approvals',
      value: totalPendingCount,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/approvals'
    },
    {
      name: 'Team Performance',
      value: '92%',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/team-performance'
    },
    {
      name: 'Monthly Revenue',
      value: '$45.2K',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/revenue'
    },
    {
      name: 'Block Requests',
      value: '3',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      href: '/blocking?status=pending'
    }
  ];

  const teamActivity = [
    {
      name: 'John Smith',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=3b82f6&color=fff',
      action: 'Submitted budget B-2024-001',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      name: 'Jane Doe',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=10b981&color=fff',
      action: 'Created quotation Q-2024-018',
      time: '3 hours ago',
      status: 'completed'
    },
    {
      name: 'Mike Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff',
      action: 'Requested inventory block',
      time: '5 hours ago',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards removed per request */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comprehensive Pending Approvals */}
        <PendingApprovals />

        {/* Team Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Team Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {teamActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={activity.avatar}
                    alt={activity.name}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.name}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {activity.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagerDashboard;
