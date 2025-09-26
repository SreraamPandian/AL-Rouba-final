import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, Plus, X, Building, User,
    Phone, Mail, MapPin, Package
} from 'lucide-react';

const NewEnquiry = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customer: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        currentStage: 'New'
    });

    const [products, setProducts] = useState([{
        id: 1,
        code: '',
        name: '',
        requested_qty: '',
        unit: 'pieces',
        description: ''
    }]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = products.map((product, i) =>
            i === index ? { ...product, [field]: value } : product
        );
        setProducts(updatedProducts);
    };

    const addProduct = () => {
        const newProduct = {
            id: products.length + 1,
            code: '',
            name: '',
            requested_qty: '',
            unit: 'pieces',
            description: ''
        };
        setProducts([...products, newProduct]);
    };

    const removeProduct = (index) => {
        if (products.length > 1) {
            setProducts(products.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log('Form Data:', { ...formData, products });
        alert('Enquiry created successfully!');
        navigate('/enquiries');
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
                        <h1 className="text-2xl font-bold text-gray-900">New Enquiry</h1>
                        <p className="text-gray-600">Create a new customer enquiry</p>
                    </div>
                </div>

                <button
                    type="submit"
                    form="enquiry-form"
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save Enquiry
                </button>
            </div>

            <form id="enquiry-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Details */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Building className="h-5 w-5 mr-2 text-purple-600" />
                        Customer Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="customer"
                                value={formData.customer}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter company name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Person *
                            </label>
                            <input
                                type="text"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter contact person name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter email address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter complete address"
                            />
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Package className="h-5 w-5 mr-2 text-purple-600" />
                            Requested Products
                        </h2>
                        <button
                            type="button"
                            onClick={addProduct}
                            className="flex items-center px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Product
                        </button>
                    </div>

                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-medium text-gray-900">Product {index + 1}</h3>
                                    {products.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeProduct(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Code *
                                        </label>
                                        <input
                                            type="text"
                                            value={product.code}
                                            onChange={(e) => handleProductChange(index, 'code', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="e.g., COMP-001"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Product Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={product.name}
                                            onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter product name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            value={product.requested_qty}
                                            onChange={(e) => handleProductChange(index, 'requested_qty', e.target.value)}
                                            required
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Enter quantity"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Unit
                                        </label>
                                        <select
                                            value={product.unit}
                                            onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="pieces">Pieces</option>
                                            <option value="kg">Kilograms</option>
                                            <option value="meters">Meters</option>
                                            <option value="liters">Liters</option>
                                            <option value="boxes">Boxes</option>
                                            <option value="sets">Sets</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={product.description}
                                        onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Enter product description or specifications"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Requirements */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Additional Requirements
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Customer Requirements & Notes
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Enter any specific requirements, timeline, budget constraints, or additional notes from the customer..."
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default NewEnquiry;
