import React, { useState } from 'react';
import Card from '../components/Card';
import { Student, Teacher, UserRole } from '../types';

interface SettingsPageProps {
  user: Student | Teacher;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSaveSettings = () => {
    // Save to localStorage
    localStorage.setItem('settings', JSON.stringify({
      notifications,
      emailAlerts,
      darkMode,
    }));
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all local data? You will be logged out.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      user,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `profile-${user.role}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings & Preferences
      </h2>

      {showSaved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
          ✅ Settings saved successfully!
        </div>
      )}

      {/* Notification Settings */}
      <Card>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications about updates and announcements</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Email Alerts</h4>
              <p className="text-sm text-gray-600">Get email notifications for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Appearance
        </h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-semibold text-gray-900">Dark Mode</h4>
            <p className="text-sm text-gray-600">Switch to dark theme (Coming Soon)</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              disabled
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 opacity-50"></div>
          </label>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">Export Your Data</h4>
            <p className="text-sm text-gray-600 mb-3">Download a copy of your profile data as JSON</p>
            <button
              onClick={handleExportData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Data
            </button>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-gray-900 mb-2">Clear Local Data</h4>
            <p className="text-sm text-gray-600 mb-3">Remove all data from this browser (You will be logged out)</p>
            <button
              onClick={handleClearData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All Data
            </button>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          About
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><span className="font-semibold">Version:</span> 1.0.0</p>
          <p><span className="font-semibold">Last Updated:</span> October 2024</p>
          <p><span className="font-semibold">Storage:</span> Local Browser Storage</p>
          <p className="text-xs text-gray-500 mt-4">
            This portal uses local storage to save your data. Your information is stored only on this device.
          </p>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-lg"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
