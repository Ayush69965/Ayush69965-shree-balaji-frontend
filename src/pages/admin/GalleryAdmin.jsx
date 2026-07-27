import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash, PencilSimple, ArrowUp, ArrowDown } from "@phosphor-icons/react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import ImageUpload from "@/pages/admin/ImageUpload";

export default function GalleryAdmin() {
    const qc = useQueryClient();
    const { data: items = [], isLoading } = useQuery({ queryKey: ["gallery", "admin"], queryFn: async () => (await api.get("/gallery?admin_view=true")).data });
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({});
    const [editing, setEditing] = useState(null);

    const openNew = () => { setEditing(null); setForm({}); setOpen(true); };
    const openEdit = (r) => { setEditing(r); setForm({ ...r }); setOpen(true); };

    const save = async () => {
        if (!form.image_url) { toast.error("Please add an image"); return; }
        try {
            if (editing) await api.put(`/gallery/${editing.id}`, { data: form });
            else await api.post("/gallery", { data: form });
            qc.invalidateQueries({ queryKey: ["gallery"] });
            toast.success("Saved");
            setOpen(false);
        } catch (e) { toast.error("Save failed"); }
    };

    const remove = async (id) => { await api.delete(`/gallery/${id}`); qc.invalidateQueries({ queryKey: ["gallery"] }); toast.success("Deleted"); };

    const move = async (index, dir) => {
        const arr = [...items];
        const j = index + dir;
        if (j < 0 || j >= arr.length) return;
        [arr[index], arr[j]] = [arr[j], arr[index]];
        await api.put("/gallery/reorder/all", { data: { ids: arr.map((x) => x.id) } });
        qc.invalidateQueries({ queryKey: ["gallery"] });
    };

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="font-head text-2xl font-bold text-foreground">Gallery Manager</h1>
                    <p className="text-sm text-muted-foreground mt-1">Upload, edit, reorder and delete lab images. Changes appear instantly on the site.</p>
                </div>
                <Button className="rounded-full" onClick={openNew} data-testid="add-gallery"><Plus size={18} className="mr-1.5" /> Add Image</Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)
                : items.map((g, i) => (
                    <div key={g.id} className="overflow-hidden rounded-2xl border border-border bg-card" data-testid={`gallery-admin-${g.id}`}>
                        <img src={g.image_url} alt={g.title} className="h-40 w-full object-cover" />
                        <div className="p-4">
                            <div className="font-medium text-foreground text-sm">{g.title || "Untitled"}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{g.description}</div>
                            <div className="mt-3 flex items-center justify-between">
                                <div className="flex gap-1">
                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => move(i, -1)} data-testid={`up-${g.id}`}><ArrowUp size={16} /></Button>
                                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => move(i, 1)} data-testid={`down-${g.id}`}><ArrowDown size={16} /></Button>
                                </div>
                                <div className="flex gap-1">
                                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(g)}><PencilSimple size={16} /></Button>
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => remove(g.id)}><Trash size={16} /></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>{editing ? "Edit" : "Add"} Image</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                        <div><Label>Image</Label><div className="mt-1.5"><ImageUpload value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} /></div></div>
                        <div><Label>Title</Label><Input className="mt-1.5" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="gallery-title" /></div>
                        <div><Label>Description</Label><Input className="mt-1.5" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="gallery-desc" /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" className="rounded-full" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="rounded-full" onClick={save} data-testid="save-gallery">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
