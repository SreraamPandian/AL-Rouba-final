import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBudgetById } from '../../data/mockBudgets';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const BudgetManagerView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const budget = getBudgetById(id);

    const [showApprovalModal, setShowApprovalModal] = useState(false);
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [approvalComment, setApprovalComment] = useState('');
    const [rejectionComment, setRejectionComment] = useState('');

    if (!budget) return <div className="p-8 text-center text-red-600">Budget not found.</div>;

    const handleApprove = () => {
        // Update budget status to Approved
        budget.status = 'Approved';
        budget.approvedBy = user.name;
        budget.approvedAt = new Date().toISOString();
        budget.approvalComment = approvalComment;

        // Add audit trail entry
        const auditEntry = {
            id: Date.now(),
            action: 'Budget Approved',
            budgetId: budget.budgetId,
            performedBy: user.name,
            timestamp: new Date().toISOString(),
            comment: approvalComment || 'No comment provided'
        };

        // Send notification to Sales Executive
        addNotification({
            id: Date.now(),
            type: 'success',
            title: 'Budget Approved',
            message: `Budget ${budget.budgetId} has been approved by ${user.name}`,
            timestamp: new Date().toISOString(),
            read: false,
            recipient: budget.employee
        });

        setShowApprovalModal(false);
        navigate('/budgets');
    };

    const handleReject = () => {
        if (!rejectionComment.trim()) {
            alert('Rejection comment is required');
            return;
        }

        // Update budget status to Rejected
        budget.status = 'Rejected';
        budget.rejectedBy = user.name;
        budget.rejectedAt = new Date().toISOString();
        budget.rejectionComment = rejectionComment;

        // Add audit trail entry
        const auditEntry = {
            id: Date.now(),
            action: 'Budget Rejected',
            budgetId: budget.budgetId,
            performedBy: user.name,
            timestamp: new Date().toISOString(),
            comment: rejectionComment
        };

        // Send notification to Sales Executive
        addNotification({
            id: Date.now(),
            type: 'error',
            title: 'Budget Rejected',
            message: `Budget ${budget.budgetId} has been rejected by ${user.name}. Comment: ${rejectionComment}`,
            timestamp: new Date().toISOString(),
            read: false,
            recipient: budget.employee
        });

        setShowRejectionModal(false);
        navigate('/budgets');
    };

    return (
        <div className="bg-white rounded-lg p-6 space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manager Review - Budget {budget.budgetId}</h2>
                <button onClick={() => navigate('/budgets')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Back to List
                </button>
            </div>

            {/* Budget Details - Same as BudgetView but read-only for managers */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Payment Days</label>
                    <input value={budget.budgetDetails?.paymentDays || budget.paymentDays || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Tax Type</label>
                    <input value={budget.budgetDetails?.taxType || budget.taxType || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Delivery Days</label>
                    <input value={budget.budgetDetails?.deliveryDays || budget.deliveryDays || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Licenses Offering</label>
                    <input value={budget.budgetDetails?.licensesOffering || budget.licensesOffering || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Payment Term</label>
                    <input value={budget.budgetDetails?.paymentTerm || budget.paymentTerm || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Currency</label>
                    <input value={budget.budgetDetails?.currency || budget.currency || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Shipping</label>
                    <input value={budget.budgetDetails?.shipping || budget.shipping || ''} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
                </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-700">Notes:</label>
                <textarea value={budget.budgetDetails?.notes || budget.notes || ''} readOnly rows={3} className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
            </div>

            {/* Products Table */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Products</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UOM</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Unit Price</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budget.products.map((product, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2">{product.name}</td>
                                    <td className="px-4 py-2">{product.description}</td>
                                    <td className="px-4 py-2">{product.unit}</td>
                                    <td className="px-4 py-2">{product.qty}</td>
                                    <td className="px-4 py-2">{product.price}</td>
                                    <td className="px-4 py-2">{product.qty * product.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Budget Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <h3 className="text-lg font-medium mb-4">Budget Information</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-700">Employee:</span>
                            <span className="text-gray-900">{budget.employee}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Customer:</span>
                            <span className="text-gray-900">{budget.customer}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Budget Value:</span>
                            <span className="text-gray-900 font-semibold">{budget.budgetValue} OMR</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Current Status:</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${budget.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                budget.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>{budget.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Action Buttons at Bottom - Only show if status is Pending */}
            {budget.status === 'Pending' && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                    <div className="max-w-6xl mx-auto flex justify-end space-x-4">
                        <button
                            onClick={() => setShowRejectionModal(true)}
                            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Reject Budget
                        </button>
                        <button
                            onClick={() => setShowApprovalModal(true)}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                        >
                            Approve Budget
                        </button>
                    </div>
                </div>
            )}

            {/* Approval Modal */}
            {showApprovalModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Approve Budget</h3>
                        <p className="text-gray-600 mb-4">Are you sure you want to approve budget {budget.budgetId}?</p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Comment (Optional):</label>
                            <textarea
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                                rows={3}
                                placeholder="Add your approval comments..."
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowApprovalModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Confirm Approval
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Reject Budget</h3>
                        <p className="text-gray-600 mb-4">Please provide a reason for rejecting budget {budget.budgetId}:</p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Rejection Comment (Required):</label>
                            <textarea
                                value={rejectionComment}
                                onChange={(e) => setRejectionComment(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={3}
                                placeholder="Explain why this budget is being rejected..."
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowRejectionModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BudgetManagerView;