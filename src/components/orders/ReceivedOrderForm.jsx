import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useReceivedOrders } from '../../context/ReceivedOrdersContext';

const ReceivedOrderForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { addOrder, updateOrder, getOrder } = useReceivedOrders();

  const [formData, setFormData] = useState({
    budget: '',
    employee: '',
    receivedOrderValue: '',
    poRefNoDate: '',
    poRefNo: '',
    receivedOrderInvoice: null
  });

  const budgetOptions = [
    { value: 'PUR/3/0001', label: 'PUR/3/0001' },
    { value: 'PUR/3/0002', label: 'PUR/3/0002' },
    { value: 'PUR/3/0003', label: 'PUR/3/0003' },
    { value: 'PUR/3/0004', label: 'PUR/3/0004' },
    { value: 'PUR/3/0005', label: 'PUR/3/0005' }
  ];

  const employeeOptions = [
    { value: 'lakshmi_pitchandi', label: 'Lakshmi Kanth Pitchandi' },
    { value: 'rajesh_sharma', label: 'Rajesh Kumar Sharma' },
    { value: 'priya_nair', label: 'Priya Nair' },
    { value: 'ahmed_rashid', label: 'Ahmed Al Rashid' },
    { value: 'sarah_johnson', label: 'Sarah Johnson' }
  ];

  useEffect(() => {
    if (isEdit && id) {
      const existingOrder = getOrder(id);
      if (existingOrder) {
        // Convert employee name back to value
        const employeeValue = getEmployeeValueByName(existingOrder.employee);
        setFormData({
          budget: existingOrder.budgetId,
          employee: employeeValue,
          receivedOrderValue: existingOrder.budgetValue.toString(),
          poRefNoDate: existingOrder.receivedOrderDate,
          poRefNo: 'Order Reference', // You might want to store this in the context too
          receivedOrderInvoice: null
        });
      }
    }
  }, [isEdit, id, getOrder]);

  // Helper function to convert employee name back to value
  const getEmployeeValueByName = (employeeName) => {
    const nameToValueMap = {
      'Lakshmi Kanth Pitchandi': 'lakshmi_pitchandi',
      'Rajesh Kumar Sharma': 'rajesh_sharma',
      'Priya Nair': 'priya_nair',
      'Ahmed Al Rashid': 'ahmed_rashid',
      'Sarah Johnson': 'sarah_johnson'
    };
    return nameToValueMap[employeeName] || 'lakshmi_pitchandi';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        receivedOrderInvoice: e.target.files[0]
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.budget || !formData.employee || !formData.receivedOrderValue || !formData.poRefNo) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (isEdit) {
        updateOrder(id, formData);
        alert('Received Order updated successfully!');
      } else {
        addOrder(formData);
        alert('Received Order created successfully!');
      }
      navigate('/received-orders');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving the order. Please try again.');
    }
  };

  const handleReset = () => {
    setFormData({
      budget: '',
      employee: '',
      receivedOrderValue: '',
      poRefNoDate: '',
      poRefNo: '',
      receivedOrderInvoice: null
    });
  };

  const handleClose = () => {
    navigate('/received-orders');
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <button onClick={() => navigate('/received-orders')} className="mr-4 p-2 hover:bg-gray-100 rounded-md transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Received Order' : 'Add Received Orders'}
            </h1>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  >
                    <option value="">Select</option>
                    {budgetOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                  >
                    <option value="">Select</option>
                    {employeeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received Order Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="receivedOrderValue"
                    value={formData.receivedOrderValue}
                    onChange={handleInputChange}
                    placeholder="Received Order Value"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO/Ref.No. Date
                  </label>
                  <input
                    type="date"
                    name="poRefNoDate"
                    value={formData.poRefNoDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PO/Ref. No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="poRefNo"
                    value={formData.poRefNo}
                    onChange={handleInputChange}
                    placeholder="Order Reference"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Received Order Invoice
                  </label>
                  <input
                    type="file"
                    name="receivedOrderInvoice"
                    onChange={handleFileChange}
                    accept=".png,.jpg,.csv,.doc,.xls"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    (Choose: .png,.jpg,.csv,.doc,.xls)
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start space-x-3 mt-8">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceivedOrderForm;
