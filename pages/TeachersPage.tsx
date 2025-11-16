import React from 'react';
import { Teacher } from '../types';
import TeachersList from '../components/TeachersList';
import { MOCK_TEACHERS } from '../constants';

export default function TeachersPage() {
  // In a real app, you would fetch this data from an API
  const teachers: Teacher[] = MOCK_TEACHERS;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Directory</h1>
          <p className="mt-2 text-sm text-gray-700">
            Browse and find information about our teaching faculty members.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export List
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        <TeachersList teachers={teachers} />
      </div>
    </div>
  );
}
