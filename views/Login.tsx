
import React, { useState, FormEvent, useEffect } from 'react';
import { UserRole, TeacherStatus, Teacher, Student, User } from '../types';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

type ActiveTab = 'student' | 'teacher';
type FormMode = 'login' | 'signup';

interface LoginProps {
  onLogin: (id: string, role: UserRole) => boolean;
  onSignup: <T extends User>(newUser: T) => boolean;
  error: string | null;
  clearError: () => void;
}

// Sub-component for student form
const StudentForm: React.FC<{ mode: FormMode, onSubmit: (e: FormEvent<HTMLFormElement>) => void, isSubmitting: boolean }> = ({ mode, onSubmit, isSubmitting }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input label="Student ID" id="studentId" name="studentId" required />
    {mode === 'signup' && (
      <>
        <Input label="Full Name" id="fullName" name="fullName" required />
        <Input label="Email" id="email" name="email" type="email" required />
        <Input label="Phone Number" id="phone" name="phone" type="tel" required />
        <Input label="Course" id="course" name="course" required />
        <Input label="Section" id="section" name="section" required />
        <Input label="Year" id="year" name="year" type="number" required />
      </>
    )}
    <Input label="Password" id="password" name="password" type="password" required />
    <div className="pt-2">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
      </Button>
    </div>
  </form>
);

// Sub-component for teacher form
const TeacherForm: React.FC<{ mode: FormMode, onSubmit: (e: FormEvent<HTMLFormElement>) => void, isSubmitting: boolean }> = ({ mode, onSubmit, isSubmitting }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <Input label="Teacher ID" id="teacherId" name="teacherId" required />
    {mode === 'signup' && (
      <>
        <Input label="Full Name" id="fullName" name="fullName" required />
        <Input label="Email" id="email" name="email" type="email" required />
        <Input label="Phone Number" id="phone" name="phone" type="tel" required />
        <Input label="Designation" id="designation" name="designation" required />
        <Input label="Department" id="department" name="department" required />
        <Input label="Staff Room" id="staffRoom" name="staffRoom" required />
        <Input label="Seat No." id="seatNo" name="seatNo" required />
        <Input label="Floor" id="floor" name="floor" required />
      </>
    )}
    <Input label="Password" id="password" name="password" type="password" required />
    <div className="pt-2">
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
      </Button>
    </div>
  </form>
);

const Login: React.FC<LoginProps> = ({ onLogin, onSignup, error, clearError }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('student');
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, formMode]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    let success = false;
    if (formMode === 'login') {
      const id = activeTab === 'student' ? data.studentId as string : data.teacherId as string;
      const role = activeTab === 'student' ? UserRole.STUDENT : UserRole.TEACHER;
      success = onLogin(id, role);
    } else {
      if (activeTab === 'student') {
        const newStudent: Student = {
          studentId: data.studentId as string,
          fullName: data.fullName as string,
          email: data.email as string,
          phone: data.phone as string,
          course: data.course as string,
          section: data.section as string,
          year: parseInt(data.year as string, 10),
          role: UserRole.STUDENT,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName}`,
        };
        success = onSignup(newStudent);
      } else {
        const newTeacher: Teacher = {
          teacherId: data.teacherId as string,
          fullName: data.fullName as string,
          email: data.email as string,
          phone: data.phone as string,
          designation: data.designation as string,
          department: data.department as string,
          qualification: data.qualification as string,
          experience: parseInt(data.experience as string, 10),
          joiningDate: data.joiningDate as string,
          subjects: [],
          education: [],
          bio: data.bio as string,
          specializations: [],
          officeHours: data.officeHours as string,
          achievements: [],
          staffRoom: data.staffRoom as string,
          seatNo: data.seatNo as string,
          floor: data.floor as string,
          status: TeacherStatus.AVAILABLE,
          role: UserRole.TEACHER,
          profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.fullName}`,
        };
        success = onSignup(newTeacher);
      }
    }

    if (!success) {
      setIsSubmitting(false);
    }
    // On success, App component will switch views, so no need to reset isSubmitting
  };

  const TabButton: React.FC<{ tabName: ActiveTab, label: string }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`w-1/2 py-3 text-sm font-bold transition-colors duration-300 ${activeTab === tabName ? 'border-b-4 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-800'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?w=1920')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
            <div className="bg-white rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">Portal Access</h1>
            <p className="mt-2 text-xl text-white/90 drop-shadow">Sign in or create an account</p>
        </div>
        
        <Card>
          <div className="flex border-b border-gray-200 mb-6">
            <TabButton tabName="student" label="I'm a Student" />
            <TabButton tabName="teacher" label="I'm a Teacher" />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {activeTab === 'student' ? (
            <StudentForm mode={formMode} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          ) : (
            <TeacherForm mode={formMode} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setFormMode(prev => prev === 'login' ? 'signup' : 'login')}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              {formMode === 'login' ? `Don't have an account? Sign Up` : `Already have an account? Login`}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
