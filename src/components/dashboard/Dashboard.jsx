import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SalesExecutiveDashboard from './SalesExecutiveDashboard';
import SalesManagerDashboard from './SalesManagerDashboard';
import StorekeeperDashboard from './StorekeeperDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Sales Executive':
        return <SalesExecutiveDashboard />;
      case 'Sales Manager':
        return <SalesManagerDashboard />;
      case 'Storekeeper':
        return <StorekeeperDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Purple gradient header section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 -m-6 mb-6 p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-purple-100 mt-1">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
