import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { showSuccess, showError } from '../utils/toast';

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get('/applications/recruiter');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showError('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await API.put(`/applications/${applicationId}/status`, { status });
      
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status } : app
      ));
      
      showSuccess(`Application ${status} successfully`);
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update application status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Job Applications</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage applications for your job postings</p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 text-sm sm:text-base">Applications will appear here once candidates apply to your jobs</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Mobile Card View */}
            <div className="block sm:hidden">
              {applications.map((app) => (
                <div key={app._id} className="border-b border-gray-200 p-4 hover:bg-gray-50">
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {app.applicant?.name ? app.applicant.name.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{app.applicant?.name || 'No Name'}</div>
                      <div className="text-xs text-gray-500 truncate">{app.job?.title || 'No Job Title'}</div>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      app.status === "accepted" 
                        ? "bg-green-100 text-green-800" 
                        : app.status === "rejected" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => window.location.href = `/applicant/${app.applicant?._id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View Profile
                    </button>
                    {app.status === "Pending" && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateStatus(app._id, "accepted")} 
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateStatus(app._id, "rejected")} 
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Applicant</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Job Position</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs sm:text-sm font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm sm:text-lg">
                              {app.applicant?.name ? app.applicant.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-xs sm:text-sm font-semibold text-gray-900">{app.applicant?.name || 'No Name'}</div>
                            <button
                              onClick={() => window.location.href = `/applicant/${app.applicant?._id}`}
                              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-900">{app.job?.title || 'No Job Title'}</div>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <span className={`inline-flex px-2 py-1 sm:px-3 sm:py-1 text-xs font-semibold rounded-full ${
                          app.status === "accepted" 
                            ? "bg-green-100 text-green-800" 
                            : app.status === "rejected" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        {app.status === "Pending" ? (
                          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                            <button 
                              onClick={() => updateStatus(app._id, "accepted")} 
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-xs sm:text-sm"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span>Accept</span>
                            </button>
                            <button 
                              onClick={() => updateStatus(app._id, "rejected")} 
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-xs sm:text-sm"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span className={`font-semibold text-xs sm:text-sm ${
                            app.status === "accepted" ? "text-green-600" : "text-red-600"
                          }`}>
                            {app.status === "accepted" ? "✓ Accepted" : "✗ Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplications;