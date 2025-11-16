import React from 'react';
import { Teacher } from '../types';
import { AcademicCapIcon, BookOpenIcon, ClockIcon, UserGroupIcon, CalendarIcon, BriefcaseIcon, TrophyIcon, DocumentTextIcon } from '@heroicons/react/outline';

interface TeacherDetailsProps {
  teacher: Teacher;
}

const TeacherDetails: React.FC<TeacherDetailsProps> = ({ teacher }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 bg-gray-50">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">
              {teacher.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <h3 className="text-2xl leading-6 font-bold text-gray-900">{teacher.fullName}</h3>
            <p className="mt-1 max-w-2xl text-lg text-gray-500">{teacher.designation}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          {/* Basic Information */}
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
              Department
            </dt>
            <dd className="mt-1 text-sm text-gray-900">{teacher.department || 'Not specified'}</dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-2" />
              Experience
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {teacher.experience ? `${teacher.experience} years` : 'Not specified'}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-2" />
              Qualification
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {teacher.qualification || 'Not specified'}
            </dd>
          </div>

          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
              Joining Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {teacher.joiningDate || 'Not specified'}
            </dd>
          </div>

          {/* Office Information */}
          <div className="sm:col-span-2 border-t border-gray-200 pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
              <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
              Office Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Staff Room</dt>
                <dd className="mt-1 text-sm text-gray-900">{teacher.staffRoom || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Seat Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{teacher.seatNo || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Floor</dt>
                <dd className="mt-1 text-sm text-gray-900">{teacher.floor || 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Office Hours</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {teacher.officeHours || 'Not specified'}
                </dd>
              </div>
            </div>
          </div>

          {/* Subjects */}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <BookOpenIcon className="h-5 w-5 text-blue-500 mr-2" />
                Subjects
              </h4>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {teacher.education && teacher.education.length > 0 && (
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-2" />
                Education
              </h4>
              <div className="space-y-4">
                {teacher.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                    <p className="text-sm text-gray-600">{edu.college}</p>
                    <p className="text-sm text-gray-500">{edu.university} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {teacher.achievements && teacher.achievements.length > 0 && (
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <TrophyIcon className="h-5 w-5 text-blue-500 mr-2" />
                Achievements
              </h4>
              <div className="space-y-4">
                {teacher.achievements.map((achievement, index) => (
                  <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-medium text-yellow-800">{achievement.title}</h5>
                    <p className="text-sm text-yellow-700 mt-1">{achievement.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-xs text-yellow-600">{achievement.year}</span>
                      {achievement.issuedBy && (
                        <span className="text-xs text-yellow-600">Issued by: {achievement.issuedBy}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Research */}
          {teacher.research && teacher.research.length > 0 && (
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                Research & Publications
              </h4>
              <div className="space-y-4">
                {teacher.research.map((research, index) => (
                  <div key={index} className="border-l-4 border-blue-100 pl-4 py-2">
                    <h5 className="font-medium text-gray-900">{research.title}</h5>
                    <p className="text-sm text-gray-600">{research.journal}</p>
                    <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500">
                      <span>{research.year}</span>
                      {research.authors && research.authors.length > 0 && (
                        <span className="mx-2">•</span>
                      )}
                      <span className="text-sm text-gray-500">
                        {research.authors ? research.authors.join(', ') : ''}
                      </span>
                    </div>
                    {research.link && (
                      <a 
                        href={research.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                      >
                        View Publication
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {teacher.projects && teacher.projects.length > 0 && (
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
                Projects
              </h4>
              <div className="space-y-4">
                {teacher.projects.map((project, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900">{project.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.year}
                      </span>
                      {project.role && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {project.role}
                        </span>
                      )}
                      {project.fundingAgency && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {project.fundingAgency}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {teacher.bio && (
            <div className="sm:col-span-2">
              <h4 className="text-lg font-medium text-gray-900 mb-3">About</h4>
              <p className="text-gray-600 whitespace-pre-line">{teacher.bio}</p>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default TeacherDetails;
