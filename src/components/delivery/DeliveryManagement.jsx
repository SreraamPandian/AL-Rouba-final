import React, { useState, useMemo, useEffect, useRef } from 'react';

// --- Helper Components & Icons (for self-containment) ---

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
    </svg>
);

const PrintIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
);

const SaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// --- Sample Data ---
const initialDeliveryData = [
    { budgetId: 'BUDGET-01', saleOrderId: 'SO-001', orderId: 1, customerName: 'SHAMSU NASEEM GARDEN', orderDate: '2025-01-01', deliveryDate: '2025-01-01' },
    { budgetId: 'BUDGET-02', saleOrderId: 'SO-002', orderId: 2, customerName: 'APEX SOLUTIONS LLC', orderDate: '2025-01-02', deliveryDate: '2025-01-03' },
];

const saleOrders = {
    'SO-001': { salesOrderDate: '2025-01-01', customerName: 'SHAMSU NASEEM GARDEN', products: [{ id: 'P101', name: 'Product A', price: 150.00, qty: 2 }] },
    'SO-002': { salesOrderDate: '2025-01-02', customerName: 'APEX SOLUTIONS LLC', products: [{ id: 'P205', name: 'Product B', price: 300.00, qty: 1 }, { id: 'P101', name: 'Product A', price: 150.00, qty: 3 }] },
};

const budgetData = {
    'BUDGET-01': { saleOrderId: 'SO-001' },
    'BUDGET-02': { saleOrderId: 'SO-002' },
};

const inventoryData = {
    'SO-001': [
        { id: 'COMP-001', name: 'High-Performance Processor', requested: 50, available: 75, blocked: 10, allocatable: 65, status: 'Pending' },
    ],
    'SO-002': [
        { id: 'MEM-002', name: 'DDR5 Memory Module', requested: 100, available: 80, blocked: 0, allocatable: 80, status: 'Pending' },
        { id: 'STO-003', name: 'NVMe SSD Drive', requested: 25, available: 0, blocked: 0, allocatable: 0, status: 'Pending' },
        { id: 'CASE-007', name: 'Server Casing', requested: 10, available: 10, blocked: 0, allocatable: 10, status: 'Pending' },
    ]
};


