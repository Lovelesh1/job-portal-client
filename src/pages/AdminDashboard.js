import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { showError } from "../utils/toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    jobseekers: 0,
    recruiters: 0,
    pendingRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    recentUsers: 0,
    recentJobs: 0
  });
  const [analytics, setAnalytics] = useState({ jobTypes: [], applicationStats: [], topCompanies: [] });
  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Test basic API connectivity first
      console.log("Testing API connectivity...");
      
      // Try to fetch stats first
      let statsData = {
        totalUsers: 0,
        jobseekers: 0,
        recruiters: 0,
        pendingRecruiters: 0,
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        recentUsers: 0,
        recentJobs: 0
      };
      
      let analyticsData = {
        jobTypes: [],
        applicationStats: [],
        topCompanies: []
      };

      try {
        console.log("Fetching dashboard stats...");
        const statsRes = await API.get("/admin/dashboard/stats");
        console.log("Stats response:", statsRes.data);
        statsData = statsRes.data;
      } catch (statsErr) {
        console.error("Stats fetch error:", statsErr.response?.data || statsErr.message);
      }

      try {
        console.log("Fetching analytics...");
        const analyticsRes = await API.get("/admin/analytics");
        console.log("Analytics response:", analyticsRes.data);
        analyticsData = analyticsRes.data;
      } catch (analyticsErr) {
        console.error("Analytics fetch error:", analyticsErr.response?.data || analyticsErr.message);
      }

      setStats(statsData);
      setAnalytics(analyticsData);
      console.log("Dashboard data loaded successfully");
    } catch (err) {
      console.error("Dashboard data error:", err);
      showError("Failed to load some dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600 text-sm sm:text-base">Platform overview and statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">+{stats.recentUsers} this week</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.activeJobs} active</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Applications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                <p className="text-xs text-yellow-600 mt-1">{stats.pendingApplications} pending</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Recruiters</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingRecruiters}</p>
                <p className="text-xs text-gray-500 mt-1">Need approval</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Job Seekers', value: stats.jobseekers, color: '#3B82F6' },
                    { name: 'Recruiters', value: stats.recruiters, color: '#8B5CF6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Job Seekers', value: stats.jobseekers, color: '#3B82F6' },
                    { name: 'Recruiters', value: stats.recruiters, color: '#8B5CF6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Application Status Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.applicationStats && analytics.applicationStats.length > 0 ? analytics.applicationStats : [{ _id: 'No Data', count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Types & Top Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Job Types Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Types Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.jobTypes && analytics.jobTypes.length > 0 ? analytics.jobTypes.map((type, index) => ({
                    name: type._id || 'Not Specified',
                    value: type.count,
                    color: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'][index % 5]
                  })) : [{ name: 'No Data', value: 1, color: '#E5E7EB' }]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(analytics.jobTypes && analytics.jobTypes.length > 0 ? analytics.jobTypes : [{ _id: 'No Data', count: 1 }]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#E5E7EB'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Companies Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topCompanies && analytics.topCompanies.length > 0 ? analytics.topCompanies : [{ _id: 'No Data', count: 0 }]} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="_id" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { name: 'This Week', users: stats.recentUsers, jobs: stats.recentJobs },
              { name: 'Total', users: stats.totalUsers, jobs: stats.totalJobs }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
              <Line type="monotone" dataKey="jobs" stroke="#10B981" strokeWidth={2} name="Jobs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
