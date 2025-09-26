import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const ChildPartMappingModal = ({ item, onClose, onSave }) => {
  const [childParts, setChildParts] = useState([
    { id: 1, sku: 'CPU-01', name: 'Processor', quantity: 1, type: 'Component' },
    { id: 2, sku: 'RAM-04', name: 'Memory Module', quantity: 2, type: 'Component' },
  ]);

  const handleAddPart = () => {
    setChildParts([...childParts, { id: Date.now(), sku: '', name: '', quantity: 1, type: 'Component' }]);
  };

  const handlePartChange = (id, field, value) => {
    setChildParts(parts => parts.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const handleRemovePart = (id) => {
    setChildParts(parts => parts.filter(p => p.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Map Child Parts for {item.product}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Define the child components or consumable parts that make up one unit of the parent SKU.
        </p>

        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {childParts.map(part => (
            <div key={part.id} className="grid grid-cols-12 gap-3 items-center">
              <input type="text" placeholder="SKU" value={part.sku} onChange={e => handlePartChange(part.id, 'sku', e.target.value)} className="col-span-3 px-2 py-1 border rounded-md text-sm" />
              <input type="text" placeholder="Part Name" value={part.name} onChange={e => handlePartChange(part.id, 'name', e.target.value)} className="col-span-4 px-2 py-1 border rounded-md text-sm" />
              <input type="number" placeholder="Qty" value={part.quantity} onChange={e => handlePartChange(part.id, 'quantity', parseInt(e.target.value))} className="col-span-2 px-2 py-1 border rounded-md text-sm" />
              <select value={part.type} onChange={e => handlePartChange(part.id, 'type', e.target.value)} className="col-span-2 px-2 py-1 border rounded-md text-sm">
                <option>Component</option>
                <option>Consumable</option>
              </select>
              <button onClick={() => handleRemovePart(part.id)} className="col-span-1 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
        
        <button onClick={handleAddPart} className="flex items-center text-sm text-blue-600 mt-4"><Plus className="h-4 w-4 mr-1" /> Add Part</button>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => onSave(childParts)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Mappings</button>
        </div>
      </div>
    </div>
  );
};

export default ChildPartMappingModal;
