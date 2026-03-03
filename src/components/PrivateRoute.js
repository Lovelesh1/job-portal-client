import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;