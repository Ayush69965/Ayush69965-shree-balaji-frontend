import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, PencilSimple, Trash, Eye, EyeSlash } from "@phosphor-icons/react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUpload from "@/pages/admin/ImageUpload";

const CONFIGS = {
    tests: {
        title: "Tests", singular: "Test",
        columns: [["name", "Name"], ["category", "Category"], ["price", "Price"], ["sample_type", "Sample"]],
        fields: [
            { key: "name", label: "Test Name", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "price", label: "Price (₹)", type: "number" },
            { key: "sample_type", label: "Sample Type", type: "text" },
            { key: "report_time", label: "Report Time", type: "text" },
            { key: "preparation", label: "Preparation", type: "text" },
            { key: "popular", label: "Mark as Popular", type: "switch" },
        ],
    },
    packages: {
        title: "Health Packages", singular: "Package",
        columns: [["name", "Name"], ["price", "Price"], ["tests_count", "Tests"]],
        fields: [
            { key: "name", label: "Package Name", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "price", label: "Price (₹)", type: "number" },
            { key: "original_price", label: "Original Price (₹)", type: "number" },
            { key: "tests_count", label: "Number of Tests", type: "number" },
            { key: "features", label: "Features (comma separated)", type: "list" },
            { key: "popular", label: "Mark as Popular", type: "switch" },
        ],
    },
    blogs: {
        title: "Blogs", singular: "Blog",
        columns: [["title", "Title"], ["category", "Category"], ["slug", "Slug"]],
        fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "slug", label: "SEO URL Slug", type: "text" },
            { key: "category", label: "Category", type: "text" },
            { key: "excerpt", label: "Excerpt", type: "textarea" },
            { key: "content", label: "Content", type: "longtext" },
            { key: "image", label: "Featured Image", type: "image" },
            { key: "meta_title", label: "Meta Title", type: "text" },
            { key: "meta_description", label: "Meta Description", type: "textarea" },
        ],
    },
    testimonials: {
        title: "Testimonials", singular: "Testimonial",
        columns: [["name", "Name"], ["rating", "Rating"], ["location", "Location"]],
        fields: [
            { key: "name", label: "Customer Name", type: "text" },
            { key: "location", label: "Location", type: "text" },
            { key: "rating", label: "Star Rating (1-5)", type: "number" },
            { key: "review", label: "Review", type: "textarea" },
        ],
    },
    faqs: {
        title: "FAQs", singular: "FAQ",
        columns: [["question", "Question"]],
        fields: [
            { key: "question", label: "Question", type: "text" },
            { key: "answer", label: "Answer", type: "textarea" },
        ],
    },
    offers: {
        title: "Offers", singular: "Offer",
        columns: [["title", "Title"], ["discount", "Discount"], ["type", "Type"]],
        fields: [
            { key: "title", label: "Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            { key: "discount", label: "Discount", type: "text" },
            { key: "type", label: "Type", type: "text" },
        ],
    },
    doctors: {
        title: "Doctors", singular: "Doctor",
        columns: [["name", "Name"], ["designation", "Designation"], ["experience", "Experience"]],
        fields: [
            { key: "name", label: "Name", type: "text" },
            { key: "designation", label: "Designation", type: "text" },
            { key: "experience", label: "Experience", type: "text" },
            { key: "bio", label: "Bio", type: "text" },
            { key: "image", label: "Photo", type: "image" },
        ],
    },
};

