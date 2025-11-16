// Main React application component
// Manages global state, user authentication, and renders the appropriate views
// Handles login/logout, profile updates, status updates, and timetable management

import React, { useState, useCallback, useEffect } from 'react';
import { User, UserRole, Teacher, Student, TeacherStatus, TimetableData } from './types';
import { MOCK_TEACHERS, MOCK_STUDENTS } from './constants';
import Login from './views/Login';
import DashboardLayout from './pages/DashboardLayout';

const App: React.FC = () => {
  // Current authenticated user state - persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // Teachers data state - loaded from constants and persisted in localStorage
  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem('teachers');
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  });

  // Students data state - loaded from constants and persisted in localStorage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  // Error state for handling login/signup errors
  const [error, setError] = useState<string | null>(null);

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
    localStorage.setItem('teachers', JSON.stringify(teachers));
  }, [teachers]);

  // Persist students data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  // Handle user login - validates credentials and sets current user
  const handleLogin = useCallback((id: string, role: UserRole): boolean => {
    setError(null);
    let user: User | undefined;
    if (role === UserRole.STUDENT) {
      user = students.find(s => s.studentId === id);
    } else {
      user = teachers.find(t => t.teacherId === id);
    }

    if (user) {
      setCurrentUser(user);
      return true;
    }
    setError('Invalid ID. Please try again.');
    return false;
  }, [students, teachers]);

  // Handle user signup - creates new user and adds to appropriate array
  const handleSignup = useCallback((userData: any): boolean => {
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
      return true;
    }
  }, [students, teachers]);

  // Handle user logout - clears current user
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Handle profile updates - updates user data in state
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
    if (currentUser && currentUser.role === UserRole.TEACHER && currentUser.teacherId === teacherId) {
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
    if (currentUser && currentUser.role === UserRole.TEACHER && currentUser.teacherId === teacherId) {
      setCurrentUser(prev => prev ? { ...prev, timetable } : null);
    }
  }, [currentUser]);

  // Render dashboard for authenticated users
  const renderDashboard = () => {
    if (!currentUser) return null;

    return (
      <DashboardLayout
        user={currentUser}
        teachers={teachers}
        onLogout={handleLogout}
        onProfileUpdate={handleProfileUpdate}
        onStatusUpdate={handleStatusUpdate}
        onTimetableUpdate={handleTimetableUpdate}
      />
    );
  };

  // Main render - shows dashboard if authenticated, login page if not
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {currentUser ? (
        renderDashboard()
      ) : (
        <Login onLogin={handleLogin} onSignup={handleSignup} error={error} clearError={() => setError(null)} />
      )}
    </div>
  );
};

export default App;
