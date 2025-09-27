import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockBudgetsData as initialBudgets } from '../data/mockBudgets';

const BudgetContext = createContext();

export const useBudgets = () => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudgets must be used within a BudgetProvider');
    }
    return context;
};

export const BudgetProvider = ({ children }) => {
    const [budgets, setBudgets] = useState(initialBudgets);

    const findBudget = useCallback((id) => {
        if (!id) return null;
        return budgets.find(b => b.budgetId === id) || null;
    }, [budgets]);

    const addBudget = useCallback((newBudget) => {
        setBudgets(prev => [...prev, newBudget]);
    }, []);

    const updateBudget = useCallback((id, updates) => {
        setBudgets(prev => prev.map(b => b.budgetId === id ? { ...b, ...updates } : b));
    }, []);

    const deleteBudget = useCallback((id) => {
        setBudgets(prev => prev.filter(b => b.budgetId !== id));
    }, []);

    const value = { budgets, findBudget, addBudget, updateBudget, deleteBudget };

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};
