import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const QuoteSentModal = ({ budget, onClose, onSave }) => {
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    // Pre-fill with existing data or defaults
    setDate(budget.quoteSentDate || new Date().toISOString().split('T')[0]);
    setStatus(budget.quoteSentStatus || '');
  }, [budget]);

  const handleSave = () => {
    if (!date || !status) {
      alert('Please fill in all fields.');
      return;
    }
    onSave({ date, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">Quotation Sent Update</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="quoteDate" className="block text-sm font-medium text-gray-700">
                Quote Date:
              </label>
              <input
                type="date"
                id="quoteDate"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="sentStatus" className="block text-sm font-medium text-gray-700">
                Sent Status:
              </label>
              <select
                id="sentStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSentModal;
