import React from 'react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => (
  <div className={`${color} rounded-lg p-6 shadow-lg transform transition-all hover:scale-105`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
        <p className="text-white text-3xl font-bold">{value}</p>
        {trend && <p className="text-white/70 text-xs mt-2">{trend}</p>}
      </div>
      <div className="text-white/80">
        {icon}
      </div>
    </div>
  </div>
);

const Statistics: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Quick Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="245"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="↑ 12% from last semester"
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        
        <StatCard
          title="Classes Today"
          value="4"
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="2 completed, 2 remaining"
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        
        <StatCard
          title="Assignments"
          value="12"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="3 pending review"
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />
        
        <StatCard
          title="Attendance Rate"
          value="94%"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend="↑ 3% this month"
          icon={
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem
            title="Assignment Submitted"
            description="25 students submitted 'Data Structures Project'"
            time="2 hours ago"
          />
          <ActivityItem
            title="Attendance Marked"
            description="Marked attendance for CS-301 class"
            time="4 hours ago"
          />
          <ActivityItem
            title="Grades Updated"
            description="Updated mid-term grades for 45 students"
            time="1 day ago"
          />
        </div>
      </Card>
    </div>
  );
};

const ActivityItem: React.FC<{ title: string; description: string; time: string }> = ({
  title,
  description,
  time,
}) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex-1">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

export default Statistics;