export default function CollectionManager() {
    const { collection } = useParams();
    const cfg = CONFIGS[collection];
    const qc = useQueryClient();
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);

    const { data: rows = [], isLoading } = useQuery({
        queryKey: [collection, "admin"],
        queryFn: async () => (await api.get(`/${collection}?admin_view=true`)).data,
        enabled: !!cfg,
    });

    if (!cfg) return <div>Unknown section</div>;

    const openNew = () => { setEditing(null); setForm({}); setOpen(true); };
    const openEdit = (row) => {
        const f = { ...row };
        if (Array.isArray(f.features)) f.features = f.features.join(", ");
        setEditing(row); setForm(f); setOpen(true);
    };

    const save = async () => {
        const payload = { ...form };
        cfg.fields.forEach((fl) => {
            if (fl.type === "number") payload[fl.key] = Number(payload[fl.key]) || 0;
            if (fl.type === "list") payload[fl.key] = (payload[fl.key] || "").split(",").map((s) => s.trim()).filter(Boolean);
        });
        try {
            if (editing) await api.put(`/${collection}/${editing.id}`, { data: payload });
            else await api.post(`/${collection}`, { data: payload });
            qc.invalidateQueries({ queryKey: [collection] });
            toast.success(`${cfg.singular} saved`);
            setOpen(false);
        } catch (e) { toast.error("Save failed"); }
    };

    const remove = async (id) => {
        await api.delete(`/${collection}/${id}`);
        qc.invalidateQueries({ queryKey: [collection] });
        toast.success("Deleted");
    };

    const toggleHide = async (row) => {
        await api.put(`/${collection}/${row.id}`, { data: { hidden: !row.hidden } });
        qc.invalidateQueries({ queryKey: [collection] });
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="font-head text-2xl font-bold text-foreground">{cfg.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">Add, edit, hide or delete {cfg.title.toLowerCase()}.</p>
                </div>
                <Button className="rounded-full" onClick={openNew} data-testid="add-item"><Plus size={18} className="mr-1.5" /> Add {cfg.singular}</Button>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full text-sm">
                    <thead className="bg-secondary/50 text-left">
                        <tr>{cfg.columns.map(([, l]) => <th key={l} className="px-4 py-3">{l}</th>)}<th className="px-4 py-3">Visible</th><th className="px-4 py-3">Actions</th></tr>
                    </thead>
                    <tbody>
                        {isLoading ? Array.from({ length: 4 }).map((_, i) => <tr key={i} className="border-t border-border"><td colSpan={cfg.columns.length + 2} className="px-4 py-3"><Skeleton className="h-6 w-full" /></td></tr>)
                        : rows.map((r) => (
                            <tr key={r.id} className="border-t border-border hover:bg-secondary/30">
                                {cfg.columns.map(([k]) => <td key={k} className="px-4 py-3 text-foreground">{k === "price" ? `₹${r[k]}` : String(r[k] ?? "—").slice(0, 60)}</td>)}
                                <td className="px-4 py-3">
                                    <button onClick={() => toggleHide(r)} data-testid={`toggle-${r.id}`} className={r.hidden ? "text-muted-foreground" : "text-emerald-600"}>
                                        {r.hidden ? <EyeSlash size={20} /> : <Eye size={20} />}
                                    </button>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-1">
                                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(r)} data-testid={`edit-${r.id}`}><PencilSimple size={18} /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(r.id)} data-testid={`delete-${r.id}`}><Trash size={18} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!isLoading && rows.length === 0 && <tr><td colSpan={cfg.columns.length + 2} className="px-4 py-12 text-center text-muted-foreground">No records yet.</td></tr>}
                    </tbody>
                </table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} {cfg.singular}</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        {cfg.fields.map((fl) => (
                            <div key={fl.key}>
                                <Label>{fl.label}</Label>
                                {fl.type === "switch" ? (
                                    <div className="mt-2"><Switch checked={!!form[fl.key]} onCheckedChange={(v) => setForm({ ...form, [fl.key]: v })} data-testid={`field-${fl.key}`} /></div>
                                ) : fl.type === "textarea" || fl.type === "list" ? (
                                    <Textarea className="mt-1.5" value={form[fl.key] || ""} onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} data-testid={`field-${fl.key}`} />
                                ) : fl.type === "longtext" ? (
                                    <Textarea rows={8} className="mt-1.5" value={form[fl.key] || ""} onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} data-testid={`field-${fl.key}`} />
                                ) : fl.type === "image" ? (
                                    <div className="mt-1.5"><ImageUpload value={form[fl.key]} onChange={(v) => setForm({ ...form, [fl.key]: v })} testid={`field-${fl.key}`} /></div>
                                ) : (
                                    <Input type={fl.type} className="mt-1.5" value={form[fl.key] ?? ""} onChange={(e) => setForm({ ...form, [fl.key]: e.target.value })} data-testid={`field-${fl.key}`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="rounded-full" onClick={save} data-testid="save-item">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
