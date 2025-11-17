// Main React application component
// Manages global state, user authentication, and renders the appropriate views
// Handles login/logout, profile updates, status updates, and timetable management

import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, Teacher, Student, TeacherStatus, TimetableData } from './types';
import { MOCK_TEACHERS, MOCK_STUDENTS } from './constants';
import Login from './views/Login';
import DashboardLayout from './pages/DashboardLayout';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading application...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Current authenticated user state - persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Teachers data state - loaded from constants and persisted in localStorage
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Students data state - loaded from constants and persisted in localStorage
  const [students, setStudents] = useState<Student[]>([]);

  // Error state for handling login/signup errors
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Load user data
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
        
        // Always load fresh teachers data from MOCK_TEACHERS to ensure new teachers are available
        setTeachers([...MOCK_TEACHERS]);
        
        // Always load fresh students data from MOCK_STUDENTS
        setStudents([...MOCK_STUDENTS]);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load application data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Persist current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Persist teachers data to localStorage whenever it changes
  useEffect(() => {
    if (teachers.length > 0) {
      localStorage.setItem('teachers', JSON.stringify(teachers));
    }
  }, [teachers]);

  // Persist students data to localStorage whenever it changes
  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  // Handle user login
  const handleLogin = useCallback((email: string, password: string) => {
    try {
      setError(null);
      
      // Simulate API call
      setTimeout(() => {
        // Find user by email (case-insensitive)
        const user = [...MOCK_TEACHERS, ...MOCK_STUDENTS].find(
          u => u.email?.toLowerCase() === email.toLowerCase()
        );

        if (user && password === 'password') { // In a real app, validate the password securely
          setCurrentUser(user);
        } else {
          setError('Invalid email or password');
        }
      }, 500);
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    }
  }, []);

  // Handle user signup
  const handleSignup = useCallback((userData: any): boolean => {
    try {
      setError(null);

      // Check if user already exists
      const existingUser = [...students, ...teachers].find(u =>
        u.role === UserRole.STUDENT
          ? (u as Student).studentId === userData.studentId
          : (u as Teacher).teacherId === userData.teacherId
      );

      if (existingUser) {
        setError('User already exists with this ID.');
        return false;
      }

      if (userData.role === UserRole.STUDENT) {
        const newStudent: Student = {
          studentId: userData.studentId,
          fullName: userData.fullName,
          phone: userData.phone,
          email: userData.email,
          course: userData.course,
          section: userData.section,
          year: parseInt(userData.year, 10),
          role: UserRole.STUDENT,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName}`,
        };
        setStudents(prev => [...prev, newStudent]);
        setCurrentUser(newStudent);
        return true;
      } else {
        const newTeacher: Teacher = {
          teacherId: userData.teacherId,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          designation: userData.designation,
          department: userData.department,
          qualification: userData.qualification,
          experience: parseInt(userData.experience, 10),
          joiningDate: userData.joiningDate,
          subjects: [],
          education: [],
          bio: userData.bio,
          specializations: [],
          officeHours: userData.officeHours,
          achievements: [],
          staffRoom: userData.staffRoom,
          seatNo: userData.seatNo,
          floor: userData.floor,
          status: TeacherStatus.AVAILABLE,
          role: UserRole.TEACHER,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName}`,
        };
        setTeachers(prev => [...prev, newTeacher]);
        setCurrentUser(newTeacher);
        return true;
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup. Please try again.');
      return false;
    }
  }, [students, teachers]);

  // Handle user logout
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setError(null);
  }, []);

  // Handle profile updates
  const handleProfileUpdate = useCallback((updatedUser: Student | Teacher) => {
    if (updatedUser.role === UserRole.STUDENT) {
      setStudents(prevStudents =>
        prevStudents.map(s =>
          s.studentId === (updatedUser as Student).studentId ? updatedUser as Student : s
        )
      );
    } else {
      setTeachers(prevTeachers =>
        prevTeachers.map(t =>
          t.teacherId === (updatedUser as Teacher).teacherId ? updatedUser as Teacher : t
        )
      );
    }
    setCurrentUser(updatedUser);
  }, []);

  // Handle status updates for teachers
  const handleStatusUpdate = useCallback((teacherId: string, newStatus: TeacherStatus) => {
    setTeachers(prevTeachers =>
      prevTeachers.map(t =>
        t.teacherId === teacherId ? { ...t, status: newStatus } : t
      )
    );

    // Update current user if it's the same teacher
    if (currentUser && 'teacherId' in currentUser && currentUser.teacherId === teacherId) {
      setCurrentUser(prev => prev ? { ...prev, status: newStatus } : null);
    }
  }, [currentUser]);

  // Handle timetable updates for teachers
  const handleTimetableUpdate = useCallback((teacherId: string, timetable: TimetableData) => {
    setTeachers(prevTeachers =>
      prevTeachers.map(t =>
        t.teacherId === teacherId
          ? { ...t, timetable }
          : t
      )
    );

    // Update current user if it's the same teacher
    if (currentUser && 'teacherId' in currentUser && currentUser.teacherId === teacherId) {
      setCurrentUser(prev => prev ? { ...prev, timetable } : null);
    }
  }, [currentUser]);

  // Show loading state while data is being loaded
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Main render - shows dashboard if authenticated, login page if not
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {currentUser ? (
        <DashboardLayout
          user={currentUser}
          teachers={teachers}
          onLogout={handleLogout}
          onProfileUpdate={handleProfileUpdate}
          onStatusUpdate={handleStatusUpdate}
          onTimetableUpdate={handleTimetableUpdate}
        />
      ) : (
        <Login onLogin={handleLogin} onSignup={handleSignup} error={error} clearError={() => setError(null)} />
      )}
    </div>
  );
};

export default App;
