import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const AdminRecruiters = () => {
  const [pendingRecruiters, setPendingRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRecruiters();
  }, []);

  const fetchPendingRecruiters = async () => {
    try {
      console.log("Fetching pending recruiters from /admin/recruiters/pending...");
      const res = await API.get("/admin/recruiters/pending");
      console.log("Pending recruiters API response:", res);
      const recruitersData = res.data || [];
      console.log("Pending recruiters data:", recruitersData);
      setPendingRecruiters(recruitersData);
      console.log("Pending recruiters loaded successfully");
    } catch (err) {
      console.error("Pending recruiters fetch error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      showError("Failed to load pending recruiters");
      setPendingRecruiters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/admin/recruiters/${id}/approve`);
      showSuccess("Recruiter approved successfully");
      fetchPendingRecruiters();
    } catch (err) {
      showError("Failed to approve recruiter");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      showSuccess("Recruiter rejected and removed");
      fetchPendingRecruiters();
    } catch (err) {
      showError("Failed to reject recruiter");
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
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Recruiter Approvals</h2>
          <p className="text-gray-600 text-sm sm:text-base">Review and approve pending recruiter accounts</p>
        </div>

        {pendingRecruiters.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">All Caught Up!</h3>
            <p className="text-gray-500">No pending recruiter approvals at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRecruiters.map((recruiter) => (
              <div key={recruiter._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {recruiter.name ? recruiter.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{recruiter.name || 'No Name'}</h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 mt-1">
                        Pending Approval
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{recruiter.email || 'No Email'}</span>
                  </div>

                  {recruiter.phone && (
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-700">{recruiter.phone}</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Registered: {recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>

                  <div className="pt-4 flex space-x-3">
                    <button
                      onClick={() => handleApprove(recruiter._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(recruiter._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecruiters;
