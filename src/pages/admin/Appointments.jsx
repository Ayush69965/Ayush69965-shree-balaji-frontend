import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MagnifyingGlass, DownloadSimple, Printer, Trash, Eye } from "@phosphor-icons/react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

const STATUSES = ["pending", "accepted", "rejected", "completed"];
const badge = { pending: "bg-amber-100 text-amber-700", accepted: "bg-blue-100 text-blue-700", rejected: "bg-red-100 text-red-700", completed: "bg-emerald-100 text-emerald-700" };

export default function Appointments() {
    const qc = useQueryClient();
    const { data: rows = [], isLoading } = useQuery({ queryKey: ["appointments"], queryFn: async () => (await api.get("/appointments")).data, refetchInterval: 10000 });
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [view, setView] = useState(null);

    const filtered = useMemo(() => rows.filter((r) =>
        (r.patient_name?.toLowerCase().includes(search.toLowerCase()) || r.mobile?.includes(search) || r.patient_id?.toLowerCase().includes(search.toLowerCase())) &&
        (status === "all" || r.status === status)
    ), [rows, search, status]);

    const update = async (id, data) => {
        await api.put(`/appointments/${id}`, { data });
        qc.invalidateQueries({ queryKey: ["appointments"] });
        toast.success("Updated");
    };
    const remove = async (id) => {
        await api.delete(`/appointments/${id}`);
        qc.invalidateQueries({ queryKey: ["appointments"] });
        toast.success("Deleted");
    };

    const exportCsv = () => {
        const headers = ["Patient ID", "Name", "Mobile", "Email", "Test", "Date", "Time", "Home Collection", "Status", "Created"];
        const lines = filtered.map((r) => [r.patient_id, r.patient_name, r.mobile, r.email, r.test_name, r.preferred_date, r.preferred_time, r.home_collection ? "Yes" : "No", r.status, r.created_at].map((v) => `"${v ?? ""}"`).join(","));
        const csv = [headers.join(","), ...lines].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "appointments.csv"; a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="font-head text-2xl font-bold text-foreground">Appointments</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage bookings and home collection requests.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full" onClick={exportCsv} data-testid="export-csv"><DownloadSimple size={18} className="mr-1.5" /> Export CSV</Button>
                    <Button variant="outline" className="rounded-full" onClick={() => window.print()} data-testid="print-btn"><Printer size={18} className="mr-1.5" /> Print</Button>
                </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <MagnifyingGlass size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input data-testid="appt-search" placeholder="Search by name, mobile or ID…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-full h-11" />
                </div>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="sm:w-48 rounded-full h-11" data-testid="status-filter"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full text-sm" data-testid="appointments-table">
                    <thead className="bg-secondary/50 text-left">
                        <tr>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3 hidden md:table-cell">Test</th>
                            <th className="px-4 py-3 hidden lg:table-cell">Date</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="border-t border-border"><td colSpan={6} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>)
                        : filtered.map((r) => (
                            <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                                <td className="px-4 py-3">
                                    <div className="font-medium text-foreground">{r.patient_name}</div>
                                    <div className="text-xs text-muted-foreground">{r.mobile} · {r.patient_id}</div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{r.test_name || "—"}</td>
                                <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{r.preferred_date || "—"} {r.preferred_time}</td>
                                <td className="px-4 py-3">{r.home_collection ? <span className="text-xs rounded-full bg-blue-100 text-blue-700 px-2 py-0.5">Home</span> : <span className="text-xs rounded-full bg-secondary px-2 py-0.5">Lab</span>}</td>
                                <td className="px-4 py-3">
                                    <Select value={r.status} onValueChange={(v) => update(r.id, { status: v })}>
                                        <SelectTrigger className={`h-8 w-32 rounded-full text-xs capitalize border-0 ${badge[r.status] || "bg-secondary"}`} data-testid={`status-${r.id}`}><SelectValue /></SelectTrigger>
                                        <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                                    </Select>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setView(r)} data-testid={`view-${r.id}`}><Eye size={18} /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(r.id)} data-testid={`delete-${r.id}`}><Trash size={18} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!isLoading && filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No appointments found.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Dialog open={!!view} onOpenChange={() => setView(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Appointment Details</DialogTitle></DialogHeader>
                    {view && (
                        <div className="space-y-2 text-sm">
                            {[["Patient ID", view.patient_id], ["Name", view.patient_name], ["Mobile", view.mobile], ["Email", view.email], ["Age / Gender", `${view.age || "—"} / ${view.gender || "—"}`], ["Test", view.test_name], ["Date / Time", `${view.preferred_date || "—"} ${view.preferred_time || ""}`], ["Home Collection", view.home_collection ? "Yes" : "No"], ["Address", view.address], ["Notes", view.notes]].map(([k, v]) => (
                                <div key={k} className="flex justify-between gap-4 border-b border-border py-1.5"><span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground text-right">{v || "—"}</span></div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
