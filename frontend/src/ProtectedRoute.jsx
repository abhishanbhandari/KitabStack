import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  return localStorage.getItem("access") ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
