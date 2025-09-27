import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, CheckCircle, XCircle, Eye, AlertTriangle,
    FileText, Package, ShoppingCart, DollarSign, Clipboard
} from 'lucide-react';
import {
    getAllPendingApprovals,
    getApprovalsByCategory,
    getPriorityColor,
    getCategoryColor
} from '../../data/mockApprovals';
import { useBudgets } from '../../context/BudgetContext';

const PendingApprovals = () => {
    const navigate = useNavigate();
    const { budgets, updateBudget } = useBudgets();
    const [activeTab, setActiveTab] = useState('All');

    const approvalsByCategory = getApprovalsByCategory(budgets);
    const allApprovals = getAllPendingApprovals(budgets);

    const tabIcons = {
        'All': FileText,
        'Budget': DollarSign,
        'FPO': Package,
        'Inventory Block': AlertTriangle,
        'Sales Order': ShoppingCart,
        'Quotation': Clipboard
    };

    const tabs = [
        { key: 'All', label: 'All', count: allApprovals.length },
        ...Object.keys(approvalsByCategory).map(category => ({
            key: category,
            label: category,
            count: approvalsByCategory[category].length
        }))
    ];

    const displayedApprovals = activeTab === 'All'
        ? allApprovals
        : approvalsByCategory[activeTab] || [];

    const handleApprove = (approval) => {
        if (approval.type === 'Budget') {
            updateBudget(approval.id, { status: 'Approved' });
            alert(`Budget ${approval.id} has been approved.`);
        } else {
            // For other types, just show confirmation for now
            alert(`${approval.type} ${approval.id} has been approved.`);
        }
    };

    const handleReject = (approval) => {
        if (approval.type === 'Budget') {
            updateBudget(approval.id, { status: 'Rejected' });
            alert(`Budget ${approval.id} has been rejected.`);
        } else {
            alert(`${approval.type} ${approval.id} has been rejected.`);
        }
    };

    const handleReview = (approval) => {
        switch (approval.type) {
            case 'Budget':
                navigate(`/budget/${encodeURIComponent(approval.id)}/approve`);
                break;
            case 'FPO':
                navigate(`/fpo/${approval.id}`, { state: { from: '/sales-executive' } });
                break;
            case 'Inventory Block':
                navigate(`/blocking`);
                break;
            case 'Sales Order':
                navigate(`/received-orders`);
                break;
            case 'Quotation':
                navigate(`/quotations`);
                break;
            default:
                alert(`Review feature for ${approval.type} coming soon`);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatCurrency = (value, currency = 'OMR') => {
        return `${currency} ${typeof value === 'number' ? value.toFixed(2) : value}`;
    };

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                        {allApprovals.length} pending
                    </span>
                </div>

                {/* Category Tabs */}
                <div className="mt-4">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tabIcons[tab.key] || FileText;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.key
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                        {tab.count > 0 && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Approvals List */}
            <div className="max-h-96 overflow-y-auto">
                {displayedApprovals.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No pending approvals</p>
                        <p className="text-sm">All {activeTab === 'All' ? '' : activeTab.toLowerCase()} items are up to date.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {displayedApprovals.map((approval) => (
                            <div key={`${approval.type}-${approval.id}`} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {approval.type === 'Budget' && <DollarSign className="h-5 w-5 text-blue-500" />}
                                                {approval.type === 'FPO' && <Package className="h-5 w-5 text-purple-500" />}
                                                {approval.type === 'Inventory Block' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                                {approval.type === 'Sales Order' && <ShoppingCart className="h-5 w-5 text-green-500" />}
                                                {approval.type === 'Quotation' && <Clipboard className="h-5 w-5 text-indigo-500" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {approval.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {approval.description}
                                                </p>
                                                <div className="flex items-center space-x-4 mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        By {approval.submittedBy} • {formatDate(approval.submittedDate)}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(approval.priority)}`}>
                                                        {approval.priority}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(approval.category)}`}>
                                                        {approval.category}
                                                    </span>
                                                </div>

                                                {/* Additional Details */}
                                                <div className="mt-2 text-xs text-gray-500">
                                                    {approval.details.customer && (
                                                        <span>Customer: {approval.details.customer}</span>
                                                    )}
                                                    {approval.details.vendor && (
                                                        <span>Vendor: {approval.details.vendor}</span>
                                                    )}
                                                    {approval.details.value && (
                                                        <span className="ml-4">
                                                            Value: {formatCurrency(approval.details.value, approval.details.currency)}
                                                        </span>
                                                    )}
                                                    {approval.details.quantity && (
                                                        <span className="ml-4">
                                                            Qty: {approval.details.quantity} {approval.details.unit}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleReview(approval)}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            Review
                                        </button>
                                        <button
                                            onClick={() => handleReject(approval)}
                                            className="inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        >
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Reject
                                        </button>
                                        <button
                                            onClick={() => handleApprove(approval)}
                                            className="inline-flex items-center px-3 py-1.5 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Approve
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer with View All Link */}
            {displayedApprovals.length > 0 && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={() => navigate('/approvals')}
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View all pending approvals →
                    </button>
                </div>
            )}
        </div>
    );
};

export default PendingApprovals;