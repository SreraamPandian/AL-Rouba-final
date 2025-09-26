import React, { useState } from 'react';
import { User, Bell, Building, Users } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'company', label: 'Company Details', icon: Building },
    { id: 'users', label: 'Users & Roles', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" defaultValue="John Smith" placeholder="Full Name" className="px-3 py-2 border rounded-md" />
              <input type="email" defaultValue="john.smith@company.com" placeholder="Email Address" className="px-3 py-2 border rounded-md" />
              <input type="password" placeholder="New Password" className="px-3 py-2 border rounded-md" />
              <input type="password" placeholder="Confirm New Password" className="px-3 py-2 border rounded-md" />
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save Changes</button>
          </div>
        );
      default:
        return <p>This section is under construction.</p>;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-3" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="md:w-3/4 bg-white rounded-lg shadow p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
