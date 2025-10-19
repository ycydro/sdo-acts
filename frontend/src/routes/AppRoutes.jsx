import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Public Pages
import NotFoundPage from "../pages/NotFoundPage";

// Admin/Staff Pages
import Test from "../pages/Test";
import ProtectedRoute from "./guards/ProtectedRoute";
import PermissionRoute from "./guards/PermissionRoute";
import MainDashboardPage from "../pages/MainDashboard/MainDashboardPage";
import DepartmentsPage from "../pages/Departments/DepartmentsPage";
import TicketsPage from "../pages/Tickets/TicketsPage";

// Client Pages

const AppRoutes = () => {
  return (
    <Routes>
      {/* -------- PUBLIC ROUTES -------- */}
      <Route index element={<Navigate to="login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* -------- MAIN SYSTEM ROUTES-------- */}
      <Route
        path="/main"
        element={
          <ProtectedRoute>
            <PermissionRoute requiredPermission="view_main">
              <MainLayout />
            </PermissionRoute>
          </ProtectedRoute>
        }
      >
        {/* Automatically routes to /test */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
        <Route
          path="test"
          element={
            <PermissionRoute requiredPermission="view_main">
              <Test />
            </PermissionRoute>
          }
        />
        <Route path="dashboard" element={<MainDashboardPage />} />
        <Route
          path="departments"
          element={
            <PermissionRoute requiredPermission="view_departments">
              <DepartmentsPage />
            </PermissionRoute>
          }
        />
        <Route
          path="tickets"
          element={
            <PermissionRoute requiredPermission="view_main">
              <TicketsPage />
            </PermissionRoute>
          }
        />
      </Route>

      {/* -------- CATCH-ALL -------- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
