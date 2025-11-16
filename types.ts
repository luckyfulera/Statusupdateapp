
// Type definitions for the Teacher & Student Portal application
// Defines the data structures used throughout the application for type safety

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
}

export enum TeacherStatus {
  AVAILABLE = 'Available in Staff Room',
  IN_CLASS = 'In a Class',
  ON_BREAK = 'On a Break',
  ON_HOLIDAY = 'On Holiday',
  UNAVAILABLE = 'Unavailable',
}

// Base interface for common user properties
interface BaseUser {
  fullName: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  email?: string;
  dateOfBirth?: string;
  address?: string;
}

// Student interface extending BaseUser with student-specific properties
export interface Student extends BaseUser {
  studentId: string;
  course: string;
  section: string;
  year: number;
  semester?: number;
  branch?: string;
  specialization?: string;
  fatherName?: string;
  motherName?: string;
  college?: string;
  enrollNo?: string;
  universityRollNo?: string;
  classRollNo?: string;
  highSchoolPercentage?: number;
  intermediatePercentage?: number;
  status?: string;
  role: UserRole.STUDENT;
}

// Teacher interface extending BaseUser with teacher-specific properties
export interface Teacher extends BaseUser {
  teacherId: string;
  designation: string;
  department: string;
  qualification: string;
  experience: number;
  joiningDate: string;
  subjects: string[];
  education: {
    degree: string;
    college: string;
    university: string;
    year: string;
  }[];
  bio: string;
  specializations: string[];
  officeHours: string;
  achievements: {
    title: string;
    description: string;
    year: string;
    issuedBy: string;
  }[];
  staffRoom: string;
  seatNo: string;
  floor: string;
  status: TeacherStatus;
  research?: Array<{
    title: string;
    journal: string;
    year: string;
    link?: string;
    authors?: string[];
  }>;
  projects?: Array<{
    title: string;
    description: string;
    year: string;
    role?: string;
    fundingAgency?: string;
  }>;
  role: UserRole.TEACHER;
  timetable?: TimetableData;
}

// Timetable data structure for weekly schedule management
export interface TimetableData {
  days: string[];
  timeSlots: string[];
  schedule: {
    [day: string]: {
      [timeSlot: string]: {
        subject: string;
        class: string;
        room: string;
      } | null;
    };
  };
}

// Union type for both Student and Teacher
export type User = Student | Teacher;
