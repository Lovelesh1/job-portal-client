import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({ show: false, job: null });
  const [stats, setStats] = useState({ active: 0, closed: 0, total: 0, companies: 0 });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, statusFilter, jobs]);

  const fetchJobs = async () => {
    try {
      console.log("Testing basic admin connectivity...");
      
      // Test basic admin route connectivity (no auth required)
      try {
        const pingRes = await API.get("/admin/ping");
        console.log("Admin ping successful:", pingRes.data);
      } catch (pingErr) {
        console.error("Admin ping failed:", pingErr.response?.data || pingErr.message);
        showError("Admin routes not accessible");
        return;
      }
      
      console.log("Fetching jobs from /admin/jobs...");
      const res = await API.get("/admin/jobs");
      console.log("Jobs API response:", res);
      const jobsData = res.data || [];
      console.log("Jobs data:", jobsData);
      setJobs(jobsData);
      setFilteredJobs(jobsData);
      
      // Calculate stats
      const activeJobs = jobsData.filter(job => job.status === 'active').length;
      const closedJobs = jobsData.filter(job => job.status === 'closed').length;
      const uniqueCompanies = new Set(jobsData.map(job => job.company).filter(Boolean)).size;
      
      setStats({
        active: activeJobs,
        closed: closedJobs,
        total: jobsData.length,
        companies: uniqueCompanies
      });
      console.log("Jobs loaded successfully");
    } catch (err) {
      console.error("Jobs fetch error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      showError("Failed to load jobs");
      setJobs([]);
      setFilteredJobs([]);
      setStats({ active: 0, closed: 0, total: 0, companies: 0 });
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (statusFilter) {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(job =>
        (job.title && job.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.company && job.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.recruiter?.name && job.recruiter.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredJobs(filtered);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/admin/jobs/${deleteModal.job._id}`);
      showSuccess("Job deleted successfully");
      setDeleteModal({ show: false, job: null });
      fetchJobs();
    } catch (err) {
      showError("Failed to delete job");
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
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Job Management</h2>
        <p className="text-gray-600 text-sm sm:text-base">Manage all job postings</p>
      </div>

      {/* Stats Widget */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Closed Jobs</p>
              <p className="text-2xl font-bold text-red-600">{stats.closed}</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-2xl font-bold text-purple-600">{stats.companies}</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v16.01M12 7h.01v.01H12V7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by title, company, or recruiter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          <button
            onClick={() => { setSearchTerm(""); setStatusFilter(""); }}
            className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
          >
            Clear Filters
          </button>
        </div>
        <p className="text-gray-600 text-sm mt-4">
          Showing <span className="font-semibold text-blue-600">{filteredJobs.length}</span> jobs
        </p>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
          <p className="text-gray-500 text-sm sm:text-base">
            {searchTerm || statusFilter ? 'Try adjusting your filters' : 'No jobs posted yet'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Job Title</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Company</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Recruiter</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Posted</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="text-sm font-semibold text-gray-900">{job.title || 'No Title'}</div>
                      <div className="text-xs text-gray-500">{job.location || 'Location not specified'}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">{job.company || 'No Company'}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">{job.recruiter?.name || 'No Recruiter'}</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {job.jobType || "Not specified"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        job.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown'}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setDeleteModal({ show: true, job })}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the job <span className="font-semibold">"{deleteModal.job?.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, job: null })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;