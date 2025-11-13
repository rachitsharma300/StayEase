// components/ProtectedRoute.jsx
import { useApp } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAdmin } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;