import React, { useState, useMemo } from 'react';
import { Truck, CheckCircle, Plus, Upload, Save, Map, FileText, AlertTriangle, Trash2, ArrowLeft } from 'lucide-react';
import ChildPartMappingModal from './ChildPartMappingModal';
import StatusBadge from '../ui/StatusBadge';

// Mock data for the dashboard part
const incomingConsignments = [
  { 
    id: 'FPO-2024-008', 
    vendor: 'Global Electronics', 
    eta: 'Today',
    status: 'In Transit',
    expectedQty: 40,
    receivedQty: 0,
  },
  { 
    id: 'FPO-2024-009', 
    vendor: 'Component Solutions', 
    eta: 'Tomorrow',
    status: 'Awaiting Receipt',
    expectedQty: 50,
    receivedQty: 0,
  },
  {
    id: 'FPO-2024-011',
    vendor: 'Advanced Parts Co.',
    eta: 'Yesterday',
    status: 'Partially Received',
    expectedQty: 100,
    receivedQty: 60,
  }
];

const fpoItemsData = {
    'FPO-2024-008': [
      { id: 1, product: 'Motherboard Assembly', code: 'MB-ASM-01', expectedQty: 20, receivedQty: 0, batchNo: '', packagingDetails: '', status: 'Pending', hasChildParts: true },
      { id: 2, product: 'Power Supply Unit', code: 'PSU-004', expectedQty: 20, receivedQty: 0, batchNo: '', packagingDetails: '', status: 'Pending', hasChildParts: false },
    ],
    'FPO-2024-009': [
      { id: 3, product: 'Casing Kit', code: 'CS-KIT-02', expectedQty: 50, receivedQty: 0, batchNo: '', packagingDetails: '', status: 'Pending', hasChildParts: true },
    ],
    'FPO-2024-011': [
      { id: 4, product: 'Industrial Sensor', code: 'SEN-IND-01', expectedQty: 100, receivedQty: 60, batchNo: 'B-IS-0410', packagingDetails: 'Box of 100', status: 'Partial', hasChildParts: false },
    ]
};


