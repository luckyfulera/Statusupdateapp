import React, { useState, useMemo } from 'react';
import { Student, Teacher, UserRole, TeacherStatus, TimetableData } from '../types';
import ProfilePage from './ProfilePage';
import Timetable from '../components/Timetable';
import HolidaysCalendar from '../components/HolidaysCalendar';
import Announcements from '../components/Announcements';
import Statistics from '../components/Statistics';
import Card from '../components/Card';
import TeacherProfileModal from '../components/TeacherProfileModal';
import SettingsPage from './SettingsPage';
import QuickStatusWidget from '../components/QuickStatusWidget';
import NotificationCenter from '../components/NotificationCenter';
import SearchHistory, { addToSearchHistory } from '../components/SearchHistory';
import TimetableEditor from '../components/TimetableEditor';
import TimetableViewer from '../components/TimetableViewer';

type PageType = 'home' | 'profile' | 'timetable' | 'holidays' | 'settings';

interface DashboardLayoutProps {
  user: Student | Teacher;
  teachers?: Teacher[];
  students?: Student[];
  onLogout: () => void;
  onProfileUpdate: (updatedUser: Student | Teacher) => void;
  onStatusUpdate?: (teacherId: string, newStatus: TeacherStatus) => void;
  onTimetableUpdate?: (teacherId: string, timetable: TimetableData) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  teachers = [],
  onLogout,
  onProfileUpdate,
  onStatusUpdate = () => {},
  onTimetableUpdate = () => {},
}) => {
  // Show loading state if user data is not available yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isStudent = user.role === UserRole.STUDENT;

  // Filter teachers based on search term
  const filteredTeachers = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return teachers.filter(teacher =>
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teachers, searchTerm]);

  const navItems = isStudent
    ? [
        { id: 'home' as PageType, label: 'Home' },
        { id: 'profile' as PageType, label: 'My Profile' },
        { id: 'timetable' as PageType, label: 'My Timetable' },
        { id: 'holidays' as PageType, label: 'Holidays' },
        { id: 'settings' as PageType, label: 'Settings' },
      ]
    : [
        { id: 'home' as PageType, label: 'Home' },
        { id: 'profile' as PageType, label: 'My Profile' },
        { id: 'timetable' as PageType, label: 'My Timetable' },
        { id: 'holidays' as PageType, label: 'Holidays' },
        { id: 'settings' as PageType, label: 'Settings' },
      ];

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <ProfilePage user={user} onProfileUpdate={onProfileUpdate} />;
      case 'timetable':
        if (isStudent) {
          return <Timetable userRole={UserRole.STUDENT} />;
        } else {
          // For teachers, show timetable editor
          return (
            <TimetableEditor
              teacher={user as Teacher}
              onSave={(timetable) => {
                if (onTimetableUpdate) {
                  onTimetableUpdate(user.teacherId || '', timetable);
                }
              }}
            />
          );
        }
      case 'holidays':
        return <HolidaysCalendar />;
      case 'settings':
        return <SettingsPage user={user} />;
      case 'home':
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => {
    if (isStudent) {
      return (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="mb-6">
                <h3 className="text-2xl font-bold mb-4">Quick Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Student ID</p>
                    <p className="text-xl font-bold text-gray-900">{(user as Student).studentId}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Course</p>
                    <p className="text-xl font-bold text-gray-900">{(user as Student).course}</p>
                  </div>
                </div>
              </Card>

              {/* Find Teachers Section */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <h3 className="text-2xl font-bold mb-4">Find a Teacher</h3>
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search by name, designation, department, or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Search Results */}
                {searchTerm.trim() && (
                  <div className="space-y-3">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map(teacher => (
                        <div
                          key={teacher.teacherId}
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            addToSearchHistory(teacher);
                          }}
                          className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all cursor-pointer border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={teacher.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.fullName}`}
                              alt={teacher.fullName}
                              className="w-10 h-10 rounded-full"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{teacher.fullName}</p>
                              <p className="text-xs text-gray-600">{teacher.designation}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              teacher.status === 'Available in Staff Room' ? 'bg-green-500' :
                              teacher.status === 'In a Class' ? 'bg-blue-500' :
                              teacher.status === 'On a Break' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></span>
                            <span className="text-xs text-gray-500">{teacher.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-4">No teachers found matching your search.</p>
                    )}
                  </div>
                )}
              </Card>

              <SearchHistory onTeacherSelect={(teacher) => {
                setSelectedTeacher(teacher);
                addToSearchHistory(teacher);
              }} />
              <NotificationCenter />
            </div>
            <div className="lg:col-span-1">
              <Announcements />
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          {onStatusUpdate && (
            <QuickStatusWidget 
              teacher={user as Teacher} 
              onStatusUpdate={onStatusUpdate} 
            />
          )}
          <Statistics />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NotificationCenter />
            <Announcements />
          </div>
        </div>
      );
    }
  };

  console.log('Selected Teacher:', selectedTeacher);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Teacher Profile Modal */}
      {selectedTeacher && (
        <TeacherProfileModal
          teacher={selectedTeacher}
          onClose={() => {
            console.log('Closing modal');
            setSelectedTeacher(null);
          }}
        />
      )}
      
      {/* Header */}
      <header className={`${isStudent ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} shadow-lg`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                alt={user.fullName}
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {isStudent ? 'Student Portal' : 'Teacher Portal'}
                </h1>
                <p className="text-white/90">{user.fullName}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-white text-indigo-600 font-bold py-2 px-6 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  currentPage === item.id
                    ? 'border-b-4 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default DashboardLayout;
