import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Filter, Download } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  itemKey = 'id',
  actions = [],
  searchable = true,
  filterable = true,
  exportable = true,
  pagination = true,
  pageSize = 10
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const selectedRows = new Set(selectedItems);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Filter data
  const filteredData = React.useMemo(() => {
    if (!searchTerm) return sortedData;

    return sortedData.filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    if (!pagination) return filteredData;

    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    const newSelection = checked ? paginatedData.map(row => row[itemKey]) : [];

    if (onSelectionChange) {
      onSelectionChange(newSelection);
    }
  };

  const handleSelectRow = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }

    if (onSelectionChange) {
      onSelectionChange(Array.from(newSelected));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Table header with search and actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            )}

            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {selectedRows.size > 0 && actions.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {selectedRows.size} selected
                </span>
                {actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => action.onClick(Array.from(selectedRows))}
                    className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {action.icon && <action.icon className="h-4 w-4 mr-2" />}
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            {exportable && (
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {selectable && (
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4 text-purple-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-purple-600" />
                          )
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row[itemKey] || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {selectable && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row[itemKey])}
                      onChange={(e) => handleSelectRow(row[itemKey], e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 px-3">
              <span className="font-medium">Page {currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
