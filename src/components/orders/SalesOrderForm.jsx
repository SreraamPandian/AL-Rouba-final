import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Package } from 'lucide-react';
import ProductDropdown from '../ui/ProductDropdown';
import BlockRequestModal from '../inventory/BlockRequestModal';
import { useSalesOrders } from '../../context/SalesOrdersContext';
import { useReceivedOrders } from '../../context/ReceivedOrdersContext';

const SalesOrderForm = ({ isModal = false, onClose }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addSalesOrder, updateSalesOrder, getSalesOrder } = useSalesOrders();
  const { orders: receivedOrders } = useReceivedOrders();

  const [formData, setFormData] = useState({
    customerName: '',
    date: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    address: ''
  });

  const [allocations, setAllocations] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [blockItem, setBlockItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) {
      const order = getSalesOrder(id);
      if (order) {
        setFormData(prev => ({ ...prev, ...order }));
        setAllocations(order.items || []);
        setIsEditing(true);
      }
    }
  }, [id, getSalesOrder]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addNewItem = () => setAllocations(prev => ([...prev, { id: Date.now(), partNumber: '', description: '', requiredQty: 0, availableQty: 0, blockedQty: 0, allocatedQty: 0, rate: 0, amount: 0 }]));

  const handleAllocationChange = (index, field, value) => {
    const copy = [...allocations];
    copy[index] = { ...copy[index], [field]: value };
    if (field === 'allocatedQty' || field === 'rate') {
      const qty = copy[index].allocatedQty || 0;
      const rate = copy[index].rate || 0;
      copy[index].amount = qty * rate;
    }
    setAllocations(copy);
  };

  const getAllocatable = (item) => Math.max(0, (item.availableQty || 0) - (item.blockedQty || 0));

  const getLineStatus = (item) => {
    if (getAllocatable(item) === 0) return 'Backordered';
    if ((item.allocatedQty || 0) >= (item.requiredQty || 0) && (item.requiredQty || 0) > 0) return 'Fully Allocated';
    if ((item.allocatedQty || 0) > 0) return 'Partially Allocated';
    return 'Not Allocated';
  };

  const statusClass = (value) => (
    value === 'Fully Allocated' ? 'bg-green-100 text-green-800' :
      value === 'Partially Allocated' ? 'bg-yellow-100 text-yellow-800' :
        value === 'Backordered' ? 'bg-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
  );

  const totals = allocations.reduce((acc, it) => ({ subtotal: acc.subtotal + (it.amount || 0), tax: acc.tax + 0 }), { subtotal: 0, tax: 0 });

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    const data = { ...formData, items: allocations, totalAmount: totals.subtotal };
    if (id) updateSalesOrder(parseInt(id), data); else addSalesOrder(data);
    if (isModal && onClose) onClose(); else navigate('/sales-orders');
  };

  const calculateOverallStatus = () => {
    if (allocations.length === 0) return 'Not Allocated';
    const allFully = allocations.every(it => (it.allocatedQty || 0) >= (it.requiredQty || 0) && (it.requiredQty || 0) > 0);
    if (allFully) return 'Fully Allocated';
    const anyAllocated = allocations.some(it => (it.allocatedQty || 0) > 0);
    if (anyAllocated) return 'Partially Allocated';
    return 'Not Allocated';
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {!isModal && <button onClick={() => navigate('/sales-orders')} className="text-gray-600 hover:text-gray-800 flex items-center"><ArrowLeft className="mr-1" /> Back</button>}
          <h2 className="text-2xl font-semibold">Sale Order</h2>
        </div>
        {isModal && <button onClick={onClose} className="text-gray-500">×</button>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-h-[68vh] overflow-y-auto pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm text-gray-700">Customer</label>
                    <input name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Sales Order Date *</label>
                    <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Expected Delivery Date *</label>
                    <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Payment Terms *</label>
                    <select className="w-full px-3 py-2 border rounded"><option>--Select Payment Terms--</option></select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-700">Ship Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows={4} className="w-full px-3 py-2 border rounded mt-1" />
                </div>

                <div className="mt-4 bg-white rounded shadow border">
                  <div className="bg-gray-900 text-white px-4 py-3">
                    <div className="grid grid-cols-8 gap-4 items-center text-sm font-semibold">
                      <div className="col-span-1">Product ID</div>
                      <div className="col-span-2">Product Name</div>
                      <div className="col-span-1">Category</div>
                      <div className="col-span-1">Price</div>
                      <div className="col-span-1">Quantity</div>
                      <div className="col-span-1">Tax</div>
                      <div className="col-span-1">Total</div>
                    </div>
                  </div>

                  <div className="px-4 py-4 bg-gray-800">
                    <div className="grid grid-cols-8 gap-4 items-center">
                      <div className="col-span-1"><input className="w-full px-2 py-2 rounded bg-white" /></div>
                      <div className="col-span-2"><input className="w-full px-2 py-2 rounded bg-gray-100" /></div>
                      <div className="col-span-1"><input className="w-full px-2 py-2 rounded bg-gray-100" /></div>
                      <div className="col-span-1"><input className="w-full px-2 py-2 rounded bg-white" /></div>
                      <div className="col-span-1"><input className="w-24 px-2 py-2 rounded bg-white" /></div>
                      <div className="col-span-1"><input className="w-24 px-2 py-2 rounded bg-white" /></div>
                      <div className="col-span-1"><input className="w-32 px-2 py-2 rounded bg-white" /></div>
                    </div>
                  </div>

                  <div className="px-4 py-4">
                    {allocations.length === 0 ? (
                      <div className="text-center py-6 text-gray-500"><Package className="mx-auto mb-2" /></div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">#</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Requested</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Available</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Blocked</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Allocatable</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Allocate Qty</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Line Status</th>
                              <th className="px-4 py-2 text-center text-xs font-medium text-gray-600 uppercase">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allocations.map((item, idx) => {
                              const allocatable = getAllocatable(item);
                              const status = getLineStatus(item);
                              const rowBg = status === 'Partially Allocated' ? 'bg-yellow-50' : '';
                              return (
                                <tr key={item.id} className={`border-b border-gray-200 ${rowBg}`}>
                                  <td className="px-4 py-3 text-center">{idx + 1}</td>
                                  <td className="px-4 py-3 align-top">
                                    <div className="mb-2">
                                      <ProductDropdown
                                        value={item.description || ''}
                                        onProductSelect={(product) => {
                                          const updated = [...allocations];
                                          const current = { ...updated[idx] };
                                          current.description = product.name;
                                          current.partNumber = product.id;
                                          if (typeof current.rate !== 'undefined') {
                                            current.rate = product.price;
                                            current.amount = (current.allocatedQty || 0) * (current.rate || 0);
                                          }
                                          updated[idx] = current;
                                          setAllocations(updated);
                                        }}
                                        placeholder="Select product..."
                                        className="w-full"
                                      />
                                    </div>
                                    <div className="text-xs text-gray-500">Code: {item.partNumber || '—'}</div>
                                  </td>
                                  <td className="px-4 py-3 text-center font-medium">{item.requiredQty || 0}</td>
                                  <td className="px-4 py-3 text-center">{item.availableQty || 0}</td>
                                  <td className="px-4 py-3 text-center">{item.blockedQty || 0}</td>
                                  <td className="px-4 py-3 text-center font-semibold">{allocatable}</td>
                                  <td className="px-4 py-3 text-center">
                                    <input
                                      type="number"
                                      value={item.allocatedQty || 0}
                                      onChange={(e) => handleAllocationChange(idx, 'allocatedQty', parseInt(e.target.value) || 0)}
                                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                                      min="0"
                                    />
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass(status)}`}>{status}</span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                      <button
                                        type="button"
                                        className="px-3 py-1 text-purple-700 border border-purple-400 rounded-md hover:bg-purple-50 text-xs"
                                        onClick={() => {
                                          setBlockItem({
                                            product: item.description,
                                            code: item.partNumber,
                                            requestedQty: item.requiredQty,
                                            availableQty: item.availableQty,
                                            blockedQty: item.blockedQty
                                          }); setBlockModalOpen(true);
                                        }}
                                      >
                                        Block
                                      </button>
                                      <button
                                        type="button"
                                        className="px-3 py-1 text-orange-700 border border-orange-400 rounded-md hover:bg-orange-50 text-xs"
                                        onClick={() => navigate('/fpo/new', { state: { salesOrderItem: item } })}
                                      >
                                        FPO
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  <div className="p-4 relative">
                    <button type="button" onClick={addNewItem} className="bg-blue-600 text-white px-4 py-2 rounded-full absolute right-4 bottom-0 transform translate-y-1/2 shadow-lg"><Plus /></button>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-white rounded shadow p-4 sticky top-6">
                  <label className="block text-sm text-gray-700 mb-2">VAT Type *</label>
                  <select className="w-full px-3 py-2 border rounded mb-4"><option>-- Select VAT Type --</option></select>

                  <div className="text-sm text-gray-600 mb-2">Summary</div>
                  <div className="bg-white border rounded">
                    <div className="grid grid-cols-2 p-3 border-b"><div>Total</div><div className="text-right">{totals.subtotal.toFixed(3)}</div></div>
                    <div className="grid grid-cols-2 p-3 border-b"><div>Total Tax</div><div className="text-right">{totals.tax.toFixed(3)}</div></div>
                    <div className="grid grid-cols-2 p-3 border-b items-center"><div>Discount (%)</div><div><input className="w-full px-2 py-1 border rounded" /></div></div>
                    <div className="grid grid-cols-2 p-3 border-b items-start"><div>Adjustment</div><div><input className="w-full px-2 py-1 border rounded mb-2" placeholder="What type of Adjustment?" /><input className="w-full px-2 py-1 border rounded" placeholder="Adjustment Amount" /></div></div>
                    <div className="grid grid-cols-2 p-3 border-b"><div>Grand Total</div><div className="text-right font-semibold">{totals.subtotal.toFixed(3)}</div></div>
                    <div className="grid grid-cols-2 p-3"><div>Advance Amount</div><div><input className="w-full px-2 py-1 border rounded" value="0.000" readOnly /></div></div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 12 }} />

            {allocations.length > 0 && (
              <div className="mt-4 flex justify-between items-center">
                <div className="text-lg font-semibold">
                  Status:
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${calculateOverallStatus() === 'Fully Allocated' ? 'bg-green-100 text-green-800' :
                    calculateOverallStatus() === 'Partially Allocated' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                    {calculateOverallStatus()}
                  </span>
                </div>
                <div className="text-lg font-semibold">
                  Total Amount: ₹{allocations.reduce((sum, item) => sum + (item.amount || 0), 0).toFixed(2)}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isEditing && (
                  <>
                    <button
                      type="button"
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      onClick={() => {
                        const selected = allocations.filter(a => selectedRows.includes(a.id));
                        const target = (selected[0] || allocations[0]);
                        if (target) {
                          setBlockItem({
                            product: target.description,
                            code: target.partNumber,
                            requestedQty: target.requiredQty,
                            availableQty: target.availableQty,
                            blockedQty: target.blockedQty
                          });
                          setBlockModalOpen(true);
                        }
                      }}
                    >
                      Block Selected
                    </button>
                  </>
                )}
              </div>

              {/* intentional: navigation buttons removed per UX request */}
            </div>

          </div>
        </div>

        {isModal ? (
          <div className="sticky bottom-0 left-0 w-full bg-white border-t py-4 flex justify-end space-x-3 px-6 z-40">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Close</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"><Save size={16} /><span>Create Sale Order</span></button>
          </div>
        ) : (
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/sales-orders')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save size={16} />
              <span>{isEditing ? 'Update' : 'Create'} Sales Order</span>
            </button>
          </div>
        )}
      </form>

      {blockModalOpen && blockItem && (
        <BlockRequestModal item={blockItem} onClose={() => setBlockModalOpen(false)} onSubmit={() => { setBlockModalOpen(false); navigate('/blocking'); }} />
      )}
    </div>
  );
};

export default SalesOrderForm;
