// components/ProtectedRoute.jsx
import { useApp } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, isAdmin } = useApp();

  if (!user) return <Navigate to="/login" />;         
  if (role && !isAdmin()) return <Navigate to="/" />;  

  return children;  
};

export default ProtectedRoute;