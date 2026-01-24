import { Outlet } from "react-router-dom";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20"> {/* pt-20 to account for fixed header */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};
