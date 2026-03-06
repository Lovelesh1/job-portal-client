import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function MyApplications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const res = await API.get("/applications/my");
      setApps(res.data);
    };
    fetchApps();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 
            className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition"
            onClick={() => navigate('/jobs')}
          >
            Job Portal
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Profile
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Browse Jobs
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h2>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>

        {apps.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
            <p className="text-gray-500">Start applying to jobs to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.filter(app => app.job).map((app) => (
              <div key={app._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{app.job.title}</h3>
                  <p className="text-blue-100 text-lg font-medium">{app.job.company}</p>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Application Status</span>
                    <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${
                      app.status === "accepted" 
                        ? "bg-green-100 text-green-800" 
                        : app.status === "rejected" 
                        ? "bg-red-100 text-red-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {app.status === "accepted" && (
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {app.status === "rejected" && (
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      {!app.status || app.status === "Pending" ? (
                        <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : null}
                      {app.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default MyApplications;