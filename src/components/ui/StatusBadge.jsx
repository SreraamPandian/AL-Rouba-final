import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusConfig = (status) => {
    const statusLower = status?.toLowerCase();
    
    switch (statusLower) {
      case 'draft':
        return { color: 'bg-gray-100 text-gray-800', label: 'Draft' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
      case 'awaiting approval':
        return { color: 'bg-orange-100 text-orange-800', label: 'Awaiting Approval' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', label: 'Approved' };
      case 'blocked':
        return { color: 'bg-purple-100 text-purple-800', label: 'Blocked' };
      case 'partial':
        return { color: 'bg-blue-100 text-blue-800', label: 'Partial' };
      case 'delivered':
        return { color: 'bg-teal-100 text-teal-800', label: 'Delivered' };
      case 'closed':
        return { color: 'bg-gray-900 text-white', label: 'Closed' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', label: 'Rejected' };
      case 'submitted':
        return { color: 'bg-blue-100 text-blue-800', label: 'Submitted' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status || 'Unknown' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
