import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const stored = sessionStorage.getItem("quickmeds_vendor_token");
  const parsed = stored ? JSON.parse(stored) : null;
  if (!parsed?.token)               return <Navigate to="/login" replace />;
  if (parsed.role !== "pharmacist") return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;