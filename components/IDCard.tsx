import React from 'react';
import { Student, Teacher, UserRole } from '../types';

interface IDCardProps {
  user: Student | Teacher;
}

const IDCard: React.FC<IDCardProps> = ({ user }) => {
  const isStudent = user.role === UserRole.STUDENT;
  const student = isStudent ? (user as Student) : null;
  const teacher = !isStudent ? (user as Teacher) : null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white text-center">
        <img
          src={user.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`}
          alt={user.fullName}
          className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white object-cover"
        />
        <h2 className="text-2xl font-bold">{user.fullName}</h2>
        <p className="text-lg">{isStudent ? student?.studentId : teacher?.teacherId}</p>
        {user.email && (
          <p className="text-sm mt-2">
            <span className="inline-block mr-2">✉</span>
            {user.email}
          </p>
        )}
        {user.phone && (
          <p className="text-sm">
            <span className="inline-block mr-2">📞</span>
            {user.phone}
          </p>
        )}
      </div>

      {/* ID Card Section */}
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="font-bold">ID Card</span>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          {isStudent && student ? (
            <>
              {student.fatherName && (
                <DetailRow label="Father Name" value={student.fatherName} />
              )}
              {student.motherName && (
                <DetailRow label="Mother Name" value={student.motherName} />
              )}
              {student.dateOfBirth && (
                <DetailRow label="D.O.B." value={student.dateOfBirth} />
              )}
              {student.email && (
                <DetailRow label="Official Email" value={student.email} />
              )}
              {student.college && (
                <DetailRow label="College" value={student.college} />
              )}
              <DetailRow label="Course" value={student.course} />
              {student.specialization && (
                <DetailRow label="Specialization" value={student.specialization} />
              )}
              {student.semester && (
                <DetailRow label="Year/Sem" value={`${student.year} / ${student.semester}`} />
              )}
              {student.branch && (
                <DetailRow label="Branch" value={student.branch} />
              )}
              <DetailRow label="Section" value={student.section} />
              {student.classRollNo && (
                <DetailRow label="Class Roll No." value={student.classRollNo} />
              )}
              {student.enrollNo && (
                <DetailRow label="Enroll No." value={student.enrollNo} />
              )}
              {student.universityRollNo && (
                <DetailRow label="University Roll No." value={student.universityRollNo} />
              )}
              {student.highSchoolPercentage && (
                <DetailRow label="HighSchool %" value={`${student.highSchoolPercentage}`} />
              )}
              {student.intermediatePercentage && (
                <DetailRow label="Intermediate %" value={`${student.intermediatePercentage}`} />
              )}
              {student.status && (
                <DetailRow label="Status" value={student.status} />
              )}
            </>
          ) : teacher ? (
            <>
              {teacher.dateOfBirth && (
                <DetailRow label="D.O.B." value={teacher.dateOfBirth} />
              )}
              {teacher.email && (
                <DetailRow label="Official Email" value={teacher.email} />
              )}
              <DetailRow label="Designation" value={teacher.designation} />
              {teacher.department && (
                <DetailRow label="Department" value={teacher.department} />
              )}
              {teacher.qualification && (
                <DetailRow label="Qualification" value={teacher.qualification} />
              )}
              {teacher.experience && (
                <DetailRow label="Experience" value={`${teacher.experience} years`} />
              )}
              {teacher.joiningDate && (
                <DetailRow label="Joining Date" value={teacher.joiningDate} />
              )}
              <DetailRow label="Staff Room" value={teacher.staffRoom} />
              <DetailRow label="Seat No." value={teacher.seatNo} />
              <DetailRow label="Floor" value={teacher.floor} />
              {teacher.subjects && teacher.subjects.length > 0 && (
                <DetailRow label="Subjects" value={teacher.subjects.join(', ')} />
              )}
              <DetailRow label="Status" value={teacher.status} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex border-b border-gray-200 py-2">
    <div className="w-1/2 text-gray-600 font-medium text-right pr-4">{label} :</div>
    <div className="w-1/2 text-gray-900 font-semibold">{value}</div>
  </div>
);

export default IDCard;
