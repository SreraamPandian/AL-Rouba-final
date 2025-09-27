import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Unlock, UnlockKeyhole, Calendar, Filter, Clock, AlertTriangle } from 'lucide-react';
import DataTable from '../ui/DataTable';
import { faker } from '@faker-js/faker';

const InventoryBlockingList = () => {
  const navigate = useNavigate();
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [filter, setFilter] = useState('all');
  // details page navigation will show block details

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
        customer: faker.company.name(),
        enquiryId: `ENQ-2024-${String(faker.number.int({ min: 1, max: 999 })).padStart(3, '0')}`,
        allocatedSalesPerson: faker.person.fullName(),
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

  // navigation to details page will be used instead of modal

  const handleReleaseBlock = (blockId) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, status: 'Released' } : block
      )
    );
  };

  // removed bulk release expired action per UI update

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
    { key: 'salesOrderId', label: 'SALES ORDER', render: (value, row) => <button onClick={(e) => { e.stopPropagation(); navigate(`/sales-orders/${row.salesOrderId}`); }} className="text-blue-600 hover:text-blue-800 hover:underline font-medium">{value}</button> },
    { key: 'customer', label: 'CUSTOMER', sortable: true, render: (value) => <div className="text-sm text-gray-900">{value}</div> },
    { key: 'enquiryId', label: 'ENQUIRY ID', sortable: true, render: (value) => <div className="text-sm text-gray-900">{value}</div> },
    { key: 'allocatedSalesPerson', label: 'Sales Person', sortable: true, render: (value) => <div className="text-sm text-gray-900">{value}</div> },
    { key: 'expiry', label: 'EXPIRY DATE', render: (value) => <div className="text-sm font-medium">{value}</div> },
    { key: 'status', label: 'STATUS', render: (value) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>{value}</span> },
    {
      key: 'actions', label: 'ACTIONS', render: (_, row) => (
        <div className="flex space-x-2">
          <button
            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="View Details"
            onClick={(e) => { e.stopPropagation(); navigate(`/blocking/${row.id}`); }}
          >
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded" title="Release" onClick={(e) => { e.stopPropagation(); handleReleaseBlock(row.id); }}>
            <Unlock className="h-4 w-4" />
          </button>
        </div>
      )
    },
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
          {/* Bulk release expired removed; only allow releasing selected blocks */}
          {selectedBlocks.length > 0 && <button onClick={handleBulkReleaseSelected} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"><UnlockKeyhole className="w-4 h-4 mr-2" />Release Selected ({selectedBlocks.length})</button>}
        </div>
      </div>

      {/* Summary cards removed per request */}

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

      {/* Details are handled on a separate page now */}
    </div>
  );
};

export default InventoryBlockingList;
