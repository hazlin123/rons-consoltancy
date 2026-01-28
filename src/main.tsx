import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ui/ProtectedRoute";

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { PortalLayout } from "./components/layout/PortalLayout";

// Public Pages
import Index from "./pages/Index";
import Scholarships from "./pages/Scholarships";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Scholarship from "./pages/Scholarship";
import NotFound from "./pages/NotFound";

// { /* Portal Pages */ }
import StudentDashboard from "./pages/portal/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import StudentManagement from "./pages/admin/Management";
import AdminScholarships from "./pages/admin/Scholarships";
import ScholarshipEdit from "./pages/admin/ScholarshipEdit";
import AdminApplications from "./pages/admin/Applications";
import AdminLogin from "./pages/admin/Login";

const rootEl = document.getElementById("root");
console.log("Mounting application on rootEl:", rootEl);

if (!rootEl) {
  throw new Error("Root element with id 'root' not found");
}

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
}, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, background: "#fff", color: "#000" }}>
          <h2>Something went wrong</h2>
          <pre>{this.state.error?.message}</pre>
          <pre>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

import { ThemeProvider } from "./components/theme-provider"

// ... imports

const root = createRoot(rootEl);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Routes>

              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/scholarships/:id" element={<Scholarship />} />
              </Route>

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Student Portal Routes */}
              <Route path="/portal" element={
                <ProtectedRoute>
                  <PortalLayout />
                </ProtectedRoute>
              }>
                <Route index element={<StudentDashboard />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                {/* Placeholders for portal sections */}
                <Route path="classes" element={<StudentDashboard />} />
                <Route path="assignments" element={<StudentDashboard />} />
                <Route path="tests" element={<StudentDashboard />} />
                <Route path="tuition" element={<StudentDashboard />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="management" element={<StudentManagement />} />
                <Route path="scholarships" element={<AdminScholarships />} />
                <Route path="scholarships/new" element={<ScholarshipEdit />} />
                <Route path="scholarships/:id/edit" element={<ScholarshipEdit />} />
                <Route path="applications" element={<AdminApplications />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />

            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
