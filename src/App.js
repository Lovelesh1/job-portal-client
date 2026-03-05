import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import Profile from "./pages/Profile";
import ApplicantProfile from "./pages/ApplicantProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterApplications from "./pages/RecruiterApplications";
import RecruiterJobs from "./pages/RecruiterJobs";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRecruiters from "./pages/AdminRecruiters";
import AdminJobs from "./pages/AdminJobs";
import PrivateRoute from "./components/PrivateRoute";
import DashboardLayout from "./components/DashboardLayout";
import AdminLayout from "./components/AdminLayout";

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Jobseeker */}
        <Route path="/jobs" element={<PrivateRoute role="jobseeker"><Jobs /></PrivateRoute>} />
        <Route path="/my-applications" element={<PrivateRoute role="jobseeker"><MyApplications /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

        {/* Recruiter */}
        <Route path="/recruiter-dashboard" element={<PrivateRoute role="recruiter"><DashboardLayout /></PrivateRoute>}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="jobs" element={<RecruiterJobs />} />
          <Route path="applications" element={<RecruiterApplications />} />
          <Route path="create-job" element={<CreateJob />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/admin-dashboard" element={<PrivateRoute role="admin"><AdminLayout /></PrivateRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="recruiters" element={<AdminRecruiters />} />
          <Route path="jobs" element={<AdminJobs />} />
        </Route>

        <Route path="/edit-job/:id" element={<PrivateRoute role="recruiter"><EditJob /></PrivateRoute>} />
        <Route path="/applicant/:id" element={<PrivateRoute role="recruiter"><ApplicantProfile /></PrivateRoute>} />

        <Route path="*" element={<h2>404 Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;