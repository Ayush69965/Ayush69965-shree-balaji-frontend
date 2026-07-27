import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    SquaresFour, CalendarCheck, TestTube, Package, Images, Article, Star, Question,
    Tag, UserCircle, Gear, Bell, SignOut, List, X,
} from "@phosphor-icons/react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const NAV = [
    { to: "/admin", label: "Dashboard", icon: SquaresFour, end: true },
    { to: "/admin/appointments", label: "Appointments", icon: CalendarCheck },
    { to: "/admin/manage/tests", label: "Tests", icon: TestTube },
    { to: "/admin/manage/packages", label: "Health Packages", icon: Package },
    { to: "/admin/gallery", label: "Gallery", icon: Images },
    { to: "/admin/manage/blogs", label: "Blogs", icon: Article },
    { to: "/admin/manage/testimonials", label: "Testimonials", icon: Star },
    { to: "/admin/manage/faqs", label: "FAQs", icon: Question },
    { to: "/admin/manage/offers", label: "Offers", icon: Tag },
    { to: "/admin/manage/doctors", label: "Doctors", icon: UserCircle },
    { to: "/admin/content", label: "Content & SEO", icon: Gear },
];

function NotificationBell() {
    const qc = useQueryClient();
    const prevUnread = useRef(0);
    const [open, setOpen] = useState(false);
    const { data } = useQuery({
        queryKey: ["notifications"],
        queryFn: async () => (await api.get("/notifications")).data,
        refetchInterval: 8000,
    });

    useEffect(() => {
        const unread = data?.unread || 0;
        if (unread > prevUnread.current && prevUnread.current !== 0) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain); gain.connect(ctx.destination);
                osc.frequency.value = 880; gain.gain.value = 0.1;
                osc.start(); osc.stop(ctx.currentTime + 0.2);
            } catch (e) {}
            if (window.Notification && Notification.permission === "granted") {
                new Notification("New Booking", { body: data.items?.[0]?.message || "You have a new booking" });
            }
        }
        prevUnread.current = unread;
    }, [data]);

    useEffect(() => {
        if (window.Notification && Notification.permission === "default") Notification.requestPermission();
    }, []);

    const markRead = async () => {
        await api.put("/notifications/read");
        qc.invalidateQueries({ queryKey: ["notifications"] });
    };

    return (
        <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) markRead(); }}>
            <PopoverTrigger asChild>
                <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-secondary transition-colors" data-testid="notification-bell">
                    <Bell size={22} weight="duotone" className="text-foreground" />
                    {data?.unread > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white" data-testid="notification-badge">
                            {data.unread}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                <div className="border-b border-border p-3 font-head font-semibold text-sm">Notifications</div>
                <div className="max-h-80 overflow-y-auto">
                    {(data?.items || []).length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>}
                    {(data?.items || []).map((n) => (
                        <div key={n.id} className="border-b border-border p-3 hover:bg-secondary/40">
                            <div className="text-sm font-medium text-foreground">{n.title}</div>
                            <div className="text-xs text-muted-foreground">{n.message}</div>
                            <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const doLogout = async () => { await logout(); navigate("/admin/login"); };

    const Sidebar = () => (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-2.5 px-5 h-[68px] border-b border-border">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground font-head font-bold text-sm">SB</div>
                <div className="font-head font-bold text-sm text-foreground leading-tight">Shree Balaji<br /><span className="text-xs font-normal text-muted-foreground">Admin Panel</span></div>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                {NAV.map((n) => (
                    <NavLink
                        key={n.to} to={n.to} end={n.end}
                        onClick={() => setMobileOpen(false)}
                        data-testid={`admin-nav-${n.label.toLowerCase().replace(/[^a-z]/g, "")}`}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            }`
                        }
                    >
                        <n.icon size={20} weight="duotone" /> {n.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-3 border-t border-border">
                <button onClick={doLogout} data-testid="admin-logout" className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                    <SignOut size={20} weight="duotone" /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-secondary/30">
            <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-card border-r border-border"><Sidebar /></aside>
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <aside className="relative w-64 bg-card border-r border-border"><Sidebar /></aside>
                </div>
            )}
            <div className="lg:pl-64">
                <header className="sticky top-0 z-40 glass flex h-[68px] items-center justify-between px-4 sm:px-6">
                    <button className="lg:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-secondary" onClick={() => setMobileOpen(true)}><List size={22} /></button>
                    <div className="hidden lg:block font-head font-semibold text-foreground">Welcome back, {user?.name || "Admin"}</div>
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{(user?.name || "A")[0]}</div>
                    </div>
                </header>
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
