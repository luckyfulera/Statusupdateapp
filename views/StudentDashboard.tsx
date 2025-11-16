

import React, { useState, useMemo } from 'react';
import { Student, Teacher, TeacherStatus } from '../types';
import Card from '../components/Card';
import ProfileEditor from '../components/ProfileEditor';
import IDCard from '../components/IDCard';
import Announcements from '../components/Announcements';
import TeacherProfileModal from '../components/TeacherProfileModal';

interface StatusIndicatorProps {
  status: TeacherStatus;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const statusStyles: { [key in TeacherStatus]: { bg: string, text: string, dot: string } } = {
    [TeacherStatus.AVAILABLE]: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    [TeacherStatus.IN_CLASS]: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    [TeacherStatus.ON_BREAK]: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    [TeacherStatus.ON_HOLIDAY]: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
    [TeacherStatus.UNAVAILABLE]: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  };
  
  const style = statusStyles[status] || statusStyles[TeacherStatus.UNAVAILABLE];

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${style.dot}`}></span>
      {status}
    </div>
  );
};

interface TeacherCardProps {
  teacher: Teacher;
}

const TeacherCard: React.FC<TeacherCardProps & { onClick: () => void }> = ({ teacher, onClick }) => (
    <Card className="hover:shadow-xl transition-shadow duration-300 border border-gray-200 cursor-pointer" onClick={onClick}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900">{teacher.fullName}</h3>
                <p className="text-md text-indigo-600 font-medium">{teacher.designation}</p>
            </div>
            <div className="mt-4 sm:mt-0">
                <StatusIndicator status={teacher.status} />
            </div>
        </div>
        {teacher.status === TeacherStatus.AVAILABLE && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                <div><span className="font-semibold">Staff Room:</span> {teacher.staffRoom}</div>
                <div><span className="font-semibold">Seat:</span> {teacher.seatNo}</div>
                <div><span className="font-semibold">Floor:</span> {teacher.floor}</div>
            </div>
        )}
    </Card>
);

interface StudentDashboardProps {
  user: Student;
  teachers: Teacher[];
  onLogout: () => void;
  onProfileUpdate: (updatedUser: Student) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, teachers, onLogout, onProfileUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = useMemo(() =>
    teachers.filter(teacher =>
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [teachers, searchTerm]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {selectedTeacher && (
        <TeacherProfileModal
          teacher={selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
        />
      )}
      
      {isEditingProfile && (
        <ProfileEditor
          user={user}
          onSave={(updatedUser) => {
            onProfileUpdate(updatedUser as Student);
            setIsEditingProfile(false);
          }}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
      
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
              alt={user.fullName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
              <p className="text-white/90">Welcome, {user.fullName}!</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowIDCard(!showIDCard)}
              className="bg-white/20 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              {showIDCard ? 'Hide' : 'View'} ID Card
            </button>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="bg-white/20 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg hover:bg-white/30 transition-all border border-white/30"
            >
              Edit Profile
            </button>
            <button
              onClick={onLogout}
              className="bg-white text-indigo-600 font-bold py-2 px-4 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* ID Card Section */}
        {showIDCard && (
          <div className="mb-8">
            <IDCard user={user} />
          </div>
        )}

        {/* Profile Section */}
        {!showIDCard && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">My Profile</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold text-gray-600">Student ID:</span> <span className="text-gray-900">{user.studentId}</span></div>
                  <div><span className="font-semibold text-gray-600">Course:</span> <span className="text-gray-900">{user.course}</span></div>
                  <div><span className="font-semibold text-gray-600">Section:</span> <span className="text-gray-900">{user.section}</span></div>
                  <div><span className="font-semibold text-gray-600">Year:</span> <span className="text-gray-900">{user.year}</span></div>
                  <div><span className="font-semibold text-gray-600">Email:</span> <span className="text-gray-900">{user.email || 'N/A'}</span></div>
                  <div><span className="font-semibold text-gray-600">Phone:</span> <span className="text-gray-900">{user.phone}</span></div>
                </div>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Announcements />
            </div>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Find a Teacher</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, designation, department, or ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
               <svg className="w-6 h-6 text-gray-400 absolute top-1/2 left-4 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="space-y-6">
              {filteredTeachers.length > 0 ? (
                  filteredTeachers.map(teacher => <TeacherCard key={teacher.teacherId} teacher={teacher} onClick={() => setSelectedTeacher(teacher)} />)
              ) : (
                  <Card className="text-center">
                      <p className="text-gray-500">No teachers found matching your search.</p>
                  </Card>
              )}
          </div>
        </>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
