import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { searchProducts } from '../../data/mockProducts';

const ProductDropdown = ({
    value = '',
    onChange,
    onProductSelect,
    placeholder = 'Type to search products...',
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [inputValue, setInputValue] = useState(value);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);

        if (onChange) {
            onChange(e);
        }

        if (newValue.length >= 1) {
            const results = searchProducts(newValue, 8);
            setSearchResults(results);
            setIsOpen(results.length > 0);
        } else {
            setSearchResults([]);
            setIsOpen(false);
        }
    };

    const handleProductSelect = (product) => {
        setInputValue(product.name);
        setIsOpen(false);

        if (onProductSelect) {
            onProductSelect(product);
        }

        if (onChange) {
            const mockEvent = {
                target: { value: product.name }
            };
            onChange(mockEvent);
        }
    };

    const handleFocus = () => {
        if (inputValue.length >= 1) {
            const results = searchProducts(inputValue, 8);
            setSearchResults(results);
            setIsOpen(results.length > 0);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Electronics': 'bg-blue-100 text-blue-800',
            'Mechanical': 'bg-green-100 text-green-800',
            'Industrial': 'bg-orange-100 text-orange-800',
            'Tools': 'bg-purple-100 text-purple-800',
            'Safety': 'bg-red-100 text-red-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    className={`w-full px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm pr-8 ${className}`}
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {isOpen && searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {searchResults.map((product) => (
                        <div
                            key={product.id}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleProductSelect(product)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-gray-900 truncate">
                                            {product.name}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(product.category)}`}>
                                            {product.category}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate mb-1">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                        <span>Unit: {product.unit}</span>
                                        <span>Price: {product.price.toFixed(2)} OMR</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductDropdown;