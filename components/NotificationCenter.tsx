import React, { useState } from 'react';
import Card from './Card';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false,
  },
  {
    id: '2',
    title: 'New Announcement',
    message: 'Mid-term examinations schedule has been posted.',
    type: 'info',
    timestamp: '5 hours ago',
    read: false,
  },
  {
    id: '3',
    title: 'Holiday Reminder',
    message: 'Dussehra holiday starts tomorrow.',
    type: 'warning',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '4',
    title: 'Timetable Change',
    message: 'Physics class has been rescheduled to Room A-205.',
    type: 'info',
    timestamp: '2 days ago',
    read: true,
  },
];

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showAll, setShowAll] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📭</div>
          <p>No notifications</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {displayedNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`p-4 border-l-4 rounded-r-lg cursor-pointer transition-all ${getTypeStyles(notification.type)} ${
                  !notification.read ? 'shadow-md' : 'opacity-75'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{notification.title}</h4>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <p className="text-xs opacity-75 mt-2">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {notifications.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full mt-4 text-center text-indigo-600 hover:text-indigo-700 font-medium py-2"
            >
              {showAll ? 'Show Less' : `Show ${notifications.length - 3} More`}
            </button>
          )}
        </>
      )}
    </Card>
  );
};

export default NotificationCenter;
