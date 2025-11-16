import React from 'react';
import { Teacher, TeacherStatus } from '../types';
import TimetableViewer from './TimetableViewer';

interface TeacherProfileModalProps {
  teacher: Teacher;
  onClose: () => void;
}

const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({ teacher, onClose }) => {
  const getStatusColor = (status: TeacherStatus) => {
    switch (status) {
      case TeacherStatus.AVAILABLE:
        return 'bg-green-500';
      case TeacherStatus.IN_CLASS:
        return 'bg-blue-500';
      case TeacherStatus.ON_BREAK:
        return 'bg-yellow-500';
      case TeacherStatus.ON_HOLIDAY:
        return 'bg-purple-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={teacher.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.fullName}`}
              alt={teacher.fullName}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">{teacher.fullName}</h2>
              <p className="text-xl text-white/90 mb-2">{teacher.designation}</p>
              <p className="text-lg text-white/80">{teacher.department} Department</p>
              <div className="mt-3 flex items-center gap-2 justify-center md:justify-start">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(teacher.status)}`}></span>
                <span className="text-sm font-medium">{teacher.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Bio */}
          {teacher.bio && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                About
              </h3>
              <p className="text-gray-700 leading-relaxed">{teacher.bio}</p>
            </section>
          )}

          {/* Contact & Location Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Email:</span> {teacher.email}</p>
                <p><span className="font-semibold">Phone:</span> {teacher.phone}</p>
                {teacher.officeHours && (
                  <p><span className="font-semibold">Office Hours:</span> {teacher.officeHours}</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Staff Room:</span> {teacher.staffRoom}</p>
                <p><span className="font-semibold">Seat No:</span> {teacher.seatNo}</p>
                <p><span className="font-semibold">Floor:</span> {teacher.floor}</p>
              </div>
            </div>
          </section>

          {/* Professional Details */}
          <section className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">Qualification</p>
                <p className="text-gray-900 font-semibold">{teacher.qualification}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Experience</p>
                <p className="text-gray-900 font-semibold">{teacher.experience} years</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Joining Date</p>
                <p className="text-gray-900 font-semibold">{teacher.joiningDate}</p>
              </div>
            </div>
          </section>

          {/* Education */}
          {teacher.education && teacher.education.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
                Education
              </h3>
              <div className="space-y-3">
                {teacher.education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                    <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-700">{edu.college}</p>
                    <p className="text-gray-600 text-sm">{edu.university} • {edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Subjects Taught */}
          {teacher.subjects && teacher.subjects.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Subjects Taught
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((subject, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Specializations */}
          {teacher.specializations && teacher.specializations.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {teacher.specializations.map((spec, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {teacher.projects && teacher.projects.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Research & Projects
              </h3>
              <div className="space-y-4">
                {teacher.projects.map((project, index) => (
                  <div key={index} className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">{project.title}</h4>
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-gray-700">{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {teacher.achievements && teacher.achievements.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Achievements & Awards
              </h3>
              <ul className="space-y-2">
                {teacher.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-yellow-500 text-xl">🏆</span>
                    <div>
                      <div className="font-medium text-gray-900">{achievement.title}</div>
                      <div className="text-gray-600">{achievement.description}</div>
                      <div className="text-sm text-gray-500">Awarded in {achievement.year} by {achievement.issuedBy}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Timetable */}
          <section>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Weekly Timetable
            </h3>
            <TimetableViewer teacher={teacher} />
          </section>

          {/* Publications - using research data */}
          {teacher.research && teacher.research.length > 0 && (
            <section>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Research Publications
              </h3>
              <ul className="space-y-2">
                {teacher.research.map((research, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-blue-600 font-bold">{index + 1}.</span>
                    <div>
                      <div className="font-medium">{research.title}</div>
                      <div className="text-sm text-gray-600">{research.journal} ({research.year})</div>
                      {research.authors && (
                        <div className="text-sm text-gray-500">Authors: {research.authors.join(', ')}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfileModal;
