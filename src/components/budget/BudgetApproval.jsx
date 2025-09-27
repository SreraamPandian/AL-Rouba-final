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
    const [editable, setEditable] = useState(() => {
        if (!budget) return null;
        // clone minimal editable subset to local state
        return {
            employee: budget.employee || '',
            branch: budget.branch || '',
            enquiryId: budget.enquiryId || '',
            budgetDate: budget.budgetDate || new Date().toISOString().split('T')[0],
            notes: budget.notes || '',
            paymentDays: budget.paymentDays || budget.budgetDetails?.paymentDays || '',
            taxType: budget.taxType || budget.budgetDetails?.taxType || '',
            deliveryDays: budget.deliveryDays || budget.budgetDetails?.deliveryDays || '',
            licensesOffering: budget.licensesOffering || budget.budgetDetails?.licensesOffering || '',
            paymentTerm: budget.paymentTerm || budget.budgetDetails?.paymentTerm || '',
            currency: budget.currency || budget.budgetDetails?.currency || 'OMR',
            shipping: budget.shipping || budget.budgetDetails?.shipping || '',
            discount: budget.discount ?? 0,
            vat: budget.vat ?? 5,
            freightCharges: {
                landFreight: budget.freightCharges?.landFreight || 0,
                airFreight: budget.freightCharges?.airFreight || 0,
                seaFreight: budget.freightCharges?.seaFreight || 0,
            },
            products: (budget.products || []).map(p => ({ ...p }))
        };
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalActionType, setModalActionType] = useState(null);

    const openModal = (actionType) => {
        setModalActionType(actionType);
        setIsModalOpen(true);
    };

    const handleSaveAction = (comment) => {
        const newStatus = modalActionType === 'Approve' ? 'Approved' : 'Rejected';
        // Persist edits plus status
        updateBudget(decodedId, {
            status: newStatus,
            employee: editable.employee,
            branch: editable.branch,
            enquiryId: editable.enquiryId,
            budgetDate: editable.budgetDate,
            notes: editable.notes,
            paymentDays: editable.paymentDays,
            taxType: editable.taxType,
            deliveryDays: editable.deliveryDays,
            licensesOffering: editable.licensesOffering,
            paymentTerm: editable.paymentTerm,
            currency: editable.currency,
            shipping: editable.shipping,
            discount: editable.discount,
            vat: editable.vat,
            freightCharges: editable.freightCharges,
            products: editable.products
        });

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

    const subTotal = (editable?.products || []).reduce((sum, p) => sum + (p.qty * p.unitPrice), 0);
    const discountAmount = (subTotal * (editable?.discount || 0)) / 100;
    const totalAfterDiscount = subTotal - discountAmount;
    const vatAmount = (totalAfterDiscount * (editable?.vat || 0)) / 100;
    const freightTotal = (editable?.freightCharges?.landFreight || 0) + (editable?.freightCharges?.airFreight || 0) + (editable?.freightCharges?.seaFreight || 0);
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
                            <input value={editable.employee} onChange={(e) => setEditable(prev => ({ ...prev, employee: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch:</label>
                            <input value={editable.branch} onChange={(e) => setEditable(prev => ({ ...prev, branch: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry ID:</label>
                            <input value={editable.enquiryId} onChange={(e) => setEditable(prev => ({ ...prev, enquiryId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Date:</label>
                            <input type="date" value={editable.budgetDate} onChange={(e) => setEditable(prev => ({ ...prev, budgetDate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <input value={editable.paymentDays} onChange={(e) => setEditable(prev => ({ ...prev, paymentDays: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        <input value={editable.taxType} onChange={(e) => setEditable(prev => ({ ...prev, taxType: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        <input value={editable.deliveryDays} onChange={(e) => setEditable(prev => ({ ...prev, deliveryDays: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        <input value={editable.licensesOffering} onChange={(e) => setEditable(prev => ({ ...prev, licensesOffering: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        <input value={editable.paymentTerm} onChange={(e) => setEditable(prev => ({ ...prev, paymentTerm: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        <input value={editable.currency} onChange={(e) => setEditable(prev => ({ ...prev, currency: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                        <input value={editable.shipping} onChange={(e) => setEditable(prev => ({ ...prev, shipping: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Notes:</label>
                        <textarea value={editable.notes} onChange={(e) => setEditable(prev => ({ ...prev, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
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
                                {editable.products.map((p, rowIdx) => {
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
                                            <td className="px-4 py-2 border"><input type="number" value={p.qty} onChange={(e) => setEditable(prev => ({ ...prev, products: prev.products.map((x, i) => i === rowIdx ? { ...x, qty: parseFloat(e.target.value) || 0 } : x) }))} className="w-20 px-2 py-1 border rounded" /></td>
                                            <td className="px-4 py-2 border"><input type="number" value={p.unitPrice} onChange={(e) => setEditable(prev => ({ ...prev, products: prev.products.map((x, i) => i === rowIdx ? { ...x, unitPrice: parseFloat(e.target.value) || 0 } : x) }))} className="w-24 px-2 py-1 border rounded" /></td>
                                            <td className="px-4 py-2 border"><input type="number" value={p.buyingTax} onChange={(e) => setEditable(prev => ({ ...prev, products: prev.products.map((x, i) => i === rowIdx ? { ...x, buyingTax: parseFloat(e.target.value) || 0 } : x) }))} className="w-20 px-2 py-1 border rounded" /></td>
                                            <td className="px-4 py-2 border">{totalBuying.toFixed(2)}</td>
                                            <td className="px-4 py-2 border">{totalBuyingWithTax.toFixed(2)}</td>
                                            <td className="px-4 py-2 border"><input type="number" value={p.margin} onChange={(e) => setEditable(prev => ({ ...prev, products: prev.products.map((x, i) => i === rowIdx ? { ...x, margin: parseFloat(e.target.value) || 0 } : x) }))} className="w-20 px-2 py-1 border rounded" /></td>
                                            <td className="px-4 py-2 border">{sellingPrice.toFixed(2)}</td>
                                            <td className="px-4 py-2 border"><input type="number" value={p.sellingTax} onChange={(e) => setEditable(prev => ({ ...prev, products: prev.products.map((x, i) => i === rowIdx ? { ...x, sellingTax: parseFloat(e.target.value) || 0 } : x) }))} className="w-20 px-2 py-1 border rounded" /></td>
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
                                <div className="flex justify-between"><p>Discount (%):</p><input type="number" value={editable.discount} onChange={(e) => setEditable(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))} className="w-24 px-2 py-1 border rounded text-right" /></div>
                                <div className="flex justify-between"><p>Sub Total:</p><p>{subTotal.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>Discount:</p><p>-{discountAmount.toFixed(2)}</p></div>
                                <div className="flex justify-between"><p>VAT ({editable.vat}%):</p><input type="number" value={editable.vat} onChange={(e) => setEditable(prev => ({ ...prev, vat: parseFloat(e.target.value) || 0 }))} className="w-24 px-2 py-1 border rounded text-right" /></div>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><p>Freight (Land):</p><input type="number" value={editable.freightCharges.landFreight} onChange={(e) => setEditable(prev => ({ ...prev, freightCharges: { ...prev.freightCharges, landFreight: parseFloat(e.target.value) || 0 } }))} className="w-24 px-2 py-1 border rounded text-right" /></div>
                                    <div className="flex justify-between"><p>Freight (Air):</p><input type="number" value={editable.freightCharges.airFreight} onChange={(e) => setEditable(prev => ({ ...prev, freightCharges: { ...prev.freightCharges, airFreight: parseFloat(e.target.value) || 0 } }))} className="w-24 px-2 py-1 border rounded text-right" /></div>
                                    <div className="flex justify-between"><p>Freight (Sea):</p><input type="number" value={editable.freightCharges.seaFreight} onChange={(e) => setEditable(prev => ({ ...prev, freightCharges: { ...prev.freightCharges, seaFreight: parseFloat(e.target.value) || 0 } }))} className="w-24 px-2 py-1 border rounded text-right" /></div>
                                    <div className="flex justify-between"><p>Total Freight:</p><p>+{freightTotal.toFixed(2)}</p></div>
                                </div>
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
