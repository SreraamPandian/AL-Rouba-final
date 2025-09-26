import React, { createContext, useContext, useState, useCallback } from 'react';
import { faker } from '@faker-js/faker';

const InvoicesContext = createContext();

const makeInvoice = (i) => {
    const id = `INV-2024-${String(i + 1).padStart(4, '0')}`;
    const budgetId = `BUD-2024-${String(faker.number.int({ min: 1, max: 12 })).padStart(3, '0')}`;
    const customer = faker.company.name();
    const orderValue = faker.finance.amount(5000, 50000, 2);
    const createdDate = faker.date.recent({ days: 20 });
    const employee = faker.person.firstName() + ' ' + faker.person.lastName();
    const branch = faker.helpers.arrayElement(['HQ', 'East', 'West', 'North', 'South']);
    return { id, budgetId, customer, orderValue: Number(orderValue), createdDate: createdDate.toISOString(), employee, branch };
};

export const InvoicesProvider = ({ children }) => {
    const [invoices, setInvoices] = useState(() => Array.from({ length: 6 }, (_, i) => makeInvoice(i)));

    const addInvoice = useCallback((invoice) => {
        setInvoices(prev => [...prev, invoice]);
    }, []);

    const updateInvoice = useCallback((id, updates) => {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...updates } : inv));
    }, []);

    const deleteInvoice = useCallback((id) => {
        setInvoices(prev => prev.filter(inv => inv.id !== id));
    }, []);

    const generateNextId = useCallback(() => {
        const maxNum = invoices.reduce((max, inv) => { const num = parseInt(inv.id.split('-').pop(), 10); return num > max ? num : max; }, 0);
        return `INV-2024-${String(maxNum + 1).padStart(4, '0')}`;
    }, [invoices]);

    return (
        <InvoicesContext.Provider value={{ invoices, addInvoice, updateInvoice, deleteInvoice, generateNextId }}>
            {children}
        </InvoicesContext.Provider>
    );
};

export const useInvoices = () => useContext(InvoicesContext);
