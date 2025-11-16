import React from 'react';
import Card from './Card';

interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Mid-Term Examinations',
    message: 'Mid-term examinations will be conducted from 15th to 20th October. Please check your respective timetables.',
    date: '2024-10-01',
    type: 'warning',
  },
  {
    id: '2',
    title: 'Library Hours Extended',
    message: 'The library will now be open until 10 PM on weekdays to facilitate better study hours for students.',
    date: '2024-10-03',
    type: 'success',
  },
  {
    id: '3',
    title: 'Guest Lecture on AI',
    message: 'A guest lecture on Artificial Intelligence and Machine Learning will be held on 12th October at 2 PM in the main auditorium.',
    date: '2024-10-05',
    type: 'info',
  },
];

const Announcements: React.FC = () => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
      </div>
      <div className="space-y-4">
        {ANNOUNCEMENTS.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-4 border-l-4 rounded-r-lg ${getTypeStyles(announcement.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getIcon(announcement.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{announcement.title}</h3>
                <p className="text-sm mb-2">{announcement.message}</p>
                <p className="text-xs opacity-75">
                  {new Date(announcement.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Announcements;
