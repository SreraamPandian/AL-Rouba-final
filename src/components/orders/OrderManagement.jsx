import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Download } from 'lucide-react';
import OrderView from './OrderView';
import { useSalesOrders } from '../../context/SalesOrdersContext';

// --- Helper Components & Icons (for self-containment) ---

const FormInput = ({ label, type = 'text', name, value, onChange, required = false, children, placeholder }) => (
    <div className="flex flex-col">
        <label htmlFor={name} className="mb-1 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'select' ? (
            <select id={name} name={name} value={value} onChange={onChange} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                {children}
            </select>
        ) : type === 'textarea' ? (
            <textarea id={name} name={name} value={value} onChange={onChange} rows="3" placeholder={placeholder} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        ) : (
            <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        )}
    </div>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

// --- Create Sales Order Modal Component ---
const CreateSalesOrderModal = ({ onClose }) => {
    const { addSalesOrder } = useSalesOrders();

    // --- STATE MANAGEMENT ---    // State for the header section of the form
    const [headerData, setHeaderData] = useState({
        customer: '',
        salesOrderDate: new Date().toISOString().slice(0, 10),
        expectedDeliveryDate: new Date().toISOString().slice(0, 10),
        paymentTerms: '',
        paymentMode: '',
        deliveryMethod: '',
        branch: '',
        deliveryNote: '',
        shipAddress: '',
    });

    // State for the dynamic product line items
    const [lineItems, setLineItems] = useState([
        { id: 1, productId: '', productName: '', category: '', price: 0, quantity: 1, tax: 0, total: 0 },
    ]);

    // State for the summary and totals section
    const [summary, setSummary] = useState({
        vatType: '',
        discount: 0,
        adjustmentType: 'Credit',
        adjustmentName: '',
        adjustmentAmount: 0,
        advanceAmount: 0,
    });

    // --- DERIVED STATE & CALCULATIONS ---

    const subTotal = useMemo(() =>
        lineItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
        [lineItems]
    );

    const totalTax = useMemo(() =>
        lineItems.reduce((acc, item) => acc + Number(item.tax), 0),
        [lineItems]
    );

    const grandTotal = useMemo(() => {
        const discountAmount = subTotal * (summary.discount / 100);
        const adjustment = summary.adjustmentType === 'Credit' ? -summary.adjustmentAmount : +summary.adjustmentAmount;
        return (subTotal + totalTax - discountAmount + adjustment);
    }, [subTotal, totalTax, summary]);

    // --- EVENT HANDLERS ---

    const handleHeaderChange = (e) => {
        const { name, value } = e.target;
        setHeaderData(prev => ({ ...prev, [name]: value }));
    };

    const handleLineItemChange = (id, e) => {
        const { name, value } = e.target;
        const updatedItems = lineItems.map(item => {
            if (item.id === id) {
                const newItem = { ...item, [name]: value };
                // Recalculate total for the row
                if (name === 'price' || name === 'quantity' || name === 'tax') {
                    const price = name === 'price' ? parseFloat(value) || 0 : newItem.price;
                    const quantity = name === 'quantity' ? parseInt(value) || 0 : newItem.quantity;
                    newItem.total = price * quantity;
                }
                return newItem;
            }
            return item;
        });
        setLineItems(updatedItems);
    };

    const handleSummaryChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'radio') {
            setSummary(prev => ({ ...prev, adjustmentType: value }));
        } else {
            setSummary(prev => ({ ...prev, [name]: value }));
        }
    };

    const addLineItem = () => {
        const newItem = {
            id: Date.now(), // Unique ID for the new row
            productId: '',
            productName: '',
            category: '',
            price: 0,
            quantity: 1,
            tax: 0,
            total: 0,
        };
        setLineItems([...lineItems, newItem]);
    };

    const removeLineItem = (id) => {
        if (lineItems.length > 1) {
            setLineItems(lineItems.filter(item => item.id !== id));
        }
    };

    const handleCreateOrder = () => {
        // Validate required fields
        if (!headerData.customer || !headerData.salesOrderDate || !headerData.expectedDeliveryDate) {
            alert('Please fill in all required fields (Customer, Sales Order Date, Expected Delivery Date)');
            return;
        }

        // Validate line items
        const validLineItems = lineItems.filter(item =>
            item.productName && item.quantity > 0 && item.price > 0
        );

        if (validLineItems.length === 0) {
            alert('Please add at least one valid product with quantity and price.');
            return;
        }

        // Prepare order data for SalesOrdersContext
        const orderData = {
            receivedOrderId: `RO-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            customer: headerData.customer,
            deliveryDate: headerData.expectedDeliveryDate,
            totalValue: grandTotal,
            items: validLineItems.map((item, index) => ({
                id: index + 1,
                product: item.productName,
                code: item.productId || `PROD-${item.id}`,
                requestedQty: item.quantity,
                availableQty: item.quantity,
                allocatedQty: item.quantity,
                lineStatus: 'Fully Allocated'
            }))
        };

        // Add to sales orders context
        try {
            const newOrder = addSalesOrder(orderData);
            alert(`Sales Order ${newOrder.id} has been created successfully!\nTotal Value: $${grandTotal.toFixed(2)}`);
            console.log("Created Sale Order:", newOrder);
            onClose();
        } catch (error) {
            console.error('Error creating sales order:', error);
            alert('Error creating sales order. Please try again.');
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Sales Order</h1>                {/* --- Header Form Section --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 mb-8">
                    <FormInput label="Customer" name="customer" type="select" value={headerData.customer} onChange={handleHeaderChange} required>
                        <option>--Select Customer--</option>
                        <option>Innovate LLC</option>
                        <option>Apex Solutions</option>
                    </FormInput>
                    <FormInput label="Sales Order Date" name="salesOrderDate" type="date" value={headerData.salesOrderDate} onChange={handleHeaderChange} required />
                    <FormInput label="Expected Delivery Date" name="expectedDeliveryDate" type="date" value={headerData.expectedDeliveryDate} onChange={handleHeaderChange} required />
                    <FormInput label="Payment Terms" name="paymentTerms" type="select" value={headerData.paymentTerms} onChange={handleHeaderChange} required>
                        <option>--Select Payment Terms--</option>
                        <option>Net 30</option>
                        <option>Net 60</option>
                    </FormInput>
                    <FormInput label="Payment Mode" name="paymentMode" type="select" value={headerData.paymentMode} onChange={handleHeaderChange} required>
                        <option>--Select Payment Mode--</option>
                        <option>Bank Transfer</option>
                        <option>Credit Card</option>
                    </FormInput>
                    <FormInput label="Delivery Method" name="deliveryMethod" type="select" value={headerData.deliveryMethod} onChange={handleHeaderChange} required>
                        <option>--Select Delivery Method--</option>
                        <option>Courier</option>
                        <option>Local Delivery</option>
                    </FormInput>
                    <FormInput label="Branch" name="branch" type="select" value={headerData.branch} onChange={handleHeaderChange} required>
                        <option>--Select Branch--</option>
                        <option>Main Branch</option>
                        <option>Warehouse B</option>
                    </FormInput>
                    <FormInput label="Delivery Note" name="deliveryNote" value={headerData.deliveryNote} onChange={handleHeaderChange} placeholder="Enter delivery note" />
                    <div className="md:col-span-2 lg:col-span-4">
                        <FormInput label="Ship Address" name="shipAddress" type="textarea" value={headerData.shipAddress} onChange={handleHeaderChange} placeholder="Enter shipping address" required />
                    </div>
                </div>

                {/* --- Product Line Items Table --- */}
                <div className="overflow-x-auto mb-8">
                    <div className="bg-gray-800 text-white rounded-t-lg p-3">
                        <div className="grid grid-cols-12 gap-4 text-sm font-bold">
                            <div className="col-span-2">Product ID</div>
                            <div className="col-span-3">Product Name</div>
                            <div className="col-span-2">Category</div>
                            <div className="col-span-1">Price</div>
                            <div className="col-span-1">Quantity</div>
                            <div className="col-span-1">Tax</div>
                            <div className="col-span-1">Total</div>
                            <div className="col-span-1"></div>
                        </div>
                    </div>
                    <div className="border border-t-0 rounded-b-lg">
                        {lineItems.map((item, index) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 p-3 items-center border-b last:border-b-0">
                                <input type="text" name="productId" value={item.productId} onChange={e => handleLineItemChange(item.id, e)} placeholder="ID" className="col-span-2 p-2 border rounded-md" />
                                <input type="text" name="productName" value={item.productName} onChange={e => handleLineItemChange(item.id, e)} placeholder="Name" className="col-span-3 p-2 border rounded-md" />
                                <input type="text" name="category" value={item.category} onChange={e => handleLineItemChange(item.id, e)} placeholder="Category" className="col-span-2 p-2 border rounded-md" />
                                <input type="number" name="price" value={item.price} onChange={e => handleLineItemChange(item.id, e)} placeholder="Price" className="col-span-1 p-2 border rounded-md" />
                                <input type="number" name="quantity" value={item.quantity} onChange={e => handleLineItemChange(item.id, e)} placeholder="Qty" className="col-span-1 p-2 border rounded-md" />
                                <input type="number" name="tax" value={item.tax} onChange={e => handleLineItemChange(item.id, e)} placeholder="Tax" className="col-span-1 p-2 border rounded-md" />
                                <span className="col-span-1 font-semibold text-gray-800 text-center">{item.total.toFixed(3)}</span>
                                <div className="col-span-1 flex justify-end">
                                    {index === lineItems.length - 1 ? (
                                        <button onClick={addLineItem} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                                            <PlusIcon />
                                        </button>
                                    ) : (
                                        <button onClick={() => removeLineItem(item.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Summary and Totals Section --- */}
                <div className="flex justify-end">
                    <div className="w-full md:w-1/2 lg:w-5/12 space-y-4">
                        <FormInput label="VAT Type" name="vatType" type="select" value={summary.vatType} onChange={handleSummaryChange} required>
                            <option>--Select VAT Type--</option>
                            <option>Standard VAT</option>
                            <option>Zero-Rated</option>
                        </FormInput>

                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <span className="font-medium text-gray-600">Sub Total</span>
                                <span className="text-right font-semibold text-gray-800">{subTotal.toFixed(3)}</span>

                                <span className="font-medium text-gray-600">Total Tax</span>
                                <span className="text-right font-semibold text-gray-800">{totalTax.toFixed(3)}</span>

                                <div className="col-span-1">
                                    <label className="font-medium text-gray-600">Discount (%)</label>
                                </div>
                                <div className="col-span-1">
                                    <input type="number" name="discount" value={summary.discount} onChange={handleSummaryChange} className="w-full p-2 border rounded-md text-right" />
                                </div>

                                <div className="col-span-2 flex items-center gap-4">
                                    <label className="font-medium text-gray-600">Adjustment</label>
                                    <div className="flex items-center gap-2">
                                        <input type="radio" id="credit" name="adjustmentType" value="Credit" checked={summary.adjustmentType === 'Credit'} onChange={handleSummaryChange} />
                                        <label htmlFor="credit">Credit</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="radio" id="debit" name="adjustmentType" value="Debit" checked={summary.adjustmentType === 'Debit'} onChange={handleSummaryChange} />
                                        <label htmlFor="debit">Debit</label>
                                    </div>
                                </div>

                                <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <input type="text" name="adjustmentName" value={summary.adjustmentName} onChange={handleSummaryChange} placeholder="What type of Adjustment?" className="w-full p-2 border rounded-md" />
                                    <input type="number" name="adjustmentAmount" value={summary.adjustmentAmount} onChange={handleSummaryChange} placeholder="Adjustment Amount" className="w-full p-2 border rounded-md text-right" />
                                </div>

                                <div className="col-span-2 pt-2 border-t"></div>

                                <span className="font-bold text-lg text-gray-800">Grand Total</span>
                                <span className="text-right font-bold text-lg text-gray-900">{grandTotal.toFixed(3)}</span>

                                <span className="font-medium text-gray-600">Advance Amount</span>
                                <input type="number" name="advanceAmount" value={summary.advanceAmount} onChange={handleSummaryChange} className="w-full p-2 border rounded-md text-right" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-white text-orange-600 font-semibold py-2 px-6 border border-orange-400 rounded-full hover:bg-orange-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleCreateOrder}
                        className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full hover:bg-blue-700 flex items-center transition-colors"
                    >
                        <CheckIcon />
                        Create Sale Order
                    </button>
                </div>
            </div>
        </div>
    );
};

const sampleOrders = Array.from({ length: 10 }).map((_, i) => ({
    id: 76 - i,
    customerName: 'Runaq Al Faaw Al Lama L.L.C.',
    type: 'Regular',
    grandTotal: (Math.random() * 10000).toFixed(3),
    totalItems: Math.floor(Math.random() * 12000) + 1000,
    createdOn: '19-08-2025',
    branchName: 'IKLIL AL JABAL NATIONAL LLC'
}));

const OrderManagement = () => {
    const [orders] = useState(sampleOrders);
    const [view, setView] = useState(null);

    const handleExport = () => {
        const csv = [['Order ID', 'Customer Name', 'Regular/FOC', 'Grand Total', 'Total Items', 'Created On', 'Branch Name'], ...orders.map(o => [o.id, o.customerName, o.type, o.grandTotal, o.totalItems, o.createdOn, o.branchName])].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'orders.csv'; a.click(); URL.revokeObjectURL(url);
    };

    const [showCreate, setShowCreate] = useState(false);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Order Management</h1>
                <div className="space-x-3">
                    <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Create Sale Order</button>
                    <button onClick={handleExport} className="px-4 py-2 bg-slate-800 text-white rounded-md inline-flex items-center space-x-2"><Download size={16} /><span>Export</span></button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="px-4 py-3">ORDER ID</th>
                                <th className="px-4 py-3">CUSTOMER NAME</th>
                                <th className="px-4 py-3">REGULAR / FOC</th>
                                <th className="px-4 py-3">GRAND TOTAL</th>
                                <th className="px-4 py-3">TOTAL ITEMS</th>
                                <th className="px-4 py-3">CREATED ON</th>
                                <th className="px-4 py-3">BRANCH NAME</th>
                                <th className="px-4 py-3">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} className="border-b">
                                    <td className="px-4 py-3">{o.id}</td>
                                    <td className="px-4 py-3 text-blue-600">{o.customerName}</td>
                                    <td className="px-4 py-3">{o.type}</td>
                                    <td className="px-4 py-3">{o.grandTotal}</td>
                                    <td className="px-4 py-3">{o.totalItems.toLocaleString()}</td>
                                    <td className="px-4 py-3">{o.createdOn}</td>
                                    <td className="px-4 py-3">{o.branchName}</td>
                                    <td className="px-4 py-3"><button onClick={() => setView(o)} className="bg-green-500 text-white px-3 py-1 rounded inline-flex items-center"><Eye size={14} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {view && <OrderView order={view} onClose={() => setView(null)} />}

            {/* Inline modal: Create Sale Order popup */}
            {showCreate && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4"
                    onClick={(e) => {
                        // Close modal when clicking the backdrop (not the modal content)
                        if (e.target === e.currentTarget) {
                            setShowCreate(false);
                        }
                    }}
                >
                    <div
                        className="bg-white w-full max-w-7xl max-h-[95vh] overflow-hidden rounded-lg shadow-lg flex flex-col"
                        onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to backdrop
                    >
                        <div className="flex-1 overflow-y-auto p-6">
                            {/* Render the new sales order form in modal mode */}
                            <CreateSalesOrderModal onClose={() => setShowCreate(false)} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;