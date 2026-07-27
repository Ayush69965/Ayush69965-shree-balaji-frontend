import { useState } from "react";
import { toast } from "sonner";
import { Phone, EnvelopeSimple, MapPin, Clock, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";
import { useContent } from "@/hooks/useContent";

export default function Contact() {
    const { data: c } = useContent();
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const wa = (c?.whatsapp || "").replace(/[^0-9]/g, "");

    const submit = (e) => {
        e.preventDefault();
        toast.success("Thank you! We'll get back to you shortly.");
        setForm({ name: "", email: "", message: "" });
    };

    const items = [
        { icon: Phone, label: "Phone", value: c?.phone },
        { icon: EnvelopeSimple, label: "Email", value: c?.email },
        { icon: MapPin, label: "Address", value: c?.address },
        { icon: Clock, label: "Opening Hours", value: c?.opening_hours },
    ];

    return (
        <>
            <Seo title="Contact Us | Shree Balaji Pathology Lab" description="Get in touch with Shree Balaji Pathology Lab. Call, WhatsApp, email or visit us." />
            <Section>
                <SectionHeading eyebrow="Contact" title="We're here to help" subtitle="Reach out to us anytime — our team is ready to assist you." />
                <div className="grid lg:grid-cols-2 gap-10">
                    <div className="space-y-5">
                        {items.map((it) => (
                            <div key={it.label} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
                                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary shrink-0"><it.icon size={22} weight="duotone" /></div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground">{it.label}</div>
                                    <div className="text-sm text-muted-foreground">{it.value}</div>
                                </div>
                            </div>
                        ))}
                        <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer">
                            <Button className="w-full rounded-full bg-[#25D366] hover:bg-[#1eb955] h-12" data-testid="contact-whatsapp"><WhatsappLogo size={20} weight="fill" className="mr-2" /> Chat on WhatsApp</Button>
                        </a>
                    </div>
                    <div>
                        <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 space-y-4" data-testid="contact-form">
                            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
                            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>
                            <div><Label>Message</Label><Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-1.5" rows={5} /></div>
                            <Button type="submit" className="w-full rounded-full h-12">Send Message</Button>
                        </form>
                        <div className="mt-5 overflow-hidden rounded-2xl border border-border h-[260px]">
                            <iframe title="Lab location" src={c?.map_embed} className="h-full w-full border-0" loading="lazy" />
                        </div>
                    </div>
                </div>
            </Section>
        </>
    );
}
