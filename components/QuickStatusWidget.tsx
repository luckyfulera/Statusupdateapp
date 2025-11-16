import React, { useState, useEffect } from 'react';
import { Teacher, TeacherStatus } from '../types';
import Card from './Card';

interface QuickStatusWidgetProps {
  teacher: Teacher;
  onStatusUpdate: (teacherId: string, newStatus: TeacherStatus) => void;
}

const QuickStatusWidget: React.FC<QuickStatusWidgetProps> = ({ teacher, onStatusUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [autoStatus, setAutoStatus] = useState<TeacherStatus | null>(null);

  const statusOptions = [
    { value: TeacherStatus.AVAILABLE, label: 'Available', color: 'bg-green-500' },
    { value: TeacherStatus.IN_CLASS, label: 'In Class', color: 'bg-blue-500' },
    { value: TeacherStatus.ON_BREAK, label: 'On Break', color: 'bg-yellow-500' },
    { value: TeacherStatus.ON_HOLIDAY, label: 'On Holiday', color: 'bg-purple-500' },
    { value: TeacherStatus.UNAVAILABLE, label: 'Unavailable', color: 'bg-red-500' },
  ];

  // Auto-determine status based on timetable
  useEffect(() => {
    if (!teacher.timetable) {
      setAutoStatus(null);
      return;
    }

    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Check if current time slot has a class
    const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const TIME_SLOTS = [
      '9:00 AM - 10:00 AM',
      '10:00 AM - 11:00 AM',
      '11:00 AM - 12:00 PM',
      '12:00 PM - 1:00 PM',
      '1:00 PM - 2:00 PM',
      '2:00 PM - 3:00 PM',
      '3:00 PM - 4:00 PM',
      '4:00 PM - 5:00 PM',
    ];

    // Find current time slot
    let currentSlot = null;
    let currentHour = parseInt(currentTime.split(':')[0]);
    const currentMinute = parseInt(currentTime.split(':')[1].split(' ')[0]);

    // Convert to 24-hour format for comparison
    if (currentTime.includes('PM') && currentHour !== 12) {
      currentHour += 12;
    } else if (currentTime.includes('AM') && currentHour === 12) {
      currentHour = 0;
    }

    for (const slot of TIME_SLOTS) {
      const [startTime] = slot.split(' - ');
      let slotHour = parseInt(startTime.split(':')[0]);
      const slotMinute = parseInt(startTime.split(':')[1].split(' ')[0]);

      // Convert slot time to 24-hour format for comparison
      if (startTime.includes('PM') && slotHour !== 12) {
        slotHour += 12;
      } else if (startTime.includes('AM') && slotHour === 12) {
        slotHour = 0;
      }

      if (currentHour === slotHour && Math.abs(currentMinute - slotMinute) < 30) {
        currentSlot = slot;
        break;
      }
    }

    // Check if current slot has a class
    if (currentSlot && teacher.timetable.schedule[currentDay]?.[currentSlot]) {
      setAutoStatus(TeacherStatus.IN_CLASS);
    } else {
      // If no class scheduled, check if it's office hours or if teacher manually set status
      // For now, default to AVAILABLE if not in class and not manually set to something else
      if (teacher.status !== TeacherStatus.IN_CLASS && teacher.status !== TeacherStatus.ON_HOLIDAY) {
        setAutoStatus(TeacherStatus.AVAILABLE);
      } else {
        setAutoStatus(null); // Keep manual status
      }
    }
  }, [teacher.timetable, teacher.status]);

  const handleQuickUpdate = (status: TeacherStatus) => {
    setIsUpdating(true);
    setTimeout(() => {
      onStatusUpdate(teacher.teacherId, status);
      setIsUpdating(false);
    }, 300);
  };

  const currentDisplayStatus = autoStatus || teacher.status;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Quick Status Update
        </h3>
        {autoStatus && (
          <div className="flex items-center text-sm text-blue-600">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Auto-detected
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Current: <span className="font-bold text-gray-900">{currentDisplayStatus}</span>
        </p>
        {autoStatus && autoStatus !== teacher.status && (
          <p className="text-xs text-blue-600 mt-1">
            Based on your timetable • Click to override
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleQuickUpdate(option.value)}
            disabled={isUpdating || (autoStatus && option.value !== currentDisplayStatus)}
            className={`p-3 rounded-lg text-white font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${option.color} ${
              currentDisplayStatus === option.value ? 'ring-4 ring-offset-2 ring-gray-400' : ''
            }`}
            title={autoStatus && option.value !== currentDisplayStatus ? 'Click to override auto-detection' : ''}
          >
            <div className="text-sm">{option.label}</div>
          </button>
        ))}
      </div>

      {autoStatus && autoStatus !== teacher.status && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-blue-900">Auto-availability detected</p>
              <p className="text-blue-700">Your timetable shows you should be {autoStatus.toLowerCase()}. Click any status button above to override.</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuickStatusWidget;
