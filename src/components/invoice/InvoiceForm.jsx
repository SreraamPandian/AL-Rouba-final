import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../../context/InvoicesContext';

const emptyState = {
  id: '',
  budgetId: '',
  customer: '',
  orderValue: '',
  createdDate: '',
  employee: '',
  branch: ''
};

const InvoiceForm = () => {
  const { id } = useParams();
  const isEdit = !!id && id !== 'new';
  const navigate = useNavigate();
  const { invoices, addInvoice, updateInvoice, generateNextId } = useInvoices();

  const [form, setForm] = useState(emptyState);

  useEffect(() => {
    if (isEdit) {
      const existing = invoices.find(inv => inv.id === id);
      if (existing) {
        setForm({ ...existing, orderValue: existing.orderValue.toString() });
      }
    } else {
      setForm({
        ...emptyState,
        id: generateNextId(),
        createdDate: new Date().toISOString()
      });
    }
  }, [isEdit, id, invoices, generateNextId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      orderValue: Number(form.orderValue),
      createdDate: form.createdDate || new Date().toISOString()
    };
    if (isEdit) {
      updateInvoice(form.id, payload);
    } else {
      addInvoice(payload);
    }
    navigate('/invoices');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{isEdit ? 'Edit Invoice' : 'New Invoice'}</h1>
        <div className="space-x-3">
          <button
            onClick={() => navigate('/invoices')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
          >{isEdit ? 'Update' : 'Save'}</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice ID</label>
          <input name="id" value={form.id} disabled className="w-full px-3 py-2 border rounded-md bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget ID</label>
          <input name="budgetId" value={form.budgetId} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="BUD-2024-001" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <input name="customer" value={form.customer} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Customer Name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order Value</label>
          <input name="orderValue" value={form.orderValue} onChange={handleChange} required type="number" min="0" className="w-full px-3 py-2 border rounded-md" placeholder="10000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
          <input name="createdDate" value={form.createdDate ? form.createdDate.split('T')[0] : ''} onChange={(e) => setForm(prev => ({ ...prev, createdDate: new Date(e.target.value).toISOString() }))} type="date" className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
          <input name="employee" value={form.employee} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Employee Name" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
          <input name="branch" value={form.branch} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" placeholder="Branch" />
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
