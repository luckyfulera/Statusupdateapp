import React, { useState } from 'react';
import { Student, Teacher, UserRole } from '../types';
import Card from '../components/Card';
import ProfileEditor from '../components/ProfileEditor';
import IDCard from '../components/IDCard';

interface ProfilePageProps {
  user: Student | Teacher;
  onProfileUpdate: (updatedUser: Student | Teacher) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showIDCard, setShowIDCard] = useState(false);

  const isStudent = user.role === UserRole.STUDENT;
  const student = isStudent ? (user as Student) : null;
  const teacher = !isStudent ? (user as Teacher) : null;

  return (
    <div className="space-y-6">
      {isEditing && (
        <ProfileEditor
          user={user}
          onSave={(updatedUser) => {
            onProfileUpdate(updatedUser);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowIDCard(!showIDCard)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            {showIDCard ? 'Hide' : 'View'} ID Card
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* ID Card View */}
      {showIDCard ? (
        <IDCard user={user} />
      ) : (
        <>
          {/* Profile Header Card */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
                alt={user.fullName}
                className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
              />
              <div className="text-center md:text-left flex-1">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{user.fullName}</h3>
                <p className="text-xl text-indigo-600 font-semibold mb-2">
                  {isStudent ? student?.course : teacher?.designation}
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {isStudent ? `Student ID: ${student?.studentId}` : `Teacher ID: ${teacher?.teacherId}`}
                  </span>
                  {isStudent && (
                    <>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        Year {student?.year}
                      </span>
                      <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                        Section {student?.section}
                      </span>
                    </>
                  )}
                  {teacher && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {teacher.department} Department
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Email" value={user.email || 'Not provided'} />
              <InfoItem label="Phone" value={user.phone} />
              <InfoItem label="Date of Birth" value={user.dateOfBirth || 'Not provided'} />
              <InfoItem label="Address" value={user.address || 'Not provided'} />
            </div>
          </Card>

          {/* Student Specific Information */}
          {isStudent && student && (
            <>
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Academic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoItem label="Course" value={student.course} />
                  <InfoItem label="Section" value={student.section} />
                  <InfoItem label="Year" value={student.year.toString()} />
                  {student.semester && <InfoItem label="Semester" value={student.semester.toString()} />}
                  {student.branch && <InfoItem label="Branch" value={student.branch} />}
                  {student.specialization && <InfoItem label="Specialization" value={student.specialization} />}
                  {student.college && <InfoItem label="College" value={student.college} />}
                  {student.enrollNo && <InfoItem label="Enrollment No" value={student.enrollNo} />}
                  {student.universityRollNo && <InfoItem label="University Roll No" value={student.universityRollNo} />}
                </div>
              </Card>

              {student.fatherName || student.motherName ? (
                <Card>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Family Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {student.fatherName && <InfoItem label="Father's Name" value={student.fatherName} />}
                    {student.motherName && <InfoItem label="Mother's Name" value={student.motherName} />}
                  </div>
                </Card>
              ) : null}
            </>
          )}

          {/* Teacher Specific Information */}
          {teacher && (
            <>
              <Card>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <InfoItem label="Designation" value={teacher.designation} />
                  <InfoItem label="Department" value={teacher.department || 'Not specified'} />
                  <InfoItem label="Qualification" value={teacher.qualification || 'Not specified'} />
                  <InfoItem label="Experience" value={`${teacher.experience || 0} years`} />
                  <InfoItem label="Joining Date" value={teacher.joiningDate || 'Not specified'} />
                  <InfoItem label="Staff Room" value={teacher.staffRoom} />
                  <InfoItem label="Seat No" value={teacher.seatNo} />
                  <InfoItem label="Floor" value={teacher.floor} />
                  {teacher.officeHours && <InfoItem label="Office Hours" value={teacher.officeHours} />}
                </div>
              </Card>

              {teacher.subjects && teacher.subjects.length > 0 && (
                <Card>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Subjects Teaching</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                        {subject}
                      </span>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
    <p className="text-lg font-semibold text-gray-900">{value}</p>
  </div>
);

export default ProfilePage;
