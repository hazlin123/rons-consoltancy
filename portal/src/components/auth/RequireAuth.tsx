import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@rons/utils";
import { Spinner } from "@phosphor-icons/react";

export const RequireAuth = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDF8F4]">
                <div className="flex flex-col items-center gap-4">
                    <Spinner weight="duotone" className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-xs font-bold text-[#8a8d98] uppercase tracking-widest">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page, but save the current location they were trying to go to
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
