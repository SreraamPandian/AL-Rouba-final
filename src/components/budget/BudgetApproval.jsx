import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useBudgets } from '../../context/BudgetContext';
import StatusBadge from '../ui/StatusBadge';
import ApprovalActionModal from './ApprovalActionModal';

const BudgetApproval = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const decodedId = decodeURIComponent(id);
    const { findBudget, updateBudget } = useBudgets();
    const budget = findBudget(decodedId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalActionType, setModalActionType] = useState(null);

    const openModal = (actionType) => {
        setModalActionType(actionType);
        setIsModalOpen(true);
    };

    const handleSaveAction = (comment) => {
        const newStatus = modalActionType === 'Approve' ? 'Approved' : 'Rejected';
        updateBudget(decodedId, { status: newStatus });
        
        console.log(`AUDIT: Budget ${decodedId} ${newStatus} by Manager. Comment: ${comment}`);
        console.log(`NOTIFICATION: Your budget ${decodedId} has been ${newStatus}.`);

        alert(`Budget has been ${newStatus}.`);
        setIsModalOpen(false);
        navigate('/budgets');
    };

    if (!budget) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-700">Budget Not Found</h2>
                <p className="text-gray-500">The budget with ID '{decodedId}' could not be found.</p>
                <button onClick={() => navigate('/budgets')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Back to Budget List
                </button>
            </div>
        );
    }

    const subTotal = budget.products.reduce((sum, p) => sum + (p.qty * p.unitPrice), 0);
    const discountAmount = (subTotal * budget.discount) / 100;
    const totalAfterDiscount = subTotal - discountAmount;
    const vatAmount = (totalAfterDiscount * budget.vat) / 100;
    const freightTotal = (budget.freightCharges?.landFreight || 0) + (budget.freightCharges?.airFreight || 0) + (budget.freightCharges?.seaFreight || 0);
    const grandTotal = totalAfterDiscount + vatAmount + freightTotal;


    return (
        <div className="pb-24">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigate('/budgets')} className="p-2 hover:bg-gray-100 rounded-lg">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Budget Approval: {budget.budgetId}</h1>
                            <p className="text-gray-600">Review and approve or reject the budget details.</p>
                        </div>
                        <StatusBadge status={budget.status} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Entered By:</label>
                            <input value={budget.employee} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch:</label>
                            <input value={budget.branch} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry ID:</label>
                            <input value={budget.enquiryId} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Date:</label>
                            <input type="date" value={budget.budgetDate} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <input value={budget.paymentDays} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        <input value={budget.taxType} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        <input value={budget.deliveryDays} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        <input value={budget.licensesOffering} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        <input value={budget.paymentTerm} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        <input value={budget.currency} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                        <input value={budget.shipping} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Notes:</label>
                        <textarea value={budget.notes} disabled rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    
                    <h3 className="text-lg font-medium mb-4">Products</h3>
                    <div className="overflow-x-auto mb-6">
                        <table className="min-w-full bg-white border">
                            <thead className="bg-gray-50">
                                <tr>
                                    {[
                                        "Product", "Description", "UOM", "Quantity", "Buying Price", "Tax %", "Total Buying", "Total with Tax",
                                        "Margin %", "Selling Price", "Tax %", "Total Selling", "Total Selling with Tax"
                                    ].map((h, index) => <th key={`${h}-${index}`} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {budget.products.map(p => {
                                    const totalBuying = p.qty * p.unitPrice;
                                    const totalBuyingWithTax = totalBuying * (1 + (p.buyingTax || 0) / 100);
                                    const sellingPrice = p.unitPrice * (1 + (p.margin || 0) / 100);
                                    const totalSelling = p.qty * sellingPrice;
                                    const totalSellingWithTax = totalSelling * (1 + (p.sellingTax || 0) / 100);
                                    return (
                                        <tr key={p.id} className="border-b">
                                            <td className="px-4 py-2 border">{p.name}</td>
                                            <td className="px-4 py-2 border">{p.description}</td>
                                            <td className="px-4 py-2 border">{p.unit}</td>
                                            <td className="px-4 py-2 border">{p.qty}</td>
                                            <td className="px-4 py-2 border">{p.unitPrice.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">{p.buyingTax}%</td>
                                            <td className="px-4 py-2 border">{totalBuying.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">{totalBuyingWithTax.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">{p.margin}%</td>
                                            <td className="px-4 py-2 border">{sellingPrice.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">{p.sellingTax}%</td>
                                            <td className="px-4 py-2 border">{totalSelling.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">{totalSellingWithTax.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-gray-900">Freight Charges</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between"><p>Land Freight:</p><p>{budget.freightCharges.landFreight.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Air Freight:</p><p>{budget.freightCharges.airFreight.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Sea Freight:</p><p>{budget.freightCharges.seaFreight.toFixed(2)}</p></div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-gray-900">Totals</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between"><p>Discount (%):</p><p>{budget.discount}</p></div>
                                <div className="flex justify-between"><p>Sub Total:</p><p>{subTotal.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Discount:</p><p>-{discountAmount.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>VAT ({budget.vat}%):</p><p>+{vatAmount.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Freight:</p><p>+{freightTotal.toFixed(2)}</p></div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><p>Grand Total:</p><p>{grandTotal.toFixed(2)}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-white border-t p-4 shadow-lg flex justify-end space-x-4">
                <button 
                    onClick={() => openModal('Reject')} 
                    className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                    <X className="h-5 w-5 mr-2" />
                    Reject
                </button>
                <button 
                    onClick={() => openModal('Approve')} 
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                    <Check className="h-5 w-5 mr-2" />
                    Approve
                </button>
            </div>

            {isModalOpen && (
                <ApprovalActionModal
                    actionType={modalActionType}
                    budgetId={budget.budgetId}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveAction}
                />
            )}
        </div>
    );
};

export default BudgetApproval;
