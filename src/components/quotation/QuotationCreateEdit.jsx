import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Trash2, Download, 
  Save, Send, FileText, GitBranch, Clock
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import TimelinePanel from '../ui/TimelinePanel';

const QuotationCreateEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const budgetId = location.state?.budgetId;

  const isEdit = !!id;
  const isManager = user?.role === 'Sales Manager';

  const [quotation, setQuotation] = useState({
    id: id || 'DRAFT',
    budgetId: budgetId || 'B-2024-001',
    status: isEdit ? 'Sent' : 'Draft',
    version: 1,
    lineItems: [
      {
        id: 1,
        product: 'High-Performance Processor',
        productCode: 'COMP-001',
        quantity: 50,
        unitPrice: 517.50,
        total: 25875.00,
        customerDescription: 'Processor for server build project X.'
      },
      {
        id: 2,
        product: 'DDR5 Memory Module',
        productCode: 'MEM-002',
        quantity: 100,
        unitPrice: 144.00,
        total: 14400.00,
        customerDescription: '32GB DDR5 RAM modules.'
      }
    ],
    termsConditions: [
      { id: 1, title: 'Payment Terms', content: '30% advance, 70% on delivery' },
      { id: 2, title: 'Validity', content: 'This quotation is valid for 30 days.' }
    ],
    notes: 'Please refer to the attached technical specification sheet.'
  });

  const [versionHistory, setVersionHistory] = useState([
    { version: 1, date: '2024-02-10', user: 'John Smith', status: 'Sent' }
  ]);

  const updateLineItem = (id, field, value) => {
    setQuotation(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = (updated.quantity || 0) * (updated.unitPrice || 0);
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const createRevision = () => {
    const newVersion = quotation.version + 1;
    setQuotation(prev => ({
      ...prev,
      version: newVersion,
      status: 'Revised'
    }));
    setVersionHistory(prev => [
      ...prev,
      { version: newVersion, date: new Date().toLocaleDateString(), user: user.name, status: 'Revised' }
    ]);
    alert(`Revision v${newVersion} created. Previous version is saved.`);
  };

  const totalValue = quotation.lineItems.reduce((acc, item) => acc + item.total, 0);

  const timeline = [
    { id: 1, title: 'Quotation Generated', description: 'Generated from Budget B-2024-001', user: 'John Smith', timestamp: '2024-02-10 10:00 AM', icon: Plus },
    { id: 2, title: 'Sent to Customer', description: 'Quotation emailed to customer', user: 'John Smith', timestamp: '2024-02-10 11:30 AM', icon: Send },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5" /></button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{isEdit ? `Quotation ${quotation.id}` : 'Create New Quotation'} (v{quotation.version})</h1>
            <p className="text-gray-600">Linked to Budget: {quotation.budgetId}</p>
          </div>
          <StatusBadge status={quotation.status} />
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><Save className="h-4 w-4 mr-2" />Save Draft</button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><Send className="h-4 w-4 mr-2" />Send to Customer</button>
          <button onClick={createRevision} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><GitBranch className="h-4 w-4 mr-2" />Create Revision</button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><Download className="h-4 w-4 mr-2" />Download PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Line Items */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-medium text-gray-900">Line Items</h2></div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quotation.lineItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product} ({item.productCode})</td>
                      <td className="px-6 py-4">
                        <input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm" disabled={!isManager} />
                      </td>
                      <td className="px-6 py-4">
                        <input type="number" value={item.unitPrice.toFixed(2)} onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)} className="w-28 px-2 py-1 border border-gray-300 rounded-md text-sm" step="0.01" disabled={!isManager} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${item.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <input type="text" value={item.customerDescription} onChange={(e) => updateLineItem(item.id, 'customerDescription', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm" placeholder="Add description for customer" />
                      </td>
                      <td className="px-6 py-4"><button className="p-2 text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-500 uppercase">Total Value</td>
                    <td colSpan="3" className="px-6 py-3 text-left text-lg font-bold text-gray-900">${totalValue.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Terms & Conditions</h2>
            <div className="space-y-4">
              {quotation.termsConditions.map((term) => (
                <div key={term.id}>
                  <h3 className="font-medium">{term.title}</h3>
                  <textarea defaultValue={term.content} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm" rows="2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Version History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Version History</h3>
            <ul className="space-y-3">
              {versionHistory.slice().reverse().map(v => (
                <li key={v.version} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-sm">Version {v.version} <StatusBadge status={v.status} /></p>
                    <p className="text-xs text-gray-500">by {v.user} on {v.date}</p>
                  </div>
                  <button className="text-sm text-blue-600">View</button>
                </li>
              ))}
            </ul>
          </div>
          
          <TimelinePanel title="Quotation History" timeline={timeline} />
        </div>
      </div>
    </div>
  );
};

export default QuotationCreateEdit;