// --- Inventory Allocation Component ---
const InventoryAllocation = ({ saleOrderId }) => {
    const products = inventoryData[saleOrderId] || [];
    const [allocations, setAllocations] = useState({});
    const [selected, setSelected] = useState([]);

    const handleAllocationChange = (productId, value) => {
        const qty = parseInt(value, 10) || 0;
        setAllocations(prev => ({ ...prev, [productId]: qty }));
    };

    const handleSelect = (productId) => {
        setSelected(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSelectAll = () => {
        if (selected.length === products.length) {
            setSelected([]);
        } else {
            setSelected(products.map(p => p.id));
        }
    };


    return (
        <div className="p-4 bg-gray-50 border-t-2 border-blue-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Inventory Allocation</h3>
                <div className="text-sm font-medium text-gray-600">
                    {selected.length} of {products.length} selected
                    <button onClick={handleSelectAll} className="ml-4 font-semibold text-blue-600 hover:text-blue-800">Select All</button>
                </div>
            </div>

            {/* Header */}
            <div className="grid grid-cols-10 gap-4 text-xs font-bold text-gray-500 uppercase px-4 py-2 border-b">
                <div className="col-span-1 flex items-center"><input type="checkbox" checked={selected.length === products.length && products.length > 0} onChange={handleSelectAll} className="form-checkbox h-4 w-4 text-blue-600" /></div>
                <div className="col-span-4">Product</div>
                <div className="col-span-1 text-center">Requested</div>
                <div className="col-span-1 text-center">Available</div>
                <div className="col-span-1 text-center">Blocked</div>
                <div className="col-span-1 text-center">Allocatable</div>
                <div className="col-span-1 text-center">Allocate Qty</div>
            </div>

            {/* Rows */}
            <div className="space-y-2 mt-2">
                {products.map(product => (
                    <div key={product.id} className="grid grid-cols-10 gap-4 items-center bg-white p-4 rounded-lg shadow-sm border">
                        <div className="col-span-1 flex items-center"><input type="checkbox" checked={selected.includes(product.id)} onChange={() => handleSelect(product.id)} className="form-checkbox h-4 w-4 text-blue-600" /></div>
                        <div className="col-span-4 font-semibold text-gray-800">{product.name} ({product.id})</div>
                        <div className="col-span-1 text-center text-gray-600">{product.requested}</div>
                        <div className="col-span-1 text-center text-gray-600">{product.available}</div>
                        <div className="col-span-1 text-center text-gray-600">{product.blocked}</div>
                        <div className="col-span-1 text-center font-bold text-green-600">{product.allocatable}</div>
                        <div className="col-span-1 text-center">
                            <input
                                type="number"
                                value={allocations[product.id] || 0}
                                onChange={(e) => handleAllocationChange(product.id, e.target.value)}
                                className="w-20 p-1 border rounded-md text-center"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- Add Delivery Modal Component ---
const AddDeliveryModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        budgetId: '',
        saleOrderId: '',
        deliveryDate: new Date().toISOString().slice(0, 10),
    });
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

    const updateFormForSaleOrder = (orderId) => {
        setFormData(prev => ({ ...prev, saleOrderId: orderId }));
        setSelectedOrderDetails(saleOrders[orderId] || null);
    };

    const handleBudgetChange = (e) => {
        const budgetId = e.target.value;
        setFormData(prev => ({ ...prev, budgetId: budgetId }));
        const associatedSaleOrder = budgetData[budgetId]?.saleOrderId;
        if (associatedSaleOrder) {
            updateFormForSaleOrder(associatedSaleOrder);
        } else {
            updateFormForSaleOrder('');
        }
    };

    const handleSaleOrderChange = (e) => {
        const orderId = e.target.value;
        setFormData(prev => ({ ...prev, budgetId: '' }));
        updateFormForSaleOrder(orderId);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.saleOrderId || !formData.deliveryDate) {
            alert('Please fill all required fields.');
            return;
        }
        const newDelivery = {
            orderId: Date.now(), // Use a unique ID
            budgetId: formData.budgetId,
            saleOrderId: formData.saleOrderId,
            customerName: selectedOrderDetails?.customerName || 'N/A',
            orderDate: selectedOrderDetails?.salesOrderDate || 'N/A',
            deliveryDate: formData.deliveryDate,
        };
        onSave(newDelivery);
        onClose(); // Close modal after saving
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-2xl w-full max-w-5xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <CloseIcon />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Add Delivery</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Budget ID</label>
                        <select name="budgetId" value={formData.budgetId} onChange={handleBudgetChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Budget ID</option>
                            {Object.keys(budgetData).map(id => <option key={id} value={id}>{id}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Sale Order ID</label>
                        <select name="saleOrderId" value={formData.saleOrderId} onChange={handleSaleOrderChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500">
                            <option value="">Select Sale Order</option>
                            {Object.keys(saleOrders).map(id => <option key={id} value={id}>{id}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Sales Order Date</label>
                        <input type="text" value={selectedOrderDetails?.salesOrderDate || ''} readOnly className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Customer Name</label>
                        <input type="text" value={selectedOrderDetails?.customerName || ''} readOnly className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Delivery Date *</label>
                        <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                </div>

                <table className="w-full text-sm text-left mb-6">
                    <thead className="bg-blue-600 text-white uppercase text-xs">
                        <tr>
                            <th className="p-3">Product ID</th>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Qty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrderDetails?.products.map(p => (
                            <tr key={p.id} className="border-b">
                                <td className="p-3">{p.id}</td>
                                <td className="p-3">{p.name}</td>
                                <td className="p-3">{p.price.toFixed(2)}</td>
                                <td className="p-3">{p.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedOrderDetails && (
                    <div className="mb-6">
                        <InventoryAllocation saleOrderId={formData.saleOrderId} />
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose} className="bg-white text-blue-600 font-semibold py-2 px-6 border border-blue-400 rounded-full hover:bg-blue-50 transition-colors">Close</button>
                    <button onClick={handleSave} className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-5 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all">
                        <SaveIcon />
                        Save Delivery
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
    const [entries, setEntries] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deliveryData, setDeliveryData] = useState(initialDeliveryData);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const handleAddDelivery = (newDelivery) => {
        setDeliveryData(prevData => [newDelivery, ...prevData]);
    };

    const toggleRowExpansion = (orderId) => {
        setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
    }

    const handlePrint = (deliveryRow) => {
        const orderDetails = saleOrders[deliveryRow.saleOrderId];

        // Create print content
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Delivery Challan</title>
                <style>
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none !important; }
                    }
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 20px; 
                        line-height: 1.4;
                    }
                    .header { text-align: center; margin-bottom: 20px; }
                    .company-info { text-align: center; margin-bottom: 30px; }
                    .bill-to { margin-bottom: 20px; }
                    .details-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 20px; 
                    }
                    .details-table td { 
                        border: 1px solid #000; 
                        padding: 8px; 
                        vertical-align: top;
                    }
                    .product-table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 30px; 
                    }
                    .product-table th, .product-table td { 
                        border: 1px solid #000; 
                        padding: 8px; 
                        text-align: center; 
                    }
                    .signature-section { 
                        display: flex; 
                        justify-content: space-between; 
                        margin-top: 50px; 
                    }
                    .signature-box { 
                        width: 30%; 
                        text-align: center; 
                        border: 1px solid #000;
                        padding: 40px 10px;
                    }
                    .print-button {
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        cursor: pointer;
                        margin: 20px;
                        font-size: 16px;
                    }
                    .print-button:hover {
                        background: #2563eb;
                    }
                </style>
            </head>
            <body>
                <div class="no-print">
                    <button class="print-button" onclick="window.print()">🖨️ Print Delivery Challan</button>
                    <button class="print-button" onclick="window.close()" style="background: #6b7280;">✕ Close</button>
                </div>
                
                <div class="header">
                    <h2>MKF HATCHERY AT BARKA -001</h2>
                    <p>C.R. No.: 1310495 PO Box No.: 547, Postal Code: 320, Barka, Sultanate of Oman.</p>
                </div>
                
                <div class="bill-to">
                    <strong>Bill To:</strong><br>
                    Name: ${deliveryRow.customerName}<br>
                    GARDEN<br>
                    C.R.No:<br>
                    P.O.Box:<br>
                    Address: ${deliveryRow.customerName}<br>
                    OMAN<br>
                    Phone: 98526509
                </div>

                <table class="details-table">
                    <tr>
                        <td><strong>Delivery Challan #</strong><br>MKF/DC/2025/0001</td>
                        <td><strong>Challan Date #</strong><br>${new Date(deliveryRow.deliveryDate).toLocaleDateString()}</td>
                        <td><strong>Order ID #</strong><br>${deliveryRow.saleOrderId}</td>
                        <td><strong>Order Date #</strong><br>${new Date(deliveryRow.orderDate).toLocaleDateString()}</td>
                    </tr>
                </table>

                <table class="details-table">
                    <tr>
                        <td><strong>Number Of Box #</strong></td>
                        <td><strong>Driver Name</strong></td>
                        <td><strong>Vehicle Number #</strong></td>
                        <td><strong>Transport Type #</strong><br>Own Transport</td>
                    </tr>
                </table>

                <div style="margin: 20px 0;">
                    <strong>Shipping Address</strong><br>
                    ${deliveryRow.customerName}<br>
                    ${deliveryRow.customerName}<br>
                    NASEEM GARDEN OMAN<br>
                    VATNO: C.R. NO. : P.O BOX:<br>
                    MOB NO: 98526509 E-MAIL :
                </div>

                <table class="product-table">
                    <thead>
                        <tr>
                            <th>SL No</th>
                            <th>Product Name</th>
                            <th>Product ID</th>
                            <th>QTY</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderDetails?.products.map((product, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${product.name}</td>
                                <td>${product.id}</td>
                                <td>${product.qty}</td>
                            </tr>
                        `).join('') || '<tr><td colspan="4">No products found</td></tr>'}
                    </tbody>
                </table>

                <div class="signature-section">
                    <div class="signature-box">
                        <strong>Stamp</strong>
                    </div>
                    <div class="signature-box">
                        <strong>Prepared By</strong>
                    </div>
                    <div class="signature-box">
                        <strong>Authorized By</strong>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Try multiple approaches for better compatibility
        try {
            // Method 1: Try opening in new window (preferred)
            const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

            if (printWindow) {
                printWindow.document.write(printContent);
                printWindow.document.close();

                // Wait for content to load before focusing and printing
                printWindow.onload = function () {
                    printWindow.focus();
                };

                // Add a small delay to ensure content is rendered
                setTimeout(() => {
                    if (printWindow && !printWindow.closed) {
                        printWindow.focus();
                    }
                }, 500);
            } else {
                // Method 2: Fallback - Create blob URL and open in new tab
                const blob = new Blob([printContent], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const newWindow = window.open(url, '_blank');

                if (!newWindow) {
                    // Method 3: Last resort - Download as HTML file
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `delivery-challan-${deliveryRow.saleOrderId}.html`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    alert('Popup blocked! Delivery challan downloaded as HTML file. Open it and print from your browser.');
                }
            }
        } catch (error) {
            console.error('Print error:', error);
            // Method 4: Alternative download method
            const element = document.createElement('a');
            const file = new Blob([printContent], { type: 'text/html' });
            element.href = URL.createObjectURL(file);
            element.download = `delivery-challan-${deliveryRow.saleOrderId}.html`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            alert('Print failed! Delivery challan downloaded as HTML file. Open it and print from your browser.');
        }
    };

    const filteredData = useMemo(() => {
        return deliveryData.filter(item =>
            item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.budgetId && item.budgetId.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.saleOrderId && item.saleOrderId.toLowerCase().includes(searchTerm.toLowerCase()))
        ).slice(0, entries);
    }, [deliveryData, searchTerm, entries]);


    return (
        <>
            <AddDeliveryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddDelivery}
            />
            <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                    {/* --- Header Controls --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Show</span>
                            <select
                                value={entries}
                                onChange={(e) => setEntries(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>entries</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>Search:</span>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="border border-gray-300 rounded-full p-2 w-48 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-5 rounded-full shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
                            >
                                <PlusIcon />
                                Add Delivery
                            </button>
                        </div>
                    </div>

                    {/* --- Delivery Table --- */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-blue-600 text-white uppercase text-xs">
                                <tr>
                                    <th className="p-3">Budget ID</th>
                                    <th className="p-3">Sale Order ID</th>
                                    <th className="p-3">Sales Order Date</th>
                                    <th className="p-3">Customer Name</th>
                                    <th className="p-3">Delivery Date</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row) => (
                                    <React.Fragment key={row.orderId}>
                                        <tr onClick={() => toggleRowExpansion(row.orderId)} className="bg-white border-b hover:bg-gray-50 cursor-pointer">
                                            <td className="p-3 text-gray-700">{row.budgetId}</td>
                                            <td className="p-3 text-gray-700">{row.saleOrderId}</td>
                                            <td className="p-3 text-gray-700">{row.orderDate}</td>
                                            <td className="p-3 font-medium text-gray-900">{row.customerName}</td>
                                            <td className="p-3 text-gray-700">{row.deliveryDate}</td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePrint(row);
                                                    }}
                                                    className="p-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                                >
                                                    <PrintIcon />
                                                </button>
                                            </td>
                                        </tr>
                                        {expandedOrderId === row.orderId && (
                                            <tr>
                                                <td colSpan="6">
                                                    <InventoryAllocation saleOrderId={row.saleOrderId} />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- Footer and Pagination --- */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600">
                        <div>
                            Showing 1 to {filteredData.length} of {deliveryData.length} entries
                        </div>
                        <div className="flex items-center mt-4 sm:mt-0">
                            <button className="px-3 py-1 hover:bg-gray-200 rounded-md">Previous</button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-md mx-1">1</button>
                            <button className="px-3 py-1 hover:bg-gray-200 rounded-md">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;

