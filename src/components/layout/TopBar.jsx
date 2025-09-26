import React, { useState } from 'react';
import { Search, Bell, Menu, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationPanel from '../notifications/NotificationPanel';

const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg h-16 flex items-center justify-between px-6">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md text-white/80 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, customers, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-80 bg-white/90 backdrop-blur-sm border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-white/80 hover:bg-white/10 rounded-lg"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10"
          >
            <img
              className="h-8 w-8 rounded-full border-2 border-white/30"
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=ffffff&color=9333ea`}
              alt={user?.name}
            />
            <div className="text-left">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-white/70">{user?.role}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-white/70" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                <div className="font-medium">{user?.name}</div>
                <div className="text-gray-500">{user?.email}</div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowUserMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
