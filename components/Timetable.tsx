import React from 'react';
import Card from './Card';
import { UserRole } from '../types';

interface TimetableProps {
  userRole: UserRole | string; // Accept both enum and string for flexibility
}

interface ClassSlot {
  time: string;
  subject: string;
  teacher?: string;
  room?: string;
  class?: string;
}

const STUDENT_TIMETABLE: { [key: string]: ClassSlot[] } = {
  Monday: [
    { time: '9:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Samuel Chen', room: 'B-105' },
    { time: '10:00 - 11:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', teacher: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Computer Science', teacher: 'Dr. Maya Patel', room: 'B-201' },
    { time: '12:15 - 1:15', subject: 'English', teacher: 'Ms. Clara Oswald', room: 'C-310' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', teacher: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Chemistry', teacher: 'Prof. James Wilson', room: 'A-301' },
  ],
  Tuesday: [
    { time: '9:00 - 10:00', subject: 'Biology', teacher: 'Ms. Sophia Martinez', room: 'C-205' },
    { time: '10:00 - 11:00', subject: 'History', teacher: 'Dr. Arthur Dent', room: 'A-205' },
    { time: '11:00 - 11:15', subject: 'Break', teacher: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Mathematics', teacher: 'Mr. Samuel Chen', room: 'B-105' },
    { time: '12:15 - 1:15', subject: 'Physical Education', teacher: 'Mr. Robert Taylor', room: 'Sports Complex' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', teacher: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Computer Lab', teacher: 'Dr. Maya Patel', room: 'Lab-1' },
  ],
  Wednesday: [
    { time: '9:00 - 10:00', subject: 'English', teacher: 'Ms. Clara Oswald', room: 'C-310' },
    { time: '10:00 - 11:00', subject: 'Physics', teacher: 'Dr. Evelyn Reed', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', teacher: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Chemistry', teacher: 'Prof. James Wilson', room: 'A-301' },
    { time: '12:15 - 1:15', subject: 'Economics', teacher: 'Ms. Emily Brown', room: 'A-110' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', teacher: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Mathematics', teacher: 'Mr. Samuel Chen', room: 'B-105' },
  ],
  Thursday: [
    { time: '9:00 - 10:00', subject: 'Computer Science', teacher: 'Dr. Maya Patel', room: 'B-201' },
    { time: '10:00 - 11:00', subject: 'Biology', teacher: 'Ms. Sophia Martinez', room: 'C-205' },
    { time: '11:00 - 11:15', subject: 'Break', teacher: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'History', teacher: 'Dr. Arthur Dent', room: 'A-205' },
    { time: '12:15 - 1:15', subject: 'English', teacher: 'Ms. Clara Oswald', room: 'C-310' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', teacher: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Physics Lab', teacher: 'Dr. Evelyn Reed', room: 'Lab-2' },
  ],
  Friday: [
    { time: '9:00 - 10:00', subject: 'Mathematics', teacher: 'Mr. Samuel Chen', room: 'B-105' },
    { time: '10:00 - 11:00', subject: 'Chemistry', teacher: 'Prof. James Wilson', room: 'A-301' },
    { time: '11:00 - 11:15', subject: 'Break', teacher: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Physical Education', teacher: 'Mr. Robert Taylor', room: 'Sports Complex' },
    { time: '12:15 - 1:15', subject: 'Economics', teacher: 'Ms. Emily Brown', room: 'A-110' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', teacher: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Library Period', teacher: '-', room: 'Library' },
  ],
};

const TEACHER_TIMETABLE: { [key: string]: ClassSlot[] } = {
  Monday: [
    { time: '9:00 - 10:00', subject: 'Quantum Mechanics', class: 'B.Sc Physics - Year 3', room: 'A-201' },
    { time: '10:00 - 11:00', subject: 'Modern Physics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', class: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Office Hours', class: 'Student Consultation', room: 'A-201' },
    { time: '12:15 - 1:15', subject: 'Thermodynamics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', class: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Research Work', class: 'Lab', room: 'Research Lab' },
  ],
  Tuesday: [
    { time: '9:00 - 10:00', subject: 'Modern Physics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '10:00 - 11:00', subject: 'Quantum Mechanics', class: 'B.Sc Physics - Year 3', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', class: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Physics Lab', class: 'B.Sc Physics - Year 1', room: 'Lab-2' },
    { time: '12:15 - 1:15', subject: 'Physics Lab', class: 'B.Sc Physics - Year 1', room: 'Lab-2' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', class: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Department Meeting', class: 'Faculty', room: 'Conference Room' },
  ],
  Wednesday: [
    { time: '9:00 - 10:00', subject: 'Thermodynamics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '10:00 - 11:00', subject: 'Quantum Mechanics', class: 'B.Sc Physics - Year 3', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', class: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Modern Physics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '12:15 - 1:15', subject: 'Office Hours', class: 'Student Consultation', room: 'A-201' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', class: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Research Work', class: 'Lab', room: 'Research Lab' },
  ],
  Thursday: [
    { time: '9:00 - 10:00', subject: 'Quantum Mechanics', class: 'B.Sc Physics - Year 3', room: 'A-201' },
    { time: '10:00 - 11:00', subject: 'Thermodynamics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', class: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Modern Physics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '12:15 - 1:15', subject: 'Seminar', class: 'All Years', room: 'Auditorium' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', class: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Research Guidance', class: 'Ph.D. Students', room: 'A-201' },
  ],
  Friday: [
    { time: '9:00 - 10:00', subject: 'Modern Physics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '10:00 - 11:00', subject: 'Quantum Mechanics', class: 'B.Sc Physics - Year 3', room: 'A-201' },
    { time: '11:00 - 11:15', subject: 'Break', class: '-', room: '-' },
    { time: '11:15 - 12:15', subject: 'Office Hours', class: 'Student Consultation', room: 'A-201' },
    { time: '12:15 - 1:15', subject: 'Thermodynamics', class: 'B.Sc Physics - Year 2', room: 'A-201' },
    { time: '1:15 - 2:00', subject: 'Lunch Break', class: '-', room: '-' },
    { time: '2:00 - 3:00', subject: 'Free Period', class: '-', room: '-' },
  ],
};

const Timetable: React.FC<TimetableProps> = ({ userRole }) => {
  // Safely determine if the user is a student
  const isStudent = (() => {
    if (typeof userRole === 'string') {
      return userRole.toLowerCase() === UserRole.STUDENT.toLowerCase();
    }
    return userRole === UserRole.STUDENT;
  })();
  const timetable = isStudent ? STUDENT_TIMETABLE : TEACHER_TIMETABLE;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSlotColor = (subject: string) => {
    if (subject.includes('Break') || subject.includes('Lunch')) return 'bg-gray-100 text-gray-600';
    if (subject.includes('Lab')) return 'bg-purple-100 text-purple-800';
    if (subject.includes('Office Hours')) return 'bg-green-100 text-green-800';
    if (subject.includes('Research')) return 'bg-blue-100 text-blue-800';
    return 'bg-indigo-100 text-indigo-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Weekly Timetable
        </h2>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {days.map((day) => (
          <Card key={day} className="p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 text-center">
              <h3 className="font-bold text-lg">{day}</h3>
            </div>
            <div className="p-4 space-y-3">
              {timetable[day].map((slot, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${getSlotColor(slot.subject)} transition-all hover:scale-105`}
                >
                  <p className="text-xs font-semibold mb-1">{slot.time}</p>
                  <p className="font-bold text-sm">{slot.subject}</p>
                  {userRole === UserRole.STUDENT && slot.teacher && slot.teacher !== '-' && (
                    <p className="text-xs mt-1">{slot.teacher}</p>
                  )}
                  {userRole === UserRole.TEACHER && slot.class && slot.class !== '-' && (
                    <p className="text-xs mt-1">{slot.class}</p>
                  )}
                  {slot.room && slot.room !== '-' && (
                    <p className="text-xs opacity-75">📍 {slot.room}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
