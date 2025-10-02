import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    Lock,
    Package,
    Calendar,
    User,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Unlock
} from 'lucide-react';

const InventoryBlockManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    // Sample inventory block data - this will be replaced with actual data from context/API
    const [inventoryBlocks] = useState([
        {
            id: 'IB001',
            productCode: 'P001',
            productName: 'Product A',
            quantity: 100,
            blockedQuantity: 50,
            blockType: 'quality-hold',
            reason: 'Quality inspection pending',
            blockedBy: 'John Doe',
            blockedDate: '2024-10-10',
            expectedReleaseDate: '2024-10-20',
            status: 'active',
            location: 'Warehouse A-1',
            batchNo: 'B001',
            priority: 'high'
        },
        {
            id: 'IB002',
            productCode: 'P002',
            productName: 'Product B',
            quantity: 200,
            blockedQuantity: 75,
            blockType: 'damaged',
            reason: 'Damaged during handling',
            blockedBy: 'Sarah Johnson',
            blockedDate: '2024-10-12',
            expectedReleaseDate: '2024-10-25',
            status: 'active',
            location: 'Warehouse B-2',
            batchNo: 'B002',
            priority: 'medium'
        },
        {
            id: 'IB003',
            productCode: 'P003',
            productName: 'Product C',
            quantity: 150,
            blockedQuantity: 30,
            blockType: 'reserved',
            reason: 'Reserved for special order',
            blockedBy: 'Mike Wilson',
            blockedDate: '2024-10-08',
            expectedReleaseDate: '2024-10-18',
            status: 'released',
            location: 'Warehouse C-3',
            batchNo: 'B003',
            priority: 'low'
        },
        {
            id: 'IB004',
            productCode: 'P004',
            productName: 'Product D',
            quantity: 80,
            blockedQuantity: 80,
            blockType: 'expired',
            reason: 'Product expired',
            blockedBy: 'Admin',
            blockedDate: '2024-10-15',
            expectedReleaseDate: null,
            status: 'permanent',
            location: 'Warehouse D-4',
            batchNo: 'B004',
            priority: 'high'
        }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-yellow-100 text-yellow-800';
            case 'released': return 'bg-green-100 text-green-800';
            case 'permanent': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getBlockTypeColor = (type) => {
        switch (type) {
            case 'quality-hold': return 'bg-purple-100 text-purple-800';
            case 'damaged': return 'bg-red-100 text-red-800';
            case 'reserved': return 'bg-blue-100 text-blue-800';
            case 'expired': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBlocks = inventoryBlocks.filter(block => {
        const matchesSearch = block.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            block.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            block.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            block.reason.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || block.status === statusFilter;
        const matchesType = typeFilter === 'all' || block.blockType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleCreateBlock = () => {
        navigate('/inventory-block/new');
    };

    const handleViewBlock = (id) => {
        navigate(`/inventory-block/view/${id}`);
    };

    const handleEditBlock = (id) => {
        navigate(`/inventory-block/edit/${id}`);
    };

    const handleReleaseBlock = (id) => {
        // This would handle releasing the inventory block
        console.log('Releasing block:', id);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Block Management</h1>
                    <p className="text-gray-600">Manage inventory blocks and holds</p>
                </div>
                <button
                    onClick={handleCreateBlock}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Block
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by product, code, block ID, or reason..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="released">Released</option>
                            <option value="permanent">Permanent</option>
                            <option value="pending">Pending</option>
                        </select>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="quality-hold">Quality Hold</option>
                            <option value="damaged">Damaged</option>
                            <option value="reserved">Reserved</option>
                            <option value="expired">Expired</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="h-5 w-5 mr-2" />
                            More Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Block Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Lock className="h-6 w-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Blocks</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {inventoryBlocks.filter(b => b.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">High Priority</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {inventoryBlocks.filter(b => b.priority === 'high' && b.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Released</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {inventoryBlocks.filter(b => b.status === 'released').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Package className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Blocked Qty</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {inventoryBlocks.reduce((sum, b) => sum + b.blockedQuantity, 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inventory Blocks List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Inventory Blocks</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Block Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product Information
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Quantities
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Block Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBlocks.map((block) => (
                                <tr key={block.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{block.id}</div>
                                            <div className="text-sm text-gray-500">By: {block.blockedBy}</div>
                                            <div className="text-sm text-gray-500">{block.location}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{block.productName}</div>
                                            <div className="text-sm text-gray-500">Code: {block.productCode}</div>
                                            <div className="text-sm text-gray-500">Batch: {block.batchNo}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                Total: {block.quantity}
                                            </div>
                                            <div className="text-sm text-red-600 font-medium">
                                                Blocked: {block.blockedQuantity}
                                            </div>
                                            <div className="text-sm text-green-600">
                                                Available: {block.quantity - block.blockedQuantity}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBlockTypeColor(block.blockType)} mb-1`}>
                                                {block.blockType.charAt(0).toUpperCase() + block.blockType.slice(1).replace('-', ' ')}
                                            </span>
                                            <div className="text-sm text-gray-500">{block.reason}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 flex items-center">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {block.blockedDate}
                                            </div>
                                            {block.expectedReleaseDate && (
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    Expected: {block.expectedReleaseDate}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(block.status)}`}>
                                                {block.status.charAt(0).toUpperCase() + block.status.slice(1)}
                                            </span>
                                            <div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(block.priority)}`}>
                                                    {block.priority.charAt(0).toUpperCase() + block.priority.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewBlock(block.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View Details"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            {block.status === 'active' && (
                                                <>
                                                    <button
                                                        onClick={() => handleEditBlock(block.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Edit Block"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleReleaseBlock(block.id)}
                                                        className="text-orange-600 hover:text-orange-900"
                                                        title="Release Block"
                                                    >
                                                        <Unlock className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredBlocks.length === 0 && (
                    <div className="text-center py-12">
                        <Lock className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory blocks found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                                ? 'Try adjusting your search criteria'
                                : 'Get started by creating your first inventory block'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryBlockManagement;