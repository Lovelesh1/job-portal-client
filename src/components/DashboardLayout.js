import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useState } from "react";
import NotificationBell from "./NotificationBell";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/recruiter-dashboard", icon: "📊" },
    { name: "My Jobs", path: "/recruiter-dashboard/jobs", icon: "💼" },
    { name: "Applications", path: "/recruiter-dashboard/applications", icon: "📄" },
    { name: "Create Job", path: "/recruiter-dashboard/create-job", icon: "➕" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out`}>
        <div className="p-4 sm:p-6 border-b border-gray-700 text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide">🚀 Recruiter Panel</h2>
        </div>
        <nav className="flex-1 p-3 sm:p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/recruiter-dashboard"}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                  isActive ? "bg-blue-600 shadow-lg scale-[1.02]" : "hover:bg-gray-700 hover:scale-[1.01]"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 sm:p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 transition p-3 rounded-xl font-medium shadow-lg text-sm sm:text-base"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <div className="bg-white shadow-md p-4 sm:p-5 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 mr-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-700">
              {menuItems.find((item) => location.pathname.startsWith(item.path))?.name || "Dashboard"}
            </h1>
          </div>
          <NotificationBell />
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 min-h-full">
            <Outlet /> {/* Nested pages render here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;