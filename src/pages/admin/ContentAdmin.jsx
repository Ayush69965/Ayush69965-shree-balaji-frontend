import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FloppyDisk } from "@phosphor-icons/react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageUpload from "@/pages/admin/ImageUpload";

export default function ContentAdmin() {
    const qc = useQueryClient();
    const { data } = useQuery({ queryKey: ["content"], queryFn: async () => (await api.get("/content")).data });
    const [form, setForm] = useState({});

    useEffect(() => { if (data) setForm(data); }, [data]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
    const setNested = (parent, k, v) => setForm((f) => ({ ...f, [parent]: { ...(f[parent] || {}), [k]: v } }));

    const save = async () => {
        try {
            await api.put("/content", { data: form });
            qc.invalidateQueries({ queryKey: ["content"] });
            toast.success("Website content updated");
        } catch (e) { toast.error("Save failed"); }
    };

    const Field = ({ label, k, area }) => (
        <div>
            <Label>{label}</Label>
            {area ? <Textarea className="mt-1.5" value={form[k] || ""} onChange={(e) => set(k, e.target.value)} data-testid={`content-${k}`} />
                  : <Input className="mt-1.5" value={form[k] || ""} onChange={(e) => set(k, e.target.value)} data-testid={`content-${k}`} />}
        </div>
    );

    const seo = form.seo || {};
    const social = form.social || {};

    return (
        <div>
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="font-head text-2xl font-bold text-foreground">Content & SEO</h1>
                    <p className="text-sm text-muted-foreground mt-1">Edit website text, contact details, hero and SEO — no coding needed.</p>
                </div>
                <Button className="rounded-full" onClick={save} data-testid="save-content"><FloppyDisk size={18} className="mr-1.5" /> Save Changes</Button>
            </div>

            <Tabs defaultValue="general" className="mt-6">
                <TabsList className="flex-wrap h-auto">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="hero">Hero</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="seo">SEO</TabsTrigger>
                </TabsList>

                <div className="mt-5 rounded-2xl border border-border bg-card p-6 max-w-2xl">
                    <TabsContent value="general" className="space-y-4 mt-0">
                        <Field label="Brand Name" k="brand_name" />
                        <Field label="Tagline" k="tagline" />
                    </TabsContent>
                    <TabsContent value="hero" className="space-y-4 mt-0">
                        <Field label="Hero Title" k="hero_title" />
                        <Field label="Hero Subtitle" k="hero_subtitle" area />
                        <div><Label>Hero Background Image</Label><div className="mt-1.5"><ImageUpload value={form.hero_image} onChange={(v) => set("hero_image", v)} /></div></div>
                    </TabsContent>
                    <TabsContent value="about" className="space-y-4 mt-0">
                        <Field label="About Intro" k="about_intro" area />
                        <Field label="Mission" k="mission" area />
                        <Field label="Vision" k="vision" area />
                    </TabsContent>
                    <TabsContent value="contact" className="space-y-4 mt-0">
                        <Field label="Phone" k="phone" />
                        <Field label="WhatsApp" k="whatsapp" />
                        <Field label="Email" k="email" />
                        <Field label="Address" k="address" area />
                        <Field label="Opening Hours" k="opening_hours" />
                        <div><Label>Google Map Embed URL</Label><Textarea className="mt-1.5" value={form.map_embed || ""} onChange={(e) => set("map_embed", e.target.value)} data-testid="content-map_embed" /></div>
                    </TabsContent>
                    <TabsContent value="social" className="space-y-4 mt-0">
                        {["facebook", "instagram", "twitter", "youtube"].map((s) => (
                            <div key={s}><Label className="capitalize">{s}</Label><Input className="mt-1.5" value={social[s] || ""} onChange={(e) => setNested("social", s, e.target.value)} data-testid={`social-${s}`} /></div>
                        ))}
                    </TabsContent>
                    <TabsContent value="seo" className="space-y-4 mt-0">
                        <div><Label>Meta Title</Label><Input className="mt-1.5" value={seo.title || ""} onChange={(e) => setNested("seo", "title", e.target.value)} data-testid="seo-title" /></div>
                        <div><Label>Meta Description</Label><Textarea className="mt-1.5" value={seo.description || ""} onChange={(e) => setNested("seo", "description", e.target.value)} data-testid="seo-description" /></div>
                        <div><Label>Keywords</Label><Input className="mt-1.5" value={seo.keywords || ""} onChange={(e) => setNested("seo", "keywords", e.target.value)} data-testid="seo-keywords" /></div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
