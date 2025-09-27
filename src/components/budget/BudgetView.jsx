import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { useBudgets } from '../../context/BudgetContext';
import StatusBadge from '../ui/StatusBadge';

const BudgetView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const decodedId = decodeURIComponent(id);
    const { findBudget } = useBudgets();
    const budget = findBudget(decodedId);

    // safe defaults for freightCharges to avoid runtime errors when undefined
    const safeBudgetFreight = budget?.freightCharges || { landFreight: 0, airFreight: 0, seaFreight: 0 };

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
    const freightTotal = (safeBudgetFreight.landFreight || 0) + (safeBudgetFreight.airFreight || 0) + (safeBudgetFreight.seaFreight || 0);
    const grandTotal = totalAfterDiscount + vatAmount + freightTotal;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/budgets')} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Budget: {budget.budgetId}</h1>
                        <p className="text-gray-600">Customer: {budget.customer}</p>
                    </div>
                    <StatusBadge status={budget.status} />
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(`/budget/${encodeURIComponent(budget.budgetId)}/edit`)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Budget
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </button>
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
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Payment Days:</label>
                        <input value={budget.budgetDetails?.paymentDays || budget.paymentDays || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Tax Type:</label>
                        <input value={budget.budgetDetails?.taxType || budget.taxType || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Delivery Days:</label>
                        <input value={budget.budgetDetails?.deliveryDays || budget.deliveryDays || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Licenses Offering:</label>
                        <input value={budget.budgetDetails?.licensesOffering || budget.licensesOffering || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Payment Term:</label>
                        <input value={budget.budgetDetails?.paymentTerm || budget.paymentTerm || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Currency:</label>
                        <input value={budget.budgetDetails?.currency || budget.currency || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Shipping:</label>
                        <input value={budget.budgetDetails?.shipping || budget.shipping || ''} disabled className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
                    </div>
                </div>
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-700">Notes:</label>
                    <textarea value={budget.budgetDetails?.notes || budget.notes || ''} disabled rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100" />
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
                            <div className="flex justify-between"><p>Land Freight:</p><p>{(safeBudgetFreight.landFreight || 0).toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>Air Freight:</p><p>{(safeBudgetFreight.airFreight || 0).toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>Sea Freight:</p><p>{(safeBudgetFreight.seaFreight || 0).toFixed(2)}</p></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-4 text-gray-900">Totals</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between"><p>Discount (%):</p><p>{budget.discount}</p></div>
                            <div className="flex justify-between"><p>Sub Total:</p><p>{subTotal.toFixed(2)}</p></div>
                            <div className="flex justify-between"><p>Discount:</p><p>-{discountAmount.toFixed(3)}</p></div>
                            <div className="flex justify-between"><p>VAT ({budget.vat}%):</p><p>+{vatAmount.toFixed(3)}</p></div>
                            <div className="flex justify-between"><p>Freight:</p><p>+{freightTotal.toFixed(3)}</p></div>
                            <div className="flex justify-between font-bold text-lg bg-blue-600 text-white px-3 py-2 rounded"><p>Grand Total:</p><p>{grandTotal.toFixed(2)}</p></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetView;
