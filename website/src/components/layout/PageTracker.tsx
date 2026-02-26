import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export const PageTracker = () => {
    const location = useLocation();
    const lastPathRef = useRef<string>("");

    useEffect(() => {
        // Only log if path changes
        if (lastPathRef.current === location.pathname) return;
        lastPathRef.current = location.pathname;

        // Get or create session ID
        let sessionId = sessionStorage.getItem("visitor_session_id");
        if (!sessionId) {
            sessionId = typeof crypto.randomUUID === 'function'
                ? crypto.randomUUID()
                : Math.random().toString(36).substring(2) + Date.now().toString(36);
            sessionStorage.setItem("visitor_session_id", sessionId);
        }

        const logPageView = async () => {
            try {
                await supabase.from("website_page_views").insert([{
                    page_path: location.pathname,
                    referrer: document.referrer || null,
                    user_agent: navigator.userAgent,
                    session_id: sessionId
                }]);
            } catch (error) {
                console.warn("Analytics tracking failed:", error);
            }
        };

        logPageView();
    }, [location]);

    return null;
};
