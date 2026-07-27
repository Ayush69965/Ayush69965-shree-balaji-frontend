import { Outlet } from "react-router-dom";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import FloatingButtons from "@/components/site/FloatingButtons";

export default function SiteLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <FloatingButtons />
        </div>
    );
}
