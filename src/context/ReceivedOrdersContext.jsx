import React, { createContext, useContext, useState } from 'react';

const ReceivedOrdersContext = createContext();

export const useReceivedOrders = () => {
    const context = useContext(ReceivedOrdersContext);
    if (!context) {
        throw new Error('useReceivedOrders must be used within a ReceivedOrdersProvider');
    }
    return context;
};

export const ReceivedOrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            budgetId: 'PUR/3/0001',
            receivedOrderDate: '2025-09-23',
            budgetValue: 80.53,
            employee: 'Lakshmi Kanth Pitchandi',
            branch: 'DSS Oman'
        },
        {
            id: 2,
            budgetId: 'PUR/3/0002',
            receivedOrderDate: '2025-09-22',
            budgetValue: 125.75,
            employee: 'Rajesh Kumar Sharma',
            branch: 'DSS Dubai'
        },
        {
            id: 3,
            budgetId: 'PUR/3/0003',
            receivedOrderDate: '2025-09-21',
            budgetValue: 200.40,
            employee: 'Priya Nair',
            branch: 'DSS Kuwait'
        },
        {
            id: 4,
            budgetId: 'PUR/3/0004',
            receivedOrderDate: '2025-09-20',
            budgetValue: 95.30,
            employee: 'Ahmed Al Rashid',
            branch: 'DSS Qatar'
        },
        {
            id: 5,
            budgetId: 'PUR/3/0005',
            receivedOrderDate: '2025-09-19',
            budgetValue: 310.85,
            employee: 'Sarah Johnson',
            branch: 'DSS Bahrain'
        }
    ]);

    const addOrder = (orderData) => {
        const newOrder = {
            id: Math.max(...orders.map(o => o.id)) + 1,
            budgetId: orderData.budget,
            receivedOrderDate: orderData.poRefNoDate || new Date().toISOString().split('T')[0],
            budgetValue: parseFloat(orderData.receivedOrderValue),
            employee: getEmployeeName(orderData.employee),
            branch: getEmployeeBranch(orderData.employee)
        };
        setOrders(prev => [...prev, newOrder]);
        return newOrder;
    };

    const updateOrder = (id, orderData) => {
        const updatedOrder = {
            id: parseInt(id),
            budgetId: orderData.budget,
            receivedOrderDate: orderData.poRefNoDate || new Date().toISOString().split('T')[0],
            budgetValue: parseFloat(orderData.receivedOrderValue),
            employee: getEmployeeName(orderData.employee),
            branch: getEmployeeBranch(orderData.employee)
        };
        setOrders(prev => prev.map(order => order.id === parseInt(id) ? updatedOrder : order));
        return updatedOrder;
    };

    const getOrder = (id) => {
        return orders.find(order => order.id === parseInt(id));
    };

    // Helper functions to get employee details
    const getEmployeeName = (employeeValue) => {
        const employeeMap = {
            'lakshmi_pitchandi': 'Lakshmi Kanth Pitchandi',
            'rajesh_sharma': 'Rajesh Kumar Sharma',
            'priya_nair': 'Priya Nair',
            'ahmed_rashid': 'Ahmed Al Rashid',
            'sarah_johnson': 'Sarah Johnson'
        };
        return employeeMap[employeeValue] || employeeValue;
    };

    const getEmployeeBranch = (employeeValue) => {
        const branchMap = {
            'lakshmi_pitchandi': 'DSS Oman',
            'rajesh_sharma': 'DSS Dubai',
            'priya_nair': 'DSS Kuwait',
            'ahmed_rashid': 'DSS Qatar',
            'sarah_johnson': 'DSS Bahrain'
        };
        return branchMap[employeeValue] || 'DSS Main';
    };

    const value = {
        orders,
        addOrder,
        updateOrder,
        getOrder
    };

    return (
        <ReceivedOrdersContext.Provider value={value}>
            {children}
        </ReceivedOrdersContext.Provider>
    );
};
