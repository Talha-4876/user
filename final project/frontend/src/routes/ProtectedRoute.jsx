// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token    = localStorage.getItem("userToken");
  const userInfo = localStorage.getItem("userInfo");

  // Token nahi hai → login pe bhejo
  if (!token || !userInfo) {
    return <Navigate to="/signup" replace />;
  }

  try {
    const user = JSON.parse(userInfo);

    // Role check — admin route pe user aa raha hai
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/" replace />;
    }

    return children;
  } catch {
    return <Navigate to="/signup" replace />;
  }
};

export default ProtectedRoute;

