import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

const TermsAndConditions = () => {
    const [termsData, setTermsData] = useState([
        {
            id: 1,
            title: 'Terms & Conditions',
            content: 'Prices Basis: In Oman Rials DDP, Muscat, Sea shipment mode (Charges extra for air shipment)'
        },
        {
            id: 2,
            title: 'Terms',
            content: 'Al Rouba Ent & Trad LLC, reserves the right to re-adapt prices in case of basket currency fluctuation in EURO/ USD/ AED to OMR as per exchange rates during Order finalization). In case of quantity variations, we reserve the right to adjust the prices for partial order.'
        },
        {
            id: 3,
            title: 'Delivery',
            content: 'As per manufacturer\'s standard. Delivery time is based on current factory capacity & raw material availability (Delivery shall be re-confirmed during order placement).'
        },
        {
            id: 4,
            title: 'Payment',
            content: 'PDC 90 days before delivery.'
        },
        {
            id: 5,
            title: 'Validity of Offer',
            content: '07 days from the date of Offer (for Price and Delivery).'
        },
        {
            id: 6,
            title: 'TPI',
            content: 'TPI Charges not included in our offer, if required charges are extra at actuals.'
        },
        {
            id: 7,
            title: 'FAT',
            content: 'FAT Charges not included in our offer, if required charges are extra at actuals.'
        },
        {
            id: 8,
            title: 'Important Note',
            content: '1) Prices are based on undivided order quantity. Partial order and any variation in specification are should be subject to our confirmation and we reserve the right to amend our prices accordingly. Other special testing charges, shall be charged extra at actuals.\n\n2) Please note, the offered prices are valid only for the afore-mentioned projects.\n\n3) Any other tax/duties/ additional duties in goods which are necessitates, and we shall not be liable for any delay in delivery of the goods however caused.\n\n4) Order once placed cannot be cancelled, All order modifications made within 48 hours after order acknowledgement will be subject to a OMR 100.000 handling fee. We reserve to charge additional costs depending on production/processing status of the order as well as modification cost consequences on open order.\n\n5) Order with a net value of less than OMR 200.00 will be subject to a OMR 100.000 handling fee.\n\n6) If not quoted, tests (TPI), certificates, special documents, legalization, spares, offloading, installation, commissioning, retention and penalty are not included in our prices and will be charged extra at actuals.'
        },
        {
            id: 9,
            title: 'Closing',
            content: 'Hope, the above offers is in line with your requirements and now look forward for your valuable association.\n\nWith best regards..'
        }
    ]);

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const handleEdit = (term) => {
        setEditingId(term.id);
        setEditTitle(term.title);
        setEditContent(term.content);
    };

    const handleSaveEdit = () => {
        setTermsData(prev => prev.map(term =>
            term.id === editingId
                ? { ...term, title: editTitle, content: editContent }
                : term
        ));
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this term?')) {
            setTermsData(prev => prev.filter(term => term.id !== id));
        }
    };

    const handleAddNew = () => {
        if (newTitle.trim() && newContent.trim()) {
            const newId = Math.max(...termsData.map(t => t.id)) + 1;
            setTermsData(prev => [...prev, {
                id: newId,
                title: newTitle,
                content: newContent
            }]);
            setNewTitle('');
            setNewContent('');
            setIsAddingNew(false);
        }
    };

    const handleCancelAdd = () => {
        setNewTitle('');
        setNewContent('');
        setIsAddingNew(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">TERMS & CONDITIONS</h1>
                <button
                    onClick={() => setIsAddingNew(true)}
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Term
                </button>
            </div>

            {/* Add New Term Form */}
            {isAddingNew && (
                <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Add New Term</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={handleAddNew}
                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                            </button>
                            <button
                                onClick={handleCancelAdd}
                                className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Title:</label>
                            <input
                                type="text"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter term title..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content:</label>
                            <textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter term content..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Terms List */}
            <div className="grid gap-6">
                {termsData.map((term) => (
                    <div key={term.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        {editingId === term.id ? (
                            // Edit Mode
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Edit Term</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                        >
                                            <Save className="h-4 w-4 mr-1" />
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Title:</label>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Content:</label>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={6}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{term.title}</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(term)}
                                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(term.id)}
                                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                    {term.content}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Message */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-center text-gray-600 text-sm">
                    These terms and conditions can be customized for each quotation and budget as needed.
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;