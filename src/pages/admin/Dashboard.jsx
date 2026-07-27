import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Clock, CheckCircle, House, TestTube, Images, Article, Users } from "@phosphor-icons/react";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const CARDS = [
    { key: "today_appointments", label: "Today's Appointments", icon: CalendarCheck, color: "text-primary bg-secondary" },
    { key: "pending", label: "Pending Requests", icon: Clock, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
    { key: "completed", label: "Completed", icon: CheckCircle, color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
    { key: "today_home_collection", label: "Home Collections Today", icon: House, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
    { key: "total_tests", label: "Total Tests", icon: TestTube, color: "text-violet-600 bg-violet-100 dark:bg-violet-900/30" },
    { key: "gallery_images", label: "Gallery Images", icon: Images, color: "text-pink-600 bg-pink-100 dark:bg-pink-900/30" },
    { key: "blogs", label: "Blogs", icon: Article, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/30" },
    { key: "total_appointments", label: "Total Bookings", icon: Users, color: "text-primary bg-secondary" },
];

export default function Dashboard() {
    const { data, isLoading } = useQuery({ queryKey: ["stats"], queryFn: async () => (await api.get("/admin/stats")).data, refetchInterval: 15000 });
    return (
        <div>
            <h1 className="font-head text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">Overview of your lab's activity.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CARDS.map((c) => (
                    <div key={c.key} className="rounded-2xl border border-border bg-card p-5" data-testid={`stat-${c.key}`}>
                        <div className={`grid h-11 w-11 place-items-center rounded-xl ${c.color}`}><c.icon size={22} weight="duotone" /></div>
                        <div className="mt-4 font-head text-3xl font-bold text-foreground">
                            {isLoading ? <Skeleton className="h-8 w-14" /> : (data?.[c.key] ?? 0)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
