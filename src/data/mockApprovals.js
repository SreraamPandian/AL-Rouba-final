import { faker } from '@faker-js/faker';

// Budget Approvals - get from existing mock budgets
export const getBudgetApprovals = (budgets) => {
    return budgets
        .filter(b => b.status === 'Pending')
        .map(budget => ({
            id: budget.budgetId,
            type: 'Budget',
            title: `Budget ${budget.budgetId}`,
            description: `${budget.customer} • ${budget.currency} ${budget.budgetValue.toFixed(2)}`,
            submittedBy: budget.employee,
            submittedDate: budget.budgetDate,
            priority: 'Medium',
            category: 'Financial',
            details: {
                customer: budget.customer,
                value: budget.budgetValue,
                currency: budget.currency,
                enquiryId: budget.enquiryId
            }
        }));
};

// FPO Approvals generation removed - FPO module deprecated in this build
// export const getFPOApprovals = () => { /* removed */ };

// Inventory Block Approvals
export const getInventoryBlockApprovals = () => {
    const productNames = [
        'Steel Rod - Grade A40', 'Cement Bags - OPC 53', 'Wire Mesh - 8mm',
        'Reinforcement Bars - 12mm', 'Concrete Blocks - Standard'
    ];
    const blockReasons = [
        'Quality Hold - Awaiting inspection',
        'Customer Request - Payment verification',
        'Inspection Pending - Certification required'
    ];

    return Array.from({ length: 4 }, (_, index) => {
        const blockId = `BLK-${String(index + 1).padStart(4, '0')}`;
        const product = faker.helpers.arrayElement(productNames);
        const qty = faker.number.int({ min: 10, max: 500 });
        const unit = faker.helpers.arrayElement(['PCS', 'KG', 'M', 'TON']);

        return {
            id: blockId,
            type: 'Inventory Block',
            title: `Block Request ${blockId}`,
            description: `${product} • ${qty} ${unit}`,
            submittedBy: faker.helpers.arrayElement(['Quality Inspector', 'Sales Executive', 'Project Manager']),
            submittedDate: faker.date.recent({ days: 3 }).toISOString().split('T')[0],
            priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
            category: 'Inventory',
            details: {
                product: product,
                quantity: qty,
                unit: unit,
                reason: faker.helpers.arrayElement(blockReasons),
                salesOrderId: `SO-2024-${String(faker.number.int({ min: 1, max: 150 })).padStart(3, '0')}`
            }
        };
    });
};

// Sales Order Approvals
export const getSalesOrderApprovals = () => {
    return Array.from({ length: 3 }, (_, index) => {
        const soId = `SO-2024-${String(index + 101).padStart(3, '0')}`;
        const customer = faker.company.name();
        const value = faker.number.float({ min: 10000, max: 100000, fractionDigits: 2 });

        return {
            id: soId,
            type: 'Sales Order',
            title: `Sales Order ${soId}`,
            description: `${customer} • OMR ${value.toFixed(2)}`,
            submittedBy: faker.helpers.arrayElement(['Sales Executive A', 'Sales Executive B', 'Sales Executive C']),
            submittedDate: faker.date.recent({ days: 2 }).toISOString().split('T')[0],
            priority: value > 50000 ? 'High' : 'Medium',
            category: 'Sales',
            details: {
                customer: customer,
                value: value,
                currency: 'OMR',
                deliveryDate: faker.date.future({ years: 0.3 }).toISOString().split('T')[0],
                paymentTerms: faker.helpers.arrayElement(['15 Days', '30 Days', '45 Days'])
            }
        };
    });
};

// Quotation Approvals
export const getQuotationApprovals = () => {
    return Array.from({ length: 2 }, (_, index) => {
        const quotationId = `QT-2024-${String(index + 50).padStart(3, '0')}`;
        const customer = faker.company.name();
        const value = faker.number.float({ min: 5000, max: 75000, fractionDigits: 2 });

        return {
            id: quotationId,
            type: 'Quotation',
            title: `Quotation ${quotationId}`,
            description: `${customer} • OMR ${value.toFixed(2)}`,
            submittedBy: faker.helpers.arrayElement(['Sales Rep 1', 'Sales Rep 2', 'Sales Rep 3']),
            submittedDate: faker.date.recent({ days: 4 }).toISOString().split('T')[0],
            priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
            category: 'Sales',
            details: {
                customer: customer,
                value: value,
                currency: 'OMR',
                validUntil: faker.date.future({ years: 0.1 }).toISOString().split('T')[0],
                enquiryId: `PCENQ${faker.number.int({ min: 2500000, max: 2500100 })}`
            }
        };
    });
};

// Combine all approvals
export const getAllPendingApprovals = (budgets = []) => {
    const budgetApprovals = getBudgetApprovals(budgets);
    // const fpoApprovals = getFPOApprovals();
    const inventoryApprovals = getInventoryBlockApprovals();
    const salesOrderApprovals = getSalesOrderApprovals();
    const quotationApprovals = getQuotationApprovals();

    return [
        ...budgetApprovals,
        // ...fpoApprovals,
        ...inventoryApprovals,
        ...salesOrderApprovals,
        ...quotationApprovals
    ].sort((a, b) => new Date(b.submittedDate) - new Date(a.submittedDate));
};

// Helper function to get approvals by category
export const getApprovalsByCategory = (budgets = []) => {
    const allApprovals = getAllPendingApprovals(budgets);
    const categories = {};

    allApprovals.forEach(approval => {
        const type = approval.type;
        if (!categories[type]) {
            categories[type] = [];
        }
        categories[type].push(approval);
    });

    return categories;
};

// Priority color mapping
export const getPriorityColor = (priority) => {
    switch (priority) {
        case 'High':
            return 'text-red-600 bg-red-100';
        case 'Medium':
            return 'text-orange-600 bg-orange-100';
        case 'Low':
            return 'text-green-600 bg-green-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

// Category color mapping
export const getCategoryColor = (category) => {
    switch (category) {
        case 'Financial':
            return 'text-blue-600 bg-blue-100';
        case 'Procurement':
            return 'text-purple-600 bg-purple-100';
        case 'Inventory':
            return 'text-yellow-600 bg-yellow-100';
        case 'Sales':
            return 'text-green-600 bg-green-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};