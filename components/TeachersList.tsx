import React, { useState } from 'react';
import { Teacher } from '../types';
import { SearchIcon, UserCircleIcon, AcademicCapIcon, BookOpenIcon } from '@heroicons/react/outline';
import TeacherDetails from './TeacherDetails';

interface TeachersListProps {
  teachers: Teacher[];
}

const TeachersList: React.FC<TeachersListProps> = ({ teachers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredTeachers = teachers.filter(teacher =>
    teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.teacherId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTeacherClick = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedTeacher(null);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search teachers by name, department, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredTeachers.length} {filteredTeachers.length === 1 ? 'teacher' : 'teachers'} found
            </span>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.teacherId}
            onClick={() => handleTeacherClick(teacher)}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-600">
                    {teacher.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{teacher.fullName}</h3>
                  <p className="text-sm text-gray-500">{teacher.designation}</p>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                {teacher.department && (
                  <div className="flex items-center text-sm text-gray-600">
                    <AcademicCapIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span>{teacher.department}</span>
                  </div>
                )}
                
                {teacher.subjects && teacher.subjects.length > 0 && (
                  <div className="flex items-start text-sm text-gray-600">
                    <BookOpenIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400 mt-0.5" />
                    <span className="line-clamp-2">
                      {teacher.subjects.join(', ')}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-600">
                  <UserCircleIcon className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                  <span>ID: {teacher.teacherId}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 text-right text-sm">
              <span className="text-blue-600 hover:text-blue-800 font-medium">
                View Details →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredTeachers.length === 0 && (
        <div className="text-center py-12">
          <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No teachers found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try a different search term' : 'No teachers available at the moment'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <div className={`fixed inset-0 overflow-hidden z-50 ${isDetailsOpen ? 'block' : 'hidden'}`}>
          <div className="absolute inset-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeDetails}
            ></div>
            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <div className="relative w-screen max-w-4xl">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="flex-1 py-6 overflow-y-auto">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Teacher Details</h2>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={closeDetails}
                          >
                            <span className="sr-only">Close panel</span>
                            <svg
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 px-4 sm:px-6">
                      <TeacherDetails teacher={selectedTeacher} />
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={closeDetails}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
