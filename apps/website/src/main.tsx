import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "@rons/utils";
import { HelmetProvider } from "react-helmet-async"; // Added HelmetProvider import

// Layouts
import { PublicLayout } from "./components/layout/PublicLayout";
import { PageTracker } from "./components/layout/PageTracker";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const rootEl = document.getElementById("root");

if (!rootEl) {
    throw new Error("Root element with id 'root' not found");
}

const root = createRoot(rootEl);

root.render(
    <React.StrictMode>
        <HelmetProvider>
            <AuthProvider>
                <BrowserRouter>
                    <PageTracker />
                    <Routes>
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Index />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </HelmetProvider>
    </React.StrictMode>
);
