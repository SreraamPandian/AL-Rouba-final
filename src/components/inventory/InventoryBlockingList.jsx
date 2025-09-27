import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Unlock, UnlockKeyhole, Calendar, Filter, Clock, AlertTriangle } from 'lucide-react';
import DataTable from '../ui/DataTable';
import { faker } from '@faker-js/faker';

const InventoryBlockingList = () => {
  const navigate = useNavigate();
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const generateBlocks = () => {
    const currentDate = new Date();
    return Array.from({ length: 25 }, (_, index) => {
      const createdDate = faker.date.recent({ days: 30 });
      const expiryDate = new Date(createdDate);
      expiryDate.setDate(expiryDate.getDate() + faker.number.int({ min: 7, max: 30 }));

      const isExpired = expiryDate < currentDate;
      let status;
      if (Math.random() < 0.1) {
        status = 'Released';
      } else if (isExpired) {
        status = 'Expired';
      } else {
        status = 'Active';
      }

      const productNames = [
        'Steel Rod - Grade A40', 'Cement Bags - OPC 53', 'Wire Mesh - 8mm',
        'Reinforcement Bars - 12mm', 'Concrete Blocks - Standard', 'Aluminum Sheets - 2mm',
        'Copper Pipes - 1/2"', 'PVC Pipes - 4"', 'Electrical Cables - 16AWG'
      ];
      const requesters = ['John Smith - Quality Inspector', 'Sarah Wilson - Sales Executive', 'Mike Johnson - Project Manager'];
      const approvers = ['Robert Chen - Sales Manager', 'Maria Rodriguez - Operations Head', 'James Wilson - Inventory Manager'];
      const blockReasons = ['Quality Hold - Awaiting inspection results', 'Customer Request - Payment verification pending', 'Inspection Pending - Third party certification required'];

      const availableQty = faker.number.int({ min: 100, max: 1000 });
      const allocatedQty = faker.number.int({ min: 0, max: availableQty });

      return {
        id: `BLK-${String(index + 1).padStart(4, '0')}`,
        salesOrderId: `SO-2024-${String(faker.number.int({ min: 1, max: 150 })).padStart(3, '0')}`,
        product: `${faker.helpers.arrayElement(productNames)} (${faker.string.alphanumeric(8).toUpperCase()})`,
        blockedQty: faker.number.int({ min: 10, max: 500 }),
        availableQty,
        allocatedQty,
        unit: faker.helpers.arrayElement(['PCS', 'KG', 'M', 'L', 'TON']),
        requester: faker.helpers.arrayElement(requesters),
        approver: faker.helpers.arrayElement(approvers),
        createdDate: createdDate.toLocaleDateString(),
        expiry: expiryDate.toLocaleDateString(),
        expiryTime: expiryDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        daysToExpiry: Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24)),
        status,
        reason: faker.helpers.arrayElement(blockReasons),
        blockType: faker.helpers.arrayElement(['Quality', 'Commercial', 'Technical']),
        priority: faker.helpers.arrayElement(['High', 'Medium', 'Low']),
        warehouse: faker.helpers.arrayElement(['WH-A', 'WH-B', 'WH-C']),
        location: `${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}-${faker.number.int({ min: 1, max: 20 })}-${faker.number.int({ min: 1, max: 10 })}`,
        batchNumber: `BATCH-${faker.date.recent().getFullYear()}-${faker.string.alphanumeric(6).toUpperCase()}`,
        supplierRef: `SUP-${faker.string.alphanumeric(8).toUpperCase()}`
      };
    });
  };

  const [blocks, setBlocks] = useState(generateBlocks());

  const filteredBlocks = blocks.filter(block => {
    if (filter === 'all') return true;
    return block.status.toLowerCase() === filter;
  });

  const expiredBlocks = blocks.filter(block => block.status === 'Expired');
  const activeBlocks = blocks.filter(block => block.status === 'Active');

  const handleViewDetails = (block) => {
    setSelectedBlock(block);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedBlock(null);
  };

  const handleReleaseBlock = (blockId) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, status: 'Released' } : block
      )
    );
  };

  const handleBulkReleaseExpired = () => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.status === 'Expired' ? { ...block, status: 'Released' } : block
      )
    );
  };

  const handleBulkReleaseSelected = () => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        selectedBlocks.includes(block.id) && block.status === 'Active' ? { ...block, status: 'Released' } : block
      )
    );
    setSelectedBlocks([]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Released': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const columns = [
    { key: 'salesOrderId', label: 'SALES ORDER', render: (value) => <button className="text-blue-600 hover:text-blue-800 hover:underline font-medium">{value}</button> },
    { key: 'product', label: 'PRODUCT', render: (value) => <div><div className="font-medium text-gray-900">{value.split(' (')[0]}</div><div className="text-sm text-gray-500">({value.split('(')[1]?.replace(')', '')})</div></div> },
    { key: 'blockedQty', label: 'BLOCKED QTY', render: (value) => <div className="font-medium text-center">{value.toLocaleString()}</div> },
    { key: 'availableQty', label: 'AVAILABLE', render: (value) => <div className="text-center">{value.toLocaleString()}</div> },
    { key: 'allocatedQty', label: 'ALLOCATED', render: (value) => <div className="text-center">{value.toLocaleString()}</div> },
    { key: 'approver', label: 'APPROVER', render: (value) => <div className="text-sm"><div className="font-medium text-gray-900">{value.split(' - ')[0]}</div></div> },
    { key: 'expiry', label: 'EXPIRY DATE', render: (value) => <div className="text-sm font-medium">{value}</div> },
    { key: 'status', label: 'STATUS', render: (value) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>{value}</span> },
    { key: 'actions', label: 'ACTIONS', render: (_, row) => <div className="flex space-x-2"><button className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" title="View Details" onClick={() => handleViewDetails(row)}><Eye className="h-4 w-4" /></button><button className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded" title="Release"><Unlock className="h-4 w-4" /></button></div> },
  ];

  return (
    <div className="space-y-6">
      {/* Header and actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Blocks</h1>
          <p className="text-gray-600">Manage active blocks with links to originating sales orders.</p>
        </div>
        <div className="flex space-x-3">
          {expiredBlocks.length > 0 && <button onClick={handleBulkReleaseExpired} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"><Clock className="w-4 h-4 mr-2" />Release All Expired ({expiredBlocks.length})</button>}
          {selectedBlocks.length > 0 && <button onClick={handleBulkReleaseSelected} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"><UnlockKeyhole className="w-4 h-4 mr-2" />Release Selected ({selectedBlocks.length})</button>}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-yellow-600" /></div><div className="ml-3"><p className="text-sm font-medium text-yellow-800">Active Blocks</p><p className="text-lg font-semibold text-yellow-900">{activeBlocks.length}</p></div></div></div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><Clock className="h-5 w-5 text-red-600" /></div><div className="ml-3"><p className="text-sm font-medium text-red-800">Expired Blocks</p><p className="text-lg font-semibold text-red-900">{expiredBlocks.length}</p></div></div></div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4"><div className="flex items-center"><div className="flex-shrink-0"><Unlock className="h-5 w-5 text-green-600" /></div><div className="ml-3"><p className="text-sm font-medium text-green-800">Released Today</p><p className="text-lg font-semibold text-green-900">{blocks.filter(b => b.status === 'Released').length}</p></div></div></div>
        {/* Total Blocks card removed as requested */}
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[{ key: 'all', label: 'All Blocks', count: blocks.length }, { key: 'active', label: 'Active', count: activeBlocks.length }, { key: 'expired', label: 'Expired', count: expiredBlocks.length }, { key: 'released', label: 'Released', count: blocks.filter(b => b.status === 'Released').length }].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} className={`${filter === tab.key ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      <DataTable columns={columns} data={filteredBlocks} selectable={true} selectedItems={selectedBlocks} onSelectionChange={setSelectedBlocks} itemKey="id" />

      {/* View Details Modal */}
      {viewModalOpen && selectedBlock && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Block Details - {selectedBlock.id}</h3>
                <button onClick={closeViewModal} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4"><h4 className="text-md font-semibold text-gray-800 border-b pb-2">Block Information</h4><div className="space-y-3">
                  <div><label className="text-sm font-medium text-gray-600">Block ID</label><p className="text-sm text-gray-900">{selectedBlock.id}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Sales Order ID</label><button onClick={() => navigate(`/sales-orders/${selectedBlock.salesOrderId}`)} className="text-sm text-blue-600 hover:text-blue-800 hover:underline">{selectedBlock.salesOrderId}</button></div>
                  <div><label className="text-sm font-medium text-gray-600">Product</label><p className="text-sm text-gray-900">{selectedBlock.product}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Blocked Quantity</label><p className="text-sm text-gray-900 font-medium">{selectedBlock.blockedQty.toLocaleString()} {selectedBlock.unit}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Status</label><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBlock.status)}`}>{selectedBlock.status}</span></div>
                  <div><label className="text-sm font-medium text-gray-600">Warehouse Location</label><p className="text-sm text-gray-900">{selectedBlock.warehouse} - {selectedBlock.location}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Batch Number</label><p className="text-sm text-gray-900 font-mono">{selectedBlock.batchNumber}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Supplier Reference</label><p className="text-sm text-gray-900 font-mono">{selectedBlock.supplierRef}</p></div>
                </div></div>
                <div className="space-y-4"><h4 className="text-md font-semibold text-gray-800 border-b pb-2">Request Details</h4><div className="space-y-3">
                  <div><label className="text-sm font-medium text-gray-600">Block Reason</label><p className="text-sm text-gray-900">{selectedBlock.reason}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Block Type</label><p className="text-sm text-gray-900">{selectedBlock.blockType}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Priority</label><span className={`text-sm font-medium ${getPriorityColor(selectedBlock.priority)}`}>{selectedBlock.priority}</span></div>
                  <div><label className="text-sm font-medium text-gray-600">Requested By</label><p className="text-sm text-gray-900">{selectedBlock.requester}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Approved By</label><p className="text-sm text-gray-900">{selectedBlock.approver}</p></div>
                </div></div>
                <div className="md:col-span-2 space-y-4"><h4 className="text-md font-semibold text-gray-800 border-b pb-2">Timeline</h4><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-sm font-medium text-gray-600">Created Date</label><p className="text-sm text-gray-900">{selectedBlock.createdDate}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Expiry Date</label><p className="text-sm text-gray-900">{selectedBlock.expiry}</p><p className="text-xs text-gray-500">{selectedBlock.expiryTime}</p></div>
                  <div><label className="text-sm font-medium text-gray-600">Days to Expiry</label><p className={`text-sm font-medium ${selectedBlock.daysToExpiry <= 3 ? 'text-red-600' : selectedBlock.daysToExpiry <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>{selectedBlock.daysToExpiry > 0 ? `${selectedBlock.daysToExpiry} days left` : `${Math.abs(selectedBlock.daysToExpiry)} days overdue`}</p></div>
                </div></div>
                <div className="md:col-span-2 space-y-4"><h4 className="text-md font-semibold text-gray-800 border-b pb-2">Additional Information</h4><div className="bg-gray-50 p-4 rounded-lg"><label className="text-sm font-medium text-gray-600 block mb-2">Block Notes</label><p className="text-sm text-gray-900">This inventory block was created due to {selectedBlock.reason.toLowerCase()}. The block is classified as {selectedBlock.blockType.toLowerCase()} type with {selectedBlock.priority.toLowerCase()} priority. Please contact the requester ({selectedBlock.requester}) or approver ({selectedBlock.approver.split(' - ')[0]}) for any questions.{selectedBlock.status === 'Expired' && ' This block has expired and should be reviewed for release.'}{selectedBlock.status === 'Active' && selectedBlock.daysToExpiry <= 3 && ' This block is approaching expiry and requires attention.'}</p></div></div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                {(selectedBlock.status === 'Active' || selectedBlock.status === 'Expired') && <button onClick={() => { handleReleaseBlock(selectedBlock.id); closeViewModal(); }} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"><Unlock className="w-4 h-4 mr-2" />Release Block</button>}
                <button onClick={closeViewModal} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryBlockingList;
