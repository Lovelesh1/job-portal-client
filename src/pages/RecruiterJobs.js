import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/jobs/recruiter")
      .then(res => setJobs(res.data))
      .catch(err => {
        console.error(err);
        showError("Failed to load jobs");
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await API.delete(`/jobs/${id}`);
      setJobs(jobs.filter(job => job._id !== id));
      showSuccess("Job deleted successfully");
    } catch (err) {
      console.log(err);
      showError("Failed to delete job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">My Job Postings</h2>
            <p className="text-gray-600 text-sm sm:text-base">Manage and track your job listings</p>
          </div>
          <button 
            onClick={() => navigate('/recruiter-dashboard/create-job')}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition duration-200 shadow-lg flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Job</span>
          </button>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <svg className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-500 mb-6 text-sm sm:text-base">Start by creating your first job posting</p>
            <button 
              onClick={() => navigate('/recruiter-dashboard/create-job')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition duration-200 text-sm sm:text-base"
            >
              Create Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {jobs.map(job => (
              <div key={job._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">{job.title}</h3>
                  <p className="text-blue-100 text-sm truncate">{job.company}</p>
                </div>
                
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm truncate">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm font-semibold truncate">{job.salary}</span>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                      onClick={() => navigate(`/edit-job/${job._id}`)} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-xs sm:text-sm"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(job._id)} 
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-xs sm:text-sm"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
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
}

export default RecruiterJobs;