import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const PublicLayout = () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="flex flex-col min-h-screen">
            {!isHome && <Header />}
            <main className={`flex-grow ${!isHome ? 'pt-20' : ''}`}>
                <Outlet />
            </main>
            {!isHome && <Footer />}
        </div>
    );
};
