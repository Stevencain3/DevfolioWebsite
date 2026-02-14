import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Protect admin routes - redirect to login if not authenticated
export default function ProtectedRoute({ children }) {
  const admin = useSelector((state) => state.auth.admin);

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
