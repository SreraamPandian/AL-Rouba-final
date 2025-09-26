import React, { useState } from 'react';
import { X, Check, ThumbsDown } from 'lucide-react';

const ApprovalActionModal = ({ actionType, budgetId, onClose, onSave }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const isReject = actionType === 'Reject';
  const title = `${actionType} Budget ${budgetId}`;
  const buttonText = actionType;
  const buttonIcon = isReject ? <ThumbsDown className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />;
  const buttonClass = isReject
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-green-600 hover:bg-green-700';

  const handleSubmit = () => {
    if (isReject && !comment.trim()) {
      setError('A comment is required for rejection.');
      return;
    }
    setError('');
    onSave(comment);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
              {isReject ? 'Rejection Reason (Required)' : 'Optional Comment'}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
              className={`mt-1 block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder={isReject ? 'Provide a clear reason for rejection...' : 'Add any optional comments...'}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
        </div>
        <div className="flex justify-end p-4 border-t bg-gray-50 rounded-b-lg space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`flex items-center px-4 py-2 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonClass}`}
          >
            {buttonIcon}
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalActionModal;
