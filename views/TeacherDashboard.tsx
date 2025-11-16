
import React, { useState, useEffect } from 'react';
import { Teacher, TeacherStatus, TimetableData } from '../types';
import Button from '../components/Button';
import Card from '../components/Card';
import ProfileEditor from '../components/ProfileEditor';
import IDCard from '../components/IDCard';
import Statistics from '../components/Statistics';
import Announcements from '../components/Announcements';
import TimetableUploader from '../components/TimetableUploader';
import TimetableViewer from '../components/TimetableViewer';

interface TeacherDashboardProps {
  user: Teacher;
  onStatusUpdate: (teacherId: string, newStatus: TeacherStatus) => void;
  onLogout: () => void;
  onProfileUpdate: (updatedUser: Teacher) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, onStatusUpdate, onLogout, onProfileUpdate }) => {
  const [currentStatus, setCurrentStatus] = useState<TeacherStatus>(user.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);
  const [timetable, setTimetable] = useState<TimetableData | null>(null);
  const [showTimetableUpload, setShowTimetableUpload] = useState(false);

  // Load saved timetable from localStorage on component mount
  useEffect(() => {
    const savedTimetable = localStorage.getItem(`timetable_${user.teacherId}`);
    if (savedTimetable) {
      try {
        setTimetable(JSON.parse(savedTimetable));
      } catch (e) {
        console.error('Failed to load timetable:', e);
      }
    }
  }, [user.teacherId]);

  const handleTimetableUpload = (newTimetable: TimetableData) => {
    setTimetable(newTimetable);
    localStorage.setItem(`timetable_${user.teacherId}`, JSON.stringify(newTimetable));
    setShowTimetableUpload(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value as TeacherStatus);
  };

  const handleUpdateClick = async () => {
    if (currentStatus === user.status) return;
    
    setIsUpdating(true);
    
    // Create a new user object with the updated status
    const updatedUser = {
      ...user,
      status: currentStatus
    };
    
    try {
      // Update the status in the parent component
      await onStatusUpdate(user.teacherId, currentStatus);
      
      // Update the local user state to reflect the change
      onProfileUpdate(updatedUser);
      
      // Force a re-render by updating the local state
      setCurrentStatus(currentStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
      // Revert the status in the UI if the update fails
      setCurrentStatus(user.status);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update local state when user prop changes
  React.useEffect(() => {
    setCurrentStatus(user.status);
  }, [user.status]);

  const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {isEditingProfile && (
        <ProfileEditor
          user={user}
          onSave={(updatedUser) => {
            onProfileUpdate(updatedUser as Teacher);
            setIsEditingProfile(false);
          }}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
      
      <header className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
              alt={user.fullName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Teacher Dashboard</h1>
              <p className="text-white/90">Welcome, {user.fullName}!</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowTimetableUpload(!showTimetableUpload);
                // Scroll to timetable section
                if (!showTimetableUpload) {
                  setTimeout(() => {
                    document.getElementById('timetable-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-3 rounded-lg hover:bg-white/30 transition-all border border-white/30"
              title="Timetable"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Timetable</span>
            </button>
            <button
              onClick={() => setShowIDCard(!showIDCard)}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-3 rounded-lg hover:bg-white/30 transition-all border border-white/30"
              title={showIDCard ? 'Hide ID Card' : 'View ID Card'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">{showIDCard ? 'Hide ID' : 'View ID'}</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white font-medium py-2 px-3 rounded-lg hover:bg-white/30 transition-all border border-white/30"
              title="Edit Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 bg-white text-blue-600 font-medium py-2 px-3 rounded-lg hover:bg-white/90 transition-colors shadow-lg"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* ID Card Section */}
        {showIDCard ? (
          <div className="mb-8">
            <IDCard user={user} />
          </div>
        ) : (
        <>
          {/* Statistics Section */}
          <div className="mb-8">
            <Statistics />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Update Section */}
        <div className="lg:col-span-1">
            <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Your Status</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Current Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={currentStatus}
                            onChange={handleStatusChange}
                            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {Object.values(TeacherStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={handleUpdateClick} disabled={isUpdating || currentStatus === user.status}>
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </Button>
                </div>
            </Card>
        </div>

        {/* Teacher Details Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
              <DetailItem label="Teacher ID" value={user.teacherId} />
              <DetailItem label="Designation" value={user.designation} />
              <DetailItem label="Department" value={user.department || 'N/A'} />
              <DetailItem label="Email" value={user.email || 'N/A'} />
              <DetailItem label="Phone Number" value={user.phone} />
              <DetailItem label="Current Status" value={user.status} />
              <DetailItem label="Staff Room" value={user.staffRoom} />
              <DetailItem label="Seat Number" value={user.seatNo} />
              <DetailItem label="Floor" value={user.floor} />
            </div>
          </Card>

          {/* Timetable Section - Made more prominent */}
          <div id="timetable-section" className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Timetable</h2>
                  <p className="text-gray-600">View and manage your class schedule</p>
                </div>
                <Button 
                  onClick={() => setShowTimetableUpload(!showTimetableUpload)}
                  variant={showTimetableUpload ? "secondary" : "primary"}
                  className="whitespace-nowrap w-full sm:w-auto justify-center"
                >
                  {showTimetableUpload ? 'Cancel' : 'Upload New Timetable'}
                </Button>
              </div>
              
              {showTimetableUpload ? (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <TimetableUploader 
                    teacher={user}
                    onTimetableUpload={handleTimetableUpload} 
                  />
                </div>
              ) : timetable ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <TimetableViewer teacher={user} />
                  </div>
                  <div className="text-sm text-gray-500 text-right">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <svg 
                    className="mx-auto h-12 w-12 text-gray-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No timetable uploaded</h3>
                  <p className="mt-1 text-gray-500">Get started by uploading your timetable.</p>
                  <div className="mt-6">
                    <Button 
                      onClick={() => setShowTimetableUpload(true)}
                      variant="primary"
                      className="inline-flex items-center gap-2"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Upload Timetable
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
          
        {/* Announcements Section */}
        <div className="mt-8 col-span-1 lg:col-span-3">
          <Announcements />
        </div>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default TeacherDashboard;
