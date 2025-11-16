import React from 'react';
import { TimetableData, Teacher } from '../types';

interface TimetableViewerProps {
  teacher: Teacher;
  currentDay?: string;
  currentTime?: string;
}

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

export const TimetableViewer: React.FC<TimetableViewerProps> = ({
  teacher,
  currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' }),
  currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}) => {
  const timetable = teacher.timetable;

  if (!timetable) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">📅</div>
          <p className="text-gray-600">No timetable available for this teacher.</p>
        </div>
      </div>
    );
  }

  const getCurrentSlot = () => {
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
        return slot;
      }
    }
    return null;
  };

  const currentSlot = getCurrentSlot();
  const isClassTime = (day: string, timeSlot: string) => {
    return timetable.schedule[day]?.[timeSlot] !== null;
  };

  const getSlotStatus = (day: string, timeSlot: string) => {
    const classInfo = timetable.schedule[day]?.[timeSlot];
    if (classInfo) {
      if (day === currentDay && timeSlot === currentSlot) {
        return 'current-class';
      }
      return 'scheduled-class';
    }
    return 'free';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Timetable</h2>
        <div className="text-sm text-gray-600">
          Current: {currentDay} {currentTime}
        </div>
      </div>

      {currentSlot && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <span className="text-blue-600 mr-2">🕐</span>
            <span className="font-medium text-blue-800">
              Currently in: {timetable.schedule[currentDay]?.[currentSlot] ?
                `${timetable.schedule[currentDay][currentSlot].subject} (${timetable.schedule[currentDay][currentSlot].class})` :
                'Free Period'
              }
            </span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {DAYS_OF_WEEK.map(day => (
                <th
                  key={day}
                  className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                    day === currentDay ? 'bg-blue-100 text-blue-800' : 'text-gray-500'
                  }`}
                >
                  {day}
                  {day === currentDay && <span className="ml-1 text-blue-600">📅</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TIME_SLOTS.map(timeSlot => (
              <tr key={timeSlot} className={`${currentDay && timeSlot === currentSlot ? 'bg-yellow-50' : ''}`}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  timeSlot === currentSlot ? 'text-blue-600 font-bold' : 'text-gray-900'
                }`}>
                  {timeSlot}
                  {timeSlot === currentSlot && <span className="ml-1">🕐</span>}
                </td>
                {DAYS_OF_WEEK.map(day => {
                  const classInfo = timetable.schedule[day]?.[timeSlot];
                  const status = getSlotStatus(day, timeSlot);

                  return (
                    <td
                      key={`${day}-${timeSlot}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        status === 'current-class' ? 'bg-green-100 text-green-800 font-medium' :
                        status === 'scheduled-class' ? 'bg-blue-50 text-blue-700' :
                        'text-gray-500'
                      }`}
                    >
                      {classInfo ? (
                        <div>
                          <div className="font-medium">{classInfo.subject}</div>
                          <div className="text-xs opacity-75">
                            {classInfo.class} • {classInfo.room}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        💡 Click on any time slot to see details • Green indicates current class • Blue indicates scheduled class
      </div>
    </div>
  );
};

export default TimetableViewer;
