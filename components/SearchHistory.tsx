import React, { useState, useEffect } from 'react';
import Card from './Card';
import { Teacher } from '../types';

interface SearchHistoryProps {
  onTeacherSelect: (teacher: Teacher) => void;
}

interface SearchHistoryItem {
  teacher: Teacher;
  timestamp: number;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onTeacherSelect }) => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('searchHistory');
    setHistory([]);
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Recently Viewed
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-2">
        {history.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => onTeacherSelect(item.teacher)}
            className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.teacher.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.teacher.fullName}`}
                alt={item.teacher.fullName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold text-gray-900">{item.teacher.fullName}</p>
                <p className="text-xs text-gray-600">{item.teacher.designation}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">{formatTime(item.timestamp)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SearchHistory;

export const addToSearchHistory = (teacher: Teacher) => {
  const saved = localStorage.getItem('searchHistory');
  let history: SearchHistoryItem[] = saved ? JSON.parse(saved) : [];
  
  // Remove if already exists
  history = history.filter(item => item.teacher.teacherId !== teacher.teacherId);
  
  // Add to beginning
  history.unshift({ teacher, timestamp: Date.now() });
  
  // Keep only last 10
  history = history.slice(0, 10);
  
  localStorage.setItem('searchHistory', JSON.stringify(history));
};
