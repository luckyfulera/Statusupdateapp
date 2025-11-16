import React, { useState, useMemo } from 'react';
import Card from './Card';

interface Holiday {
  date: string;
  name: string;
  type: 'public' | 'academic' | 'festival';
  description?: string;
}

interface CalendarProps {
  holidays: Holiday[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date | null;
}

type CalendarView = 'month' | 'week' | 'day';

const Calendar: React.FC<CalendarProps> = ({ 
  holidays, 
  onDateClick,
  selectedDate: externalSelectedDate 
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(externalSelectedDate || null);
  const [showEventPopup, setShowEventPopup] = useState<{x: number, y: number, event: Holiday} | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Memoize the processed holidays for better performance
  const processedHolidays = useMemo(() => {
    return holidays.map(holiday => {
      if (holiday.date.includes('-') && holiday.date.split('-').length > 3) {
        // Handle date ranges
        const [year, month, startDay, endDay] = holiday.date.split('-').map(Number);
        const startDate = new Date(year, month - 1, startDay);
        const endDate = new Date(year, month - 1, endDay);
        return {
          ...holiday,
          startDate,
          endDate,
          isRange: true
        };
      } else {
        // Single day event
        const [year, month, day] = holiday.date.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return {
          ...holiday,
          startDate: date,
          endDate: date,
          isRange: false
        };
      }
    });
  }, [holidays]);

  const isHoliday = (date: Date): Holiday | null => {
    const dateStr = date.toISOString().split('T')[0];
    return processedHolidays.find(holiday => {
      if (holiday.isRange) {
        return date >= holiday.startDate && date <= holiday.endDate;
      }
      return holiday.startDate.toISOString().split('T')[0] === dateStr;
    }) || null;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="p-2 min-h-[80px] border border-transparent"
        ></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const holiday = isHoliday(date);
      const dayIsToday = isToday(date);
      const isSelected = selectedDate && 
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      days.push(
        <div
          key={day}
          onClick={() => {
            setSelectedDate(date);
            onDateClick?.(date);
          }}
          onMouseEnter={(e) => {
            if (holiday) {
              const rect = e.currentTarget.getBoundingClientRect();
              setShowEventPopup({
                x: rect.left,
                y: rect.bottom,
                event: holiday
              });
            }
          }}
          onMouseLeave={() => setShowEventPopup(null)}
          className={`relative p-1 sm:p-2 min-h-[60px] sm:min-h-[80px] border rounded-md sm:rounded-lg transition-all cursor-pointer
            ${dayIsToday ? 'bg-indigo-50 border-indigo-300' : ''}
            ${holiday ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}
            ${isSelected ? 'ring-1 sm:ring-2 ring-blue-400' : ''}
            ${isWeekend ? 'bg-gray-50' : ''}
            hover:shadow-md hover:z-10 hover:scale-[1.02]`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-1">
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  dayIsToday ? 'text-indigo-700' : 
                  holiday ? 'text-red-700' : 
                  isWeekend ? 'text-gray-500' :
                  'text-gray-700'
                }`}
              >
                {day}
              </span>
              {holiday && (
                <span className="text-[10px] sm:text-xs px-0.5 sm:px-1 rounded bg-white/70">
                  {holiday.type[0].toUpperCase()}
                </span>
              )}
            </div>
            {holiday && (
              <div 
                className="text-[10px] sm:text-xs text-red-600 font-medium line-clamp-1 sm:line-clamp-2"
                title={holiday.name}
              >
                {holiday.name}
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      const holiday = isHoliday(date);
      const dayIsToday = isToday(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      
      return (
        <div 
          key={i}
          onClick={() => setSelectedDate(date)}
          className={`p-2 border rounded-lg ${dayIsToday ? 'bg-indigo-50' : isWeekend ? 'bg-gray-50' : 'bg-white'} ${
            isSelected ? 'ring-2 ring-blue-400' : ''
          } hover:shadow-md transition-shadow`}
        >
          <div className="text-sm font-semibold mb-2">
            {daysOfWeek[i]}, {date.getDate()}
          </div>
          {holiday && (
            <div className="text-xs bg-red-100 text-red-800 rounded p-1 mb-1 truncate">
              {holiday.name}
            </div>
          )}
        </div>
      );
    });
  };

  const renderDayView = () => {
    const date = selectedDate || currentDate;
    const holiday = isHoliday(date);
    const dayIsToday = isToday(date);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    return (
      <div className="space-y-4">
        <div className="text-xl font-bold">
          {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          {dayIsToday && (
            <span className="ml-2 text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              Today
            </span>
          )}
          {isWeekend && (
            <span className="ml-2 text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              Weekend
            </span>
          )}
        </div>
        
        {holiday ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
            <div className="font-bold text-red-800">{holiday.name}</div>
            <div className="text-sm text-red-700">{holiday.type}</div>
            {holiday.description && (
              <p className="mt-2 text-red-600">{holiday.description}</p>
            )}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            <h4 className="mt-2 text-lg font-medium text-gray-700">No events scheduled</h4>
            <p className="mt-1 text-sm text-gray-500">Enjoy your day off!</p>
          </div>
        )}
      </div>
    );
  };

  // Navigation functions
  const navigateDays = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);
    setCurrentDate(newDate);
    if (view === 'day') setSelectedDate(newDate);
  };

  const navigateWeeks = (weeks: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (weeks * 7));
    setCurrentDate(newDate);
  };

  const navigateMonths = (months: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + months);
    setCurrentDate(newDate);
  };

  const handleViewChange = (newView: CalendarView) => {
    setView(newView);
    if (newView === 'day' && !selectedDate) {
      setSelectedDate(currentDate);
    }
  };

  // Handle navigation based on current view
  const handlePrevious = () => {
    if (view === 'day') navigateDays(-1);
    else if (view === 'week') navigateWeeks(-1);
    else navigateMonths(-1);
  };

  const handleNext = () => {
    if (view === 'day') navigateDays(1);
    else if (view === 'week') navigateWeeks(1);
    else navigateMonths(1);
  };

  // Format date for display
  const getHeaderDate = () => {
    if (view === 'day' && selectedDate) {
      return selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              ${endOfWeek.toLocaleDateString('en-US', { 
                month: startOfWeek.getMonth() !== endOfWeek.getMonth() ? 'short' : undefined, 
                day: 'numeric', 
                year: 'numeric' 
              })}`;
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-100 rounded-full opacity-20"></div>
      <div className="hidden sm:block absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-100 rounded-full opacity-20"></div>
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white/90 sm:bg-white/80 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900">
            {getHeaderDate()}
          </h3>
          
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md shadow-sm border border-gray-200 bg-white overflow-hidden" role="group">
              {(['month', 'week', 'day'] as const).map((viewType) => (
                <button
                  key={viewType}
                  type="button"
                  onClick={() => handleViewChange(viewType)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${
                    view === viewType
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border-gray-300 ${
                    viewType === 'month' ? 'rounded-l-md sm:rounded-l-lg' : ''
                  } ${
                    viewType === 'day' ? 'rounded-r-md sm:rounded-r-lg' : ''
                  } ${viewType !== 'month' && viewType !== 'day' ? 'border-l-0 border-r-0' : ''}`}
                >
                  {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="flex gap-1 sm:gap-2 ml-1 sm:ml-2 bg-white/90 sm:bg-white/80 p-0.5 sm:p-1 rounded-md sm:rounded-lg border border-gray-200">
              <button
                onClick={handlePrevious}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors"
                title={`Previous ${view}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToToday}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white rounded-md sm:rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm font-medium"
              >
                Today
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors"
                title={`Next ${view}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        {view === 'month' && (
          <>
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1">
              {daysOfWeek.map((day, index) => (
                <div
                  key={day}
                  className={`text-center font-bold text-xs sm:text-sm py-2 sm:py-3 rounded-md sm:rounded-lg ${
                    index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
                  } bg-gray-50 text-ellipsis overflow-hidden px-1`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {renderMonthView()}
            </div>
          </>
        )}

        {view === 'week' && (
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
            {renderWeekView()}
          </div>
        )}

        {view === 'day' && (
          <div className="min-h-[200px]">
            {renderDayView()}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-gray-200 text-xs sm:text-sm bg-white/50 p-2 sm:p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-indigo-100 border-2 border-indigo-500 rounded"></div>
            <span className="text-gray-600">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-50 border border-red-300 rounded"></div>
            <span className="text-gray-600">Holiday</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-50 border-2 border-blue-500 rounded"></div>
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>

      {/* Event Popup */}
      {showEventPopup && (
        <div 
          className="fixed sm:absolute z-50 w-[calc(100vw-2rem)] sm:w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{
            left: '50%',
            right: '1rem',
            top: `min(calc(${showEventPopup.y}px + 1rem), calc(100vh - 200px))`,
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 2rem)'
          }}
          onMouseEnter={() => {}}
          onMouseLeave={() => setShowEventPopup(null)}
        >
          <div className="font-bold text-gray-900">{showEventPopup.event.name}</div>
          <div className="text-sm text-gray-600 mb-2">
            {showEventPopup.event.type.charAt(0).toUpperCase() + showEventPopup.event.type.slice(1)}
          </div>
          {showEventPopup.event.description && (
            <p className="text-sm text-gray-700">{showEventPopup.event.description}</p>
          )}
          <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
            Click for details
          </div>
        </div>
      )}
    </Card>
  );
};

export default Calendar;
