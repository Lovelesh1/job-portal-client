import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { showError } from "../utils/toast";

function ApplicantProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicantProfile();
  }, [id]);

  const fetchApplicantProfile = async () => {
    try {
      const res = await API.get(`/applicants/${id}`);
      setApplicant(res.data);
    } catch (err) {
      console.error(err);
      showError("Failed to load applicant profile");
    } finally {
      setLoading(false);
    }
  };

  const downloadResume = async () => {
    try {
      const res = await API.get(`/applicants/${id}/resume`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${applicant.name}_resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      showError("Failed to download resume");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-md sm:max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Applicant Not Found</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">The requested applicant profile could not be found.</p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-sm sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm sm:text-base">Back to Applications</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-6 py-8 sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center space-x-4 mb-6 sm:mb-0">
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        {applicant.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 break-words leading-tight">
                      {applicant.name}
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base break-all opacity-90">
                      {applicant.email}
                    </p>
                    {applicant.location && (
                      <div className="flex items-center mt-2 text-blue-100 text-sm">
                        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span className="break-words">{applicant.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {applicant.resumeUrl && (
                  <button
                    onClick={downloadResume}
                    className="w-full sm:w-auto bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 border border-white/30 hover:border-white/50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="font-medium">Download Resume</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10 space-y-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/50">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                      <p className="text-sm sm:text-base text-gray-900 break-all font-medium">{applicant.email}</p>
                    </div>
                  </div>
                  
                  {applicant.phone && (
                    <div className="flex items-start group">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                        <p className="text-sm sm:text-base text-gray-900 font-medium">{applicant.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {applicant.skills && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Skills & Expertise</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-2 bg-white text-blue-700 rounded-xl text-sm font-medium border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {applicant.bio && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">About</h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-green-200/30">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed break-words">{applicant.bio}</p>
                </div>
              </div>
            )}

            {applicant.experience && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Professional Experience</h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200/30">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{applicant.experience}</p>
                </div>
              </div>
            )}

            {applicant.education && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200/50">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Education</h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-orange-200/30">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{applicant.education}</p>
                </div>
              </div>
            )}

            {applicant.applications && applicant.applications.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200/50">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Application History</h3>
                </div>
                <div className="space-y-3">
                  {applicant.applications.map((app, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-indigo-200/30 hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{app.jobTitle}</h4>
                          <p className="text-sm text-gray-600 break-words">{app.company}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800 border border-green-200' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                          'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantProfile;