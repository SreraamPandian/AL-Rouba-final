import React, { useState } from 'react';
import { X, Upload, Calendar } from 'lucide-react';

const BlockRequestModal = ({ item, onClose, onSubmit }) => {
  const [details, setDetails] = useState({
    quantity: item?.requestedQty - Math.max(0, item?.availableQty - item?.blockedQty) || 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    justification: '',
    attachments: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Request Inventory Block</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Product</p>
            <p className="font-medium">{item.product} ({item.code})</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity to Block</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={details.quantity}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Blocking Period</label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="startDate"
                  value={details.startDate}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <span>to</span>
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  name="endDate"
                  value={details.endDate}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="justification" className="block text-sm font-medium text-gray-700">Justification</label>
            <textarea
              id="justification"
              name="justification"
              value={details.justification}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Securing stock for confirmed high-priority order."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Attachments</label>
            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload supporting documents</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockRequestModal;
