import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import SiteLayout from "@/components/site/SiteLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Tests from "@/pages/Tests";
import Packages from "@/pages/Packages";
import Gallery from "@/pages/Gallery";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Faqs from "@/pages/Faqs";
import Appointment from "@/pages/Appointment";
import HomeCollection from "@/pages/HomeCollection";
import ReportDownload from "@/pages/ReportDownload";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Appointments from "@/pages/admin/Appointments";
import ContentAdmin from "@/pages/admin/ContentAdmin";
import GalleryAdmin from "@/pages/admin/GalleryAdmin";
import CollectionManager from "@/pages/admin/CollectionManager";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;
    if (!user) return <Navigate to="/admin/login" replace />;
    return children;
};

function App() {
    return (
        <div className="App">
            <ThemeProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route element={<SiteLayout />}>
                                <Route path="/" element={<Home />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/tests" element={<Tests />} />
                                <Route path="/packages" element={<Packages />} />
                                <Route path="/gallery" element={<Gallery />} />
                                <Route path="/blog" element={<Blog />} />
                                <Route path="/blog/:slug" element={<BlogPost />} />
                                <Route path="/faqs" element={<Faqs />} />
                                <Route path="/appointment" element={<Appointment />} />
                                <Route path="/home-collection" element={<HomeCollection />} />
                                <Route path="/report" element={<ReportDownload />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/privacy" element={<Legal type="privacy" />} />
                                <Route path="/terms" element={<Legal type="terms" />} />
                                <Route path="/refund" element={<Legal type="refund" />} />
                            </Route>

                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                                <Route index element={<Dashboard />} />
                                <Route path="appointments" element={<Appointments />} />
                                <Route path="content" element={<ContentAdmin />} />
                                <Route path="gallery" element={<GalleryAdmin />} />
                                <Route path="manage/:collection" element={<CollectionManager />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </BrowserRouter>
                    <Toaster position="top-right" richColors />
                </AuthProvider>
            </ThemeProvider>
        </div>
    );
}

export default App;
