import React from 'react';
import Card from './Card';
import Calendar from './Calendar';

interface Holiday {
  date: string;
  name: string;
  type: 'public' | 'academic' | 'festival';
  description?: string;
}

const HOLIDAYS: Holiday[] = [
  { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'public', description: 'National Holiday' },
  { date: '2024-10-12', name: 'Dussehra', type: 'festival', description: 'Festival Holiday' },
  { date: '2024-10-15-20', name: 'Mid-Term Break', type: 'academic', description: 'Mid-semester break for students' },
  { date: '2024-10-31', name: 'Diwali', type: 'festival', description: 'Festival of Lights' },
  { date: '2024-11-01', name: 'Diwali Holiday', type: 'festival', description: 'Extended Diwali celebration' },
  { date: '2024-11-14', name: "Children's Day", type: 'academic', description: 'Special events for students' },
  { date: '2024-12-20-31', name: 'Winter Break', type: 'academic', description: 'Year-end holidays' },
  { date: '2025-01-01', name: "New Year's Day", type: 'public', description: 'Public Holiday' },
  { date: '2025-01-26', name: 'Republic Day', type: 'public', description: 'National Holiday' },
  { date: '2025-02-14', name: 'Basant Panchami', type: 'festival', description: 'Festival Holiday' },
  { date: '2025-03-08', name: 'Holi', type: 'festival', description: 'Festival of Colors' },
  { date: '2025-03-15-25', name: 'Spring Break', type: 'academic', description: 'Spring semester break' },
];

const HolidaysCalendar: React.FC = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'public':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'festival':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'public':
        return '🏛️';
      case 'festival':
        return '🎉';
      case 'academic':
        return '📚';
      default:
        return '📅';
    }
  };

  const formatDate = (dateStr: string) => {
    if (dateStr.includes('-') && dateStr.split('-').length > 2) {
      // It's a date range
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      } else {
        const [year, month, startDay, endDay] = parts;
        return `${startDay}-${endDay}/${month}/${year}`;
      }
    }
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const upcomingHolidays = HOLIDAYS.slice(0, 5);
  const allHolidays = HOLIDAYS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Holidays & Academic Calendar
        </h2>
      </div>

      {/* Calendar View */}
      <Calendar holidays={HOLIDAYS} />

      {/* Upcoming Holidays */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Upcoming Holidays
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingHolidays.map((holiday, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${getTypeColor(holiday.type)} transform transition-all hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50">
                  {holiday.type.toUpperCase()}
                </span>
              </div>
              <h4 className="font-bold text-lg mb-1">{holiday.name}</h4>
              <p className="text-sm font-semibold mb-1">{formatDate(holiday.date)}</p>
              {holiday.description && (
                <p className="text-xs opacity-75">{holiday.description}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Full Calendar */}
      <Card>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Complete Holiday List
        </h3>
        <div className="space-y-3">
          {allHolidays.map((holiday, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-bold text-gray-900">{holiday.name}</h4>
                  {holiday.description && (
                    <p className="text-sm text-gray-600">{holiday.description}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatDate(holiday.date)}</p>
                <span className={`text-xs px-3 py-1 rounded-full ${getTypeColor(holiday.type)}`}>
                  {holiday.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Legend */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Holiday Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-bold text-gray-900">Public Holidays</p>
            <p className="text-sm text-gray-600">National holidays observed by all</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">Festival Holidays</p>
            <p className="text-sm text-gray-600">Cultural and religious festivals</p>
          </div>
          <div>
            <p className="font-bold text-gray-900">Academic Breaks</p>
            <p className="text-sm text-gray-600">Semester breaks and vacations</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HolidaysCalendar;
