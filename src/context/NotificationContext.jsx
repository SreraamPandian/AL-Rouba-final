import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Budget Approval Required',
      message: 'Budget B-2024-001 submitted for approval',
      type: 'approval',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      title: 'FPO Delivered',
      message: 'FPO F-2024-003 has been delivered to warehouse',
      type: 'delivery',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      title: 'Block Request Approved',
      message: 'Inventory block for SO-2024-015 approved',
      type: 'approval',
      time: '2 hours ago',
      read: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    notifications,
    unreadCount,
    markAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
