import React, { useState } from 'react';
import { TimetableData, Teacher } from '../types';
import TimetableUploader from './TimetableUploader';

interface TimetableEditorProps {
  teacher: Teacher;
  onSave: (timetable: TimetableData) => void;
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

export const TimetableEditor: React.FC<TimetableEditorProps> = ({ teacher, onSave }) => {
  const [timetable, setTimetable] = useState<TimetableData>({
    days: DAYS_OF_WEEK,
    timeSlots: TIME_SLOTS,
    schedule: teacher.timetable?.schedule || {},
  });

  const [editingSlot, setEditingSlot] = useState<{day: string, timeSlot: string} | null>(null);
  const [newClass, setNewClass] = useState({ subject: '', class: '', room: '' });
  const [showUploader, setShowUploader] = useState(false);

  const handleSlotClick = (day: string, timeSlot: string) => {
    setEditingSlot({ day, timeSlot });
    const currentClass = timetable.schedule[day]?.[timeSlot];
    setNewClass(currentClass || { subject: '', class: '', room: '' });
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;

    const { day, timeSlot } = editingSlot;
    const newSchedule = { ...timetable.schedule };

    if (!newSchedule[day]) {
      newSchedule[day] = {};
    }

    if (newClass.subject || newClass.class || newClass.room) {
      newSchedule[day][timeSlot] = { ...newClass };
    } else {
      newSchedule[day][timeSlot] = null;
    }

    const updatedTimetable = { ...timetable, schedule: newSchedule };
    setTimetable(updatedTimetable);
    setEditingSlot(null);
  };

  const handleSaveTimetable = () => {
    onSave(timetable);
  };

  const handleTimetableUpload = (uploadedTimetable: TimetableData) => {
    setTimetable(uploadedTimetable);
    onSave(uploadedTimetable);
  };

  const isClassTime = (day: string, timeSlot: string) => {
    return timetable.schedule[day]?.[timeSlot] !== null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Timetable Management</h2>
        <button
          onClick={() => setShowUploader(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          📸 Upload Timetable Image
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-blue-900">Two ways to manage your timetable:</p>
            <p className="text-blue-700">• Click on any time slot below to manually edit individual classes</p>
            <p className="text-blue-700">• Use "Upload Timetable Image" to automatically process a photo of your schedule</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {DAYS_OF_WEEK.map(day => (
                <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {TIME_SLOTS.map(timeSlot => (
              <tr key={timeSlot} className={isClassTime('Monday', timeSlot) ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {timeSlot}
                </td>
                {DAYS_OF_WEEK.map(day => {
                  const classInfo = timetable.schedule[day]?.[timeSlot];
                  return (
                    <td
                      key={`${day}-${timeSlot}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm cursor-pointer hover:bg-gray-100 ${
                        classInfo ? 'bg-green-100 text-green-800' : 'text-gray-500'
                      }`}
                      onClick={() => handleSlotClick(day, timeSlot)}
                    >
                      {classInfo ? (
                        <div>
                          <div className="font-medium">{classInfo.subject}</div>
                          <div className="text-xs">{classInfo.class} - {classInfo.room}</div>
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

      {/* Edit Modal */}
      {editingSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Edit Schedule - {editingSlot.day} {editingSlot.timeSlot}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., Physics 101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <input
                  type="text"
                  value={newClass.class}
                  onChange={(e) => setNewClass({ ...newClass, class: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., CS-A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="e.g., A-201"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSlot}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Timetable Modal */}
      {showUploader && (
        <TimetableUploader
          teacher={teacher}
          onTimetableUpload={handleTimetableUpload}
          onClose={() => setShowUploader(false)}
        />
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveTimetable}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          Save Timetable
        </button>
      </div>
    </div>
  );
};

export default TimetableEditor;
