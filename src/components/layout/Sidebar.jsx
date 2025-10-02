import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Calculator, ShoppingCart,
  Package, Lock, Truck, ArrowDownCircle, ArrowUpCircle,
  Receipt, Archive, X, Building2, FileText, ChevronDown,
  MapPin, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [openDropdown, setOpenDropdown] = useState('');

  const handleDropdownToggle = (name) => {
    setOpenDropdown(openDropdown === name ? '' : name);
  };

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-pink-500' },
    {
      name: 'CRM',
      icon: MessageSquare,
      color: 'text-gray-500',
      children: [
        { name: 'Enquiries', href: '/enquiries', icon: MessageSquare, color: 'text-gray-500' },
        { name: 'Budget and Quote', href: '/budgets', icon: Calculator, color: 'text-gray-500' },
        { name: 'Received Orders', href: '/received-orders', icon: ShoppingCart, color: 'text-gray-500' },
        { name: 'Sales Orders', href: '/sales-orders', icon: Package, color: 'text-gray-500' },
        { name: 'Delivery Management', href: '/delivery-management', icon: Truck, color: 'text-gray-500' },
        { name: 'Inventory Block', href: '/inventory-block', icon: Shield, color: 'text-gray-500' },
        { name: 'FPO', href: '/fpo', icon: MapPin, color: 'text-gray-500' }
      ]
    },
    {
      name: 'Direct Purchase Order',
      icon: ShoppingCart,
      color: 'text-gray-500',
      children: [
        { name: 'Create Direct Purchase Order', href: '/purchase-orders/new', icon: Receipt, color: 'text-gray-500' },
        { name: 'Check In Process', href: '/check-in-process', icon: ArrowDownCircle, color: 'text-gray-500' }
      ]
    },
    {
      name: 'Direct Sales Order',
      icon: Package,
      color: 'text-gray-500',
      children: [
        { name: 'Order Management', href: '/order-management', icon: FileText, color: 'text-gray-500' },
        { name: 'Confirm Order', href: '/confirm-orders', icon: ArrowUpCircle, color: 'text-gray-500' },
        { name: 'Invoice', href: '/invoices', icon: ArrowDownCircle, color: 'text-gray-500' }
      ]
    },
    { name: 'Inventory Release', href: '/blocking', icon: Lock, color: 'text-gray-500' },
    { name: 'Inventory Management', href: '/inventory-management', icon: Package, color: 'text-gray-500' },
    {
      name: 'Master',
      icon: Archive,
      color: 'text-gray-500',
      children: [
        { name: 'Terms & Conditions', href: '/terms', icon: FileText, color: 'text-gray-500' },
      ]
    },
  ];

  const filteredItems = navigationItems.filter(item => {
    if (user?.role === 'Storekeeper') {
      return ['Dashboard', 'Inward', 'Issuance', 'Master'].includes(item.name);
    }
    return true;
  });

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">Inventory</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredItems.map((item) => {
              if (item.children) {
                const isParentActive = item.children.some(child => location.pathname.startsWith(child.href));
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => handleDropdownToggle(item.name)}
                      className={`
                        group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors
                        ${isParentActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                      `}
                    >
                      <item.icon className={`
                        mr-3 h-5 w-5 flex-shrink-0
                        ${isParentActive ? 'text-blue-700' : `${item.color} group-hover:text-gray-500`}
                      `} />
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronDown className={`h-5 w-5 transform transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.name && (
                      <div className="mt-1 space-y-1 pl-4">
                        {item.children.map(child => {
                          const isChildActive = location.pathname === child.href;
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              onClick={onClose}
                              className={`
                                group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors
                                ${isChildActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                              `}
                            >
                              <child.icon className={`
                                mr-3 h-5 w-5 flex-shrink-0
                                ${isChildActive ? 'text-blue-700' : `${child.color} group-hover:text-gray-500`}
                              `} />
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === item.href ||
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-blue-700' : `${item.color} group-hover:text-gray-500`}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
