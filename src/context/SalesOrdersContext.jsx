import React, { createContext, useContext, useState } from 'react';

const SalesOrdersContext = createContext();

export const useSalesOrders = () => {
    const context = useContext(SalesOrdersContext);
    if (!context) {
        throw new Error('useSalesOrders must be used within a SalesOrdersProvider');
    }
    return context;
};

export const SalesOrdersProvider = ({ children }) => {
    const [salesOrders, setSalesOrders] = useState([
        {
            id: 'SO-2024-001',
            receivedOrderId: 'RO-2024-001',
            customer: 'Tech Solutions Inc.',
            contactPerson: 'John Smith',
            phone: '+1-555-0123',
            email: 'john.smith@techsolutions.com',
            address: '123 Tech Street, Silicon Valley, CA 94000',
            status: 'Fully Allocated',
            deliveryDate: '2025-10-15',
            date: '2025-09-20',
            totalValue: 15420.50,
            items: [
                { id: 1, product: 'High-Performance Processor', code: 'COMP-001', requestedQty: 50, availableQty: 75, allocatedQty: 50, lineStatus: 'Fully Allocated' },
                { id: 2, product: 'DDR5 Memory Module', code: 'MEM-002', requestedQty: 100, availableQty: 100, allocatedQty: 100, lineStatus: 'Fully Allocated' }
            ]
        },
        {
            id: 'SO-2024-002',
            receivedOrderId: 'RO-2024-002',
            customer: 'Global Systems Ltd.',
            contactPerson: 'Sarah Johnson',
            phone: '+1-555-0456',
            email: 'sarah.j@globalsystems.com',
            address: '456 Global Ave, New York, NY 10001',
            status: 'Partially Allocated',
            deliveryDate: '2025-10-20',
            date: '2025-09-22',
            totalValue: 28750.75,
            items: [
                { id: 1, product: 'Server Motherboard', code: 'MB-001', requestedQty: 20, availableQty: 15, allocatedQty: 15, lineStatus: 'Partially Allocated' },
                { id: 2, product: 'Power Supply Unit', code: 'PSU-002', requestedQty: 30, availableQty: 30, allocatedQty: 30, lineStatus: 'Fully Allocated' }
            ]
        },
        {
            id: 'SO-2024-003',
            receivedOrderId: 'RO-2024-003',
            customer: 'Enterprise Corp',
            contactPerson: 'Michael Davis',
            phone: '+1-555-0789',
            email: 'michael.davis@enterprise.com',
            address: '789 Enterprise Blvd, Chicago, IL 60601',
            status: 'Pending',
            deliveryDate: '2025-11-01',
            date: '2025-09-25',
            totalValue: 45200.00,
            items: [
                { id: 1, product: 'Industrial Router', code: 'NET-001', requestedQty: 10, availableQty: 5, allocatedQty: 0, lineStatus: 'Not Allocated' },
                { id: 2, product: 'Fiber Optic Cables', code: 'FIB-002', requestedQty: 500, availableQty: 300, allocatedQty: 0, lineStatus: 'Not Allocated' }
            ]
        },
        {
            id: 'SO-2024-004',
            receivedOrderId: 'RO-2024-004',
            customer: 'Manufacturing Plus',
            contactPerson: 'Lisa Anderson',
            phone: '+1-555-0321',
            email: 'lisa.anderson@mfgplus.com',
            address: '321 Industrial Park, Detroit, MI 48201',
            status: 'Fully Allocated',
            deliveryDate: '2025-10-25',
            date: '2025-09-18',
            totalValue: 72850.25,
            items: [
                { id: 1, product: 'Hydraulic Pump', code: 'HYD-001', requestedQty: 5, availableQty: 8, allocatedQty: 5, lineStatus: 'Fully Allocated' },
                { id: 2, product: 'Control Valve', code: 'VAL-002', requestedQty: 20, availableQty: 25, allocatedQty: 20, lineStatus: 'Fully Allocated' }
            ]
        },
        {
            id: 'SO-2024-005',
            receivedOrderId: 'RO-2024-005',
            customer: 'Automation Works',
            contactPerson: 'Robert Chen',
            phone: '+1-555-0654',
            email: 'robert.chen@autoworks.com',
            address: '654 Automation Way, Austin, TX 73301',
            status: 'Partially Allocated',
            deliveryDate: '2025-11-10',
            date: '2025-09-24',
            totalValue: 38900.00,
            items: [
                { id: 1, product: 'PLC Controller', code: 'PLC-001', requestedQty: 3, availableQty: 2, allocatedQty: 2, lineStatus: 'Partially Allocated' },
                { id: 2, product: 'Sensor Array', code: 'SEN-002', requestedQty: 15, availableQty: 15, allocatedQty: 15, lineStatus: 'Fully Allocated' }
            ]
        },
        {
            id: 'SO-2024-006',
            receivedOrderId: 'RO-2024-006',
            customer: 'DataCenter Solutions',
            contactPerson: 'Emily Rodriguez',
            phone: '+1-555-0987',
            email: 'emily.r@datacenter.com',
            address: '987 Server St, Seattle, WA 98101',
            status: 'Fully Allocated',
            deliveryDate: '2025-10-30',
            date: '2025-09-21',
            totalValue: 156750.00,
            items: [
                { id: 1, product: 'Server Rack', code: 'RACK-001', requestedQty: 12, availableQty: 15, allocatedQty: 12, lineStatus: 'Fully Allocated' },
                { id: 2, product: 'UPS System', code: 'UPS-002', requestedQty: 6, availableQty: 8, allocatedQty: 6, lineStatus: 'Fully Allocated' }
            ]
        }
    ]);

    const addSalesOrder = (orderData) => {
        const newOrderId = `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`;
        const newOrder = {
            id: newOrderId,
            receivedOrderId: orderData.receivedOrderId,
            customer: orderData.customer,
            status: calculateOrderStatus(orderData.items),
            deliveryDate: orderData.deliveryDate,
            totalValue: orderData.totalValue,
            items: orderData.items || []
        };
        setSalesOrders(prev => [...prev, newOrder]);
        return newOrder;
    };

    const updateSalesOrder = (orderId, orderData) => {
        setSalesOrders(prev => prev.map(order =>
            order.id === orderId
                ? {
                    ...order,
                    ...orderData,
                    status: calculateOrderStatus(orderData.items || order.items)
                }
                : order
        ));
    };

    const getSalesOrder = (orderId) => {
        return salesOrders.find(order => order.id === orderId);
    };

    const calculateOrderStatus = (items) => {
        if (!items || items.length === 0) return 'Draft';

        const fullyAllocatedItems = items.filter(item => item.allocatedQty >= item.requestedQty);
        const partiallyAllocatedItems = items.filter(item => item.allocatedQty > 0 && item.allocatedQty < item.requestedQty);

        if (fullyAllocatedItems.length === items.length) {
            return 'Fully Allocated';
        } else if (fullyAllocatedItems.length > 0 || partiallyAllocatedItems.length > 0) {
            return 'Partially Allocated';
        }

        return 'Pending Allocation';
    };

    const generateSalesOrder = (receivedOrderId, items) => {
        const newOrderId = `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`;
        const processedItems = items.map(item => ({
            ...item,
            allocatedQty: Math.min(item.requestedQty, item.availableQty),
            lineStatus: item.requestedQty <= item.availableQty ? 'Fully Allocated' : 'Partially Allocated'
        }));

        const newOrder = {
            id: newOrderId,
            receivedOrderId: receivedOrderId,
            customer: 'Generated Customer', // This would come from received order
            status: calculateOrderStatus(processedItems),
            deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            totalValue: processedItems.reduce((sum, item) => sum + (item.allocatedQty * 100), 0), // Dummy calculation
            items: processedItems
        };

        setSalesOrders(prev => [...prev, newOrder]);
        return newOrder;
    };

    const value = {
        salesOrders,
        addSalesOrder,
        updateSalesOrder,
        getSalesOrder,
        generateSalesOrder,
        calculateOrderStatus
    };

    return (
        <SalesOrdersContext.Provider value={value}>
            {children}
        </SalesOrdersContext.Provider>
    );
};
