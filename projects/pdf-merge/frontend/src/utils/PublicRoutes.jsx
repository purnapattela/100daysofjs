import { Navigate } from "react-router";

const user = false;

export function PublicRoute({ children }) {
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}