const InwardReceipt = () => {
  const [processingFpoId, setProcessingFpoId] = useState(null); // New state to control view
  const [vendorInvoiceNo, setVendorInvoiceNo] = useState('');
  const [items, setItems] = useState([]);
  const [unplannedItems, setUnplannedItems] = useState([]);
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [itemToMap, setItemToMap] = useState(null);

  const startProcessingFpo = (fpoId) => {
    setProcessingFpoId(fpoId);
    setItems(fpoItemsData[fpoId]?.map(item => ({
        ...item, 
        // If it's a partially received item, keep the receivedQty, otherwise reset to 0
        receivedQty: item.status === 'Partial' ? item.receivedQty : 0, 
        status: item.status === 'Partial' ? 'Partial' : 'Pending'
    })) || []);
    setUnplannedItems([]);
    setVendorInvoiceNo('');
  };

  const backToDashboard = () => {
    setProcessingFpoId(null);
    setItems([]);
  };

  const handleItemChange = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'receivedQty') {
          const qty = parseInt(value, 10) || 0;
          if (qty === 0) updatedItem.status = 'Pending';
          else if (qty < item.expectedQty) updatedItem.status = 'Partial';
          else if (qty === item.expectedQty) updatedItem.status = 'Full';
          else updatedItem.status = 'Over-received';
        }
        return updatedItem;
      }
      return item;
    }));
  };
  
  const handleUnplannedItemChange = (id, field, value) => {
    setUnplannedItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  
  const addUnplannedItem = () => {
    setUnplannedItems(prev => [...prev, { id: Date.now(), product: '', code: '', receivedQty: 1, batchNo: '', packagingDetails: '' }]);
  };
  
  const removeUnplannedItem = (id) => {
    setUnplannedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleMapChildParts = (item) => {
    setItemToMap(item);
    setShowMappingModal(true);
  };
  
  const overallStatus = useMemo(() => {
    if (!items || items.length === 0) return 'Pending';
    const totalExpected = items.reduce((acc, item) => acc + item.expectedQty, 0);
    const totalReceived = items.reduce((acc, item) => acc + (parseInt(item.receivedQty, 10) || 0), 0);
    
    if (totalReceived === 0) return 'Pending';
    if (totalReceived >= totalExpected) return 'Fully Received';
    return 'Partially Received';
  }, [items]);

  // View for the Inward Dashboard
  const renderDashboard = () => (
    <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Inward Dashboard</h1>
            <button className="flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" /> Create Unplanned Receipt
            </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Incoming Consignments</h2>
            <div className="space-y-4">
                {incomingConsignments.map(consignment => (
                    <div key={consignment.id} className="border rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 hover:shadow-md transition-shadow">
                        <div className="flex-1 min-w-[200px]">
                            <p className="font-bold text-blue-600">{consignment.id}</p>
                            <p className="text-sm text-gray-700">{consignment.vendor}</p>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <p className="text-sm text-gray-500">ETA</p>
                            <p className="font-medium">{consignment.eta}</p>
                        </div>
                        <div className="flex-1 min-w-[150px]">
                            <p className="text-sm text-gray-500">Expected vs. Received</p>
                            <p className="font-medium">{consignment.receivedQty} / {consignment.expectedQty} units</p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                    className="bg-green-500 h-2 rounded-full" 
                                    style={{ width: `${(consignment.receivedQty / consignment.expectedQty) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="flex-1 min-w-[120px] text-center">
                            <StatusBadge status={consignment.status} />
                        </div>
                        <div className="flex-shrink-0">
                            <button 
                                onClick={() => startProcessingFpo(consignment.id)}
                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Truck className="h-4 w-4 mr-2" />
                                Process Receipt
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  // View for processing a single FPO (the existing form)
  const renderProcessingForm = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
            <button onClick={backToDashboard} className="p-2 hover:bg-gray-100 rounded-lg"><ArrowLeft className="h-5 w-5" /></button>
            <h1 className="text-2xl font-bold text-gray-900">Process Receipt for {processingFpoId}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"><Save className="h-4 w-4 mr-2" />Save as Draft</button>
          <button className="flex items-center px-4 py-2 border border-green-600 text-green-700 rounded-lg hover:bg-green-50">Mark as {overallStatus}</button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><CheckCircle className="h-4 w-4 mr-2" />Submit Receipt</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Consignment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Vendor Invoice No." value={vendorInvoiceNo} onChange={e => setVendorInvoiceNo(e.target.value)} className="md:col-span-1 px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      {items.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-medium text-gray-900">Receiving Items for {processingFpoId}</h2></div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discrepancy</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch/Serial</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(item => {
                  const discrepancy = (parseInt(item.receivedQty, 10) || 0) - item.expectedQty;
                  return (
                    <tr key={item.id} className={discrepancy !== 0 && item.receivedQty > 0 ? 'bg-yellow-50' : ''}>
                      <td className="px-4 py-2 text-sm">{item.product} ({item.code})</td>
                      <td className="px-4 py-2 text-sm">{item.expectedQty}</td>
                      <td className="px-4 py-2"><input type="number" value={item.receivedQty} onChange={e => handleItemChange(item.id, 'receivedQty', e.target.value)} className="w-20 px-2 py-1 border border-gray-300 rounded-md" /></td>
                      <td className={`px-4 py-2 text-sm font-medium ${discrepancy < 0 ? 'text-red-600' : discrepancy > 0 ? 'text-orange-600' : ''}`}>{discrepancy !== 0 ? discrepancy : '—'}</td>
                      <td className="px-4 py-2"><input type="text" placeholder="Batch No." value={item.batchNo} onChange={e => handleItemChange(item.id, 'batchNo', e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded-md" /></td>
                      <td className="px-4 py-2"><StatusBadge status={item.status} /></td>
                      <td className="px-4 py-2">
                        {item.hasChildParts && (
                          <button onClick={() => handleMapChildParts(item)} className="flex items-center text-sm px-2 py-1 border border-purple-500 text-purple-600 rounded hover:bg-purple-50">
                            <Map className="h-3 w-3 mr-1" /> Map Parts
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Unplanned Items</h2>
          <button onClick={addUnplannedItem} className="flex items-center text-sm text-blue-600"><Plus className="h-4 w-4 mr-1" /> Add Item</button>
        </div>
        {unplannedItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product Name/Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Received Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch/Serial</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {unplannedItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-4 py-2"><input type="text" placeholder="Product Name/Code" value={item.product} onChange={e => handleUnplannedItemChange(item.id, 'product', e.target.value)} className="w-full px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2"><input type="number" value={item.receivedQty} onChange={e => handleUnplannedItemChange(item.id, 'receivedQty', e.target.value)} className="w-24 px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2"><input type="text" placeholder="Batch No." value={item.batchNo} onChange={e => handleUnplannedItemChange(item.id, 'batchNo', e.target.value)} className="w-full px-2 py-1 border rounded-md" /></td>
                    <td className="px-4 py-2"><button onClick={() => removeUnplannedItem(item.id)} className="text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {unplannedItems.length === 0 && <p className="p-6 text-sm text-gray-500">No unplanned items added.</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload Vendor Invoice</p>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload Packing List</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Map to Sales Orders</h2>
          <p className="text-sm text-gray-500 mb-2">If this receipt fulfills a specific backorder, link it here.</p>
          <input type="text" placeholder="Enter Sales Order ID (e.g., SO-2024-015)" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>

      {showMappingModal && itemToMap && (
        <ChildPartMappingModal
          item={itemToMap}
          onClose={() => setShowMappingModal(false)}
          onSave={(mappings) => {
            console.log(`Saved mappings for ${itemToMap.code}:`, mappings);
            setShowMappingModal(false);
          }}
        />
      )}
    </div>
  );

  return (
    <div>
        {processingFpoId ? renderProcessingForm() : renderDashboard()}
    </div>
  );
};

export default InwardReceipt;
