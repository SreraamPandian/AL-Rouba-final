import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Building, Phone, Mail, MapPin
} from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

const EnquiryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const enquiry = {
    id: id || 'ENQ-2024-001',
    customer: 'Tech Solutions Inc.',
    currentStage: 'Budget Submitted',
    createdDate: '2024-01-15',
    lastModified: '2024-01-18',
    assignedManager: {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3b82f6&color=fff'
    },
    customer_details: {
      name: 'Tech Solutions Inc.',
      contact_person: 'John Anderson',
      email: 'john.anderson@techsolutions.com',
      phone: '+1 (555) 987-6543',
      address: '123 Business Park, Tech City, TC 12345'
    },
    products: [
      {
        id: 1,
        code: 'COMP-001',
        name: 'High-Performance Processor',
        requested_qty: 50,
        unit: 'pieces',
        description: 'Latest generation processor for server applications'
      },
      {
        id: 2,
        code: 'MEM-002',
        name: 'DDR5 Memory Module',
        requested_qty: 100,
        unit: 'pieces',
        description: '32GB DDR5 memory modules'
      },
      {
        id: 3,
        code: 'STO-003',
        name: 'NVMe SSD Drive',
        requested_qty: 25,
        unit: 'pieces',
        description: '1TB NVMe SSD for high-speed storage'
      }
    ],
    description: 'Customer requires components for building high-performance server systems. Timeline is critical due to upcoming project deadline.'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/enquiries')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{enquiry.id}</h1>
            <p className="text-gray-600">{enquiry.customer}</p>
          </div>
          <StatusBadge status={enquiry.currentStage} />
        </div>
      </div>

      {/* Main Content - Full width layout */}
      <div className="space-y-6">
        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{enquiry.customer_details.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p className="font-medium">{enquiry.customer_details.contact_person}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{enquiry.customer_details.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{enquiry.customer_details.phone}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{enquiry.customer_details.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Requested Products</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enquiry.products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.requested_qty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.unit}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Requirements</h2>
          <p className="text-gray-700">{enquiry.description}</p>
        </div>

        {/* Assigned Manager */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned Sales Manager</h2>
          <div className="flex items-center space-x-4">
            <img
              className="h-12 w-12 rounded-full"
              src={enquiry.assignedManager.avatar}
              alt={enquiry.assignedManager.name}
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">{enquiry.assignedManager.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{enquiry.assignedManager.email}</span>
                <span>{enquiry.assignedManager.phone}</span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Change Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetail;
