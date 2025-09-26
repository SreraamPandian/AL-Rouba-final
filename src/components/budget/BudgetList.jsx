import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, MoreHorizontal, Search, RotateCcw, Download } from 'lucide-react';
import { useBudgets } from '../../context/BudgetContext';
import { useAuth } from '../../context/AuthContext';
import { getNextRevisionId } from '../../data/mockBudgets';
import QuoteSentModal from './QuoteSentModal';

const BudgetList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { budgets, updateBudget } = useBudgets();

  const [filters, setFilters] = useState({
    employee: 'ALL',
    opportunity: '- ALL -',
    createDateFrom: '',
    createDateTill: '',
    search: ''
  });

  const [showEntries, setShowEntries] = useState(10);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);

  const employees = [
    'ALL',
    'Lakshmi Kanth Pitchandi',
    'John Anderson',
    'Sarah Johnson',
    'Mike Wilson'
  ];

  const filteredBudgets = budgets.filter(budget => {
    const matchesEmployee = filters.employee === 'ALL' || budget.employee === filters.employee;
    const matchesSearch = filters.search === '' ||
      budget.budgetId.toLowerCase().includes(filters.search.toLowerCase()) ||
      budget.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
      budget.enquiryId.toLowerCase().includes(filters.search.toLowerCase());
    return matchesEmployee && matchesSearch;
  });

  // Add some dummy revision data for testing - always visible
  const dummyRevisionBudgets = [
    {
      budgetId: 'PUR/3/0001/r1',
      employee: 'Lakshmi Kanth Pitchandi',
      enquiryId: 'PCENQ2500001',
      customer: 'ISAG Consulting Engineers LLC',
      status: 'Approved',
      budgetDate: new Date().toISOString().split('T')[0],
      budgetValue: '150.500',
      quoteSentDate: null,
      closureDate: new Date().toISOString().split('T')[0],
      quoteSentStatus: 'NO'
    },
    {
      budgetId: 'PUR/3/0002/r1',
      employee: 'John Anderson',
      enquiryId: 'PCENQ2500002',
      customer: 'Tech Solutions Ltd',
      status: 'Pending',
      budgetDate: new Date().toISOString().split('T')[0],
      budgetValue: '89.250',
      quoteSentDate: null,
      closureDate: new Date().toISOString().split('T')[0],
      quoteSentStatus: 'NO'
    },
    {
      budgetId: 'PUR/3/0003/r2',
      employee: 'Sarah Johnson',
      enquiryId: 'PCENQ2500003',
      customer: 'Global Industries Inc',
      status: 'Won',
      budgetDate: new Date().toISOString().split('T')[0],
      budgetValue: '275.800',
      quoteSentDate: new Date().toISOString().split('T')[0],
      closureDate: new Date().toISOString().split('T')[0],
      quoteSentStatus: 'YES'
    },
    {
      budgetId: 'PUR/3/0001/r2',
      employee: 'Lakshmi Kanth Pitchandi',
      enquiryId: 'PCENQ2500001',
      customer: 'ISAG Consulting Engineers LLC',
      status: 'Rejected',
      budgetDate: new Date().toISOString().split('T')[0],
      budgetValue: '165.750',
      quoteSentDate: null,
      closureDate: new Date().toISOString().split('T')[0],
      quoteSentStatus: 'NO'
    }
  ];

  // Combine original budgets with dummy revisions
  const allBudgets = [...filteredBudgets, ...dummyRevisionBudgets];

  // Helper function to extract revision number from budget ID
  const getRevisionNumber = (budgetId) => {
    if (budgetId.includes('/r')) {
      const revisionPart = budgetId.split('/r')[1];
      const result = `r${revisionPart}`;
      return result;
    }
    return '';
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({
      employee: 'ALL',
      opportunity: '- ALL -',
      createDateFrom: '',
      createDateTill: '',
      search: ''
    });
  };

  const handleExport = () => {
    console.log('Exporting budget data...');
  };

  const handleSaveQuoteStatus = (updatedData) => {
    updateBudget(selectedBudget.budgetId, {
      quoteSentDate: updatedData.date,
      quoteSentStatus: updatedData.status,
    });
    setIsQuoteModalOpen(false);
    setSelectedBudget(null);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Revised': 'bg-purple-100 text-purple-800',
      'Won': 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getStatusYesNoBadge = (status) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${status === 'YES' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const handleMenuAction = (budgetId, action) => {
    if (action === 'Won') {
      updateBudget(budgetId, { status: 'Won' });
    }
    console.log(`Action '${action}' on budget ${budgetId}`);
    setOpenMenuId(null);
  };

  const getNavigateUrl = (budget, mode) => {
    const isManager = user.role === 'Sales Manager';
    const isPending = budget.status === 'Pending';
    const encodedId = encodeURIComponent(budget.budgetId);

    // Manager approval view takes precedence for 'view' or direct click on ID
    if (isManager && isPending && (mode === 'view' || mode === 'edit' || mode === 'revise')) {
      return `/budget/${encodedId}/approve`;
    }

    if (mode === 'view') {
      return `/budget/${encodedId}/view`;
    }

    // Edit and Revise always go to the edit page
    return `/budget/${encodedId}/edit`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">BUDGET LIST</h1>
        <button
          onClick={() => navigate('/budget/new')}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Budget
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee:</label>
            <select value={filters.employee} onChange={(e) => handleFilterChange('employee', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100">
              {employees.map(emp => <option key={emp} value={emp}>{emp}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enquiry:</label>
            <select value={filters.opportunity} onChange={(e) => handleFilterChange('opportunity', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100">
              <option value="- ALL -">- ALL -</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Date From:</label>
            <input type="date" value={filters.createDateFrom} onChange={(e) => handleFilterChange('createDateFrom', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Create Date Till:</label>
            <input type="date" value={filters.createDateTill} onChange={(e) => handleFilterChange('createDateTill', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleReset} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            <RotateCcw className="h-4 w-4 mr-1" /> Reset
          </button>
          <button onClick={handleExport} className="flex items-center px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
            <Download className="h-4 w-4 mr-1" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Show</span>
              <select value={showEntries} onChange={(e) => setShowEntries(Number(e.target.value))} className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">Entries</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Search:</span>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="pl-9 pr-4 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search..." />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REVISION</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ENQUIRY ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CLOSURE DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUDGET VALUE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUOTE SENT DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QUOTE SENT STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {allBudgets.slice(0, showEntries).map((budget, index) => (
                <tr key={`${budget.budgetId}-${index}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    <button onClick={() => navigate(getNavigateUrl(budget, 'view'))} className="hover:underline">{budget.budgetId}</button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getRevisionNumber(budget.budgetId) ? (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                        {getRevisionNumber(budget.budgetId)}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.enquiryId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.closureDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(budget.budgetDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.budgetValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{budget.quoteSentStatus === 'YES' && budget.quoteSentDate ? new Date(budget.quoteSentDate).toLocaleDateString() : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(budget.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusYesNoBadge(budget.quoteSentStatus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 relative">
                    <div className="flex items-center space-x-2">
                      <button onClick={() => navigate(getNavigateUrl(budget, 'view'))} className="text-gray-400 hover:text-blue-600" title="View"><Eye className="h-4 w-4" /></button>
                      {budget.status !== 'Won' && (
                        <button onClick={() => navigate(getNavigateUrl(budget, 'edit'))} className="text-gray-400 hover:text-green-600" title="Edit"><Edit className="h-4 w-4" /></button>
                      )}
                      <button onClick={() => setOpenMenuId(openMenuId === budget.budgetId ? null : budget.budgetId)} className="text-gray-400 hover:text-gray-600" title="More options"><MoreHorizontal className="h-4 w-4" /></button>
                    </div>
                    {openMenuId === budget.budgetId && (
                      <div className="absolute right-0 mt-2 w-40 z-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 text-sm">
                          <button onClick={() => {
                            setOpenMenuId(null);
                            const revisionId = getNextRevisionId(budget.budgetId);
                            navigate(`/budget/${encodeURIComponent(revisionId)}/edit`, {
                              state: {
                                isRevision: true,
                                originalBudgetId: budget.budgetId
                              }
                            });
                          }} className="block w-full text-left px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">Revise</button>
                          <button onClick={() => { setSelectedBudget(budget); setIsQuoteModalOpen(true); setOpenMenuId(null); }} className="block w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium">Quote Sent</button>
                          <button onClick={() => handleMenuAction(budget.budgetId, 'Download')} className="block w-full text-left px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-medium">Download</button>
                          <button onClick={() => handleMenuAction(budget.budgetId, 'Won')} className="block w-full text-left px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium">Won</button>
                          <button onClick={() => handleMenuAction(budget.budgetId, 'Lose')} className="block w-full text-left px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium">Lose</button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-700">
          Showing 1 to {Math.min(showEntries, allBudgets.length)} of {allBudgets.length} entries
        </div>
      </div>
      {isQuoteModalOpen && selectedBudget && (
        <QuoteSentModal budget={selectedBudget} onClose={() => setIsQuoteModalOpen(false)} onSave={handleSaveQuoteStatus} />
      )}
    </div>
  );
};

export default BudgetList;
