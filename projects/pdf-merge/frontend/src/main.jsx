import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { PublicRoute } from "./utils/PublicRoutes";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import MergePdf from "./components/pages/MergePdf";
const router = createBrowserRouter([
  {
    path: "/",
    element: <p>Welcome to PDF Tools - PDF Merge</p>,
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <p>Login Page</p>
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <p>Signup Page</p>
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: "/merge-pdf",
    element: (
      <ProtectedRoute>
        <MergePdf />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);
