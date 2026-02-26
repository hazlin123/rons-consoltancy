import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "@rons/utils";
import { ThemeProvider } from "./components/theme-provider";

// Layouts
import { AdminLayout } from "./components/layout/AdminLayout";

// Pages
import Dashboard from "./pages/admin/Dashboard";
import StudentRegistration from "./pages/admin/StudentRegistration";
import ClientList from "./pages/admin/ClientList";
import ClientRegistration from "./pages/admin/ClientRegistration";
import ClientProfile from "./pages/admin/ClientProfile";
import IELTSManagement from "./pages/admin/IELTSManagement";
import SchoolApps from "./pages/admin/SchoolApps";
import SchoolsManagement from "@/pages/admin/SchoolsManagement"; // Institution management page
import VisaProcessing from "./pages/admin/VisaProcessing";
import ApplyToSchool from "./pages/admin/ApplyToSchool";
import VisaProcessingForm from "./pages/admin/VisaProcessingForm";
import IELTSRegistrationForm from "./pages/admin/IELTSRegistrationForm";
import ClientEdit from "./pages/admin/ClientEdit";
import Login from "./pages/auth/Login";
import { RequireAuth } from "./components/auth/RequireAuth";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ThemeProvider defaultTheme="dark" storageKey="portal-theme">
                    <Routes>
                        <Route path="/" element={<Login />} />

                        <Route element={<RequireAuth />}>
                            <Route path="/admin" element={<AdminLayout />}>
                                <Route index element={<Navigate to="dashboard" replace />} />
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="register" element={<StudentRegistration />} />
                                <Route path="clients" element={<ClientList />} />
                                <Route path="clients/new" element={<ClientRegistration />} />
                                <Route path="clients/:id" element={<ClientProfile />} />
                                <Route path="clients/:id/edit" element={<ClientEdit />} />
                                <Route path="ielts" element={<IELTSManagement />} />
                                <Route path="institutions" element={<SchoolsManagement />} />
                                <Route path="school-apps" element={<SchoolApps />} />
                                <Route path="clients/:id/apply" element={<ApplyToSchool />} />
                                <Route path="clients/:id/visa" element={<VisaProcessingForm />} />
                                <Route path="clients/:id/ielts" element={<IELTSRegistrationForm />} />
                                <Route path="visa" element={<VisaProcessing />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </ThemeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
