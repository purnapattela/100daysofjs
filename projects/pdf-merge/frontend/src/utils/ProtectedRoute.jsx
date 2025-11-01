import { Navigate } from "react-router";

const user = true;

export function ProtectedRoute({ children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
