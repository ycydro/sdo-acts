import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import ClientLayout from "../layouts/ClientLayout";

// Auth Pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

// Guard Routes
import ProtectedRoute from "./guards/ProtectedRoute";
import PermissionRoute from "./guards/PermissionRoute";

// Public Pages
import NotFoundPage from "../pages/NotFoundPage";
import Test from "../pages/Test";

// Admin/Staff Pages
import MainDashboardPage from "../pages/Main/MainDashboard/MainDashboardPage";
import DepartmentsPage from "../pages/Main/Departments/DepartmentsPage";
import TicketsPage from "../pages/Main/Tickets/TicketsPage";

// Client Pages
import ClientDashboardPage from "../pages/Client/ClientDashboard/ClientDashboardPage";
import ServicesPage from "../pages/Main/Services/ServicesPage";

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
          path="services"
          element={
            <PermissionRoute requiredPermission="view_main">
              <ServicesPage />
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
        {/* SPECIFIC DEPARTMENT TICKETS (e.g. tickets for HR dept) */}
        <Route
          path="tickets/:department_id"
          element={
            <PermissionRoute requiredPermission="view_main">
              <TicketsPage />
            </PermissionRoute>
          }
        />
      </Route>

      {/* CLIENT ROUTES */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        {/* Automatically routes to /test */}
        <Route path="" element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<ClientDashboardPage />} />
      </Route>

      {/* -------- CATCH-ALL -------- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
