import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";

const empty = { patient_name: "", mobile: "", email: "", age: "", gender: "", address: "", preferred_date: "", preferred_time: "", test_name: "", home_collection: false, notes: "" };

export default function AppointmentForm({ defaultHomeCollection = false, title = "Book an Appointment", eyebrow = "Appointment" }) {
    const [params] = useSearchParams();
    const [form, setForm] = useState({ ...empty, home_collection: defaultHomeCollection });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const test = params.get("test");
        if (test) setForm((f) => ({ ...f, test_name: test }));
    }, [params]);

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        if (!form.patient_name || !form.mobile) {
            toast.error("Please enter your name and mobile number.");
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await api.post("/appointments", form);
            setSuccess(data.patient_id);
            toast.success("Booking confirmed! Our team will contact you shortly.");
            setForm({ ...empty, home_collection: defaultHomeCollection });
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <Section className="max-w-xl">
                <div className="rounded-2xl border border-border bg-card p-10 text-center">
                    <CheckCircle size={64} weight="fill" className="mx-auto text-accent" />
                    <h2 className="mt-5 font-head text-2xl font-bold text-foreground">Booking Confirmed!</h2>
                    <p className="mt-2 text-muted-foreground">Your request has been received. Our team will call you shortly to confirm.</p>
                    <div className="mt-5 rounded-xl bg-secondary p-4">
                        <div className="text-sm text-muted-foreground">Your Patient ID</div>
                        <div className="font-head text-2xl font-bold text-primary" data-testid="patient-id-result">{success}</div>
                        <div className="text-xs text-muted-foreground mt-1">Use this ID with your mobile number to download reports.</div>
                    </div>
                    <Button className="mt-6 rounded-full" onClick={() => setSuccess(null)} data-testid="book-another">Book Another</Button>
                </div>
            </Section>
        );
    }

    return (
        <>
            <Seo title={`${title} | Shree Balaji Pathology Lab`} description="Book your lab test or home sample collection online in a few clicks." />
            <Section className="max-w-2xl">
                <SectionHeading eyebrow={eyebrow} title={title} subtitle="Fill in your details and our team will confirm your appointment." />
                <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5" data-testid="appointment-form">
                    <div className="grid sm:grid-cols-2 gap-5">
                        <div><Label>Patient Name *</Label><Input data-testid="input-name" value={form.patient_name} onChange={(e) => set("patient_name", e.target.value)} className="mt-1.5" placeholder="Full name" /></div>
                        <div><Label>Mobile Number *</Label><Input data-testid="input-mobile" value={form.mobile} onChange={(e) => set("mobile", e.target.value)} className="mt-1.5" placeholder="10-digit mobile" /></div>
                        <div><Label>Email</Label><Input data-testid="input-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1.5" placeholder="you@example.com" /></div>
                        <div><Label>Age</Label><Input data-testid="input-age" value={form.age} onChange={(e) => set("age", e.target.value)} className="mt-1.5" placeholder="Age" /></div>
                        <div>
                            <Label>Gender</Label>
                            <Select value={form.gender} onValueChange={(v) => set("gender", v)}>
                                <SelectTrigger data-testid="input-gender" className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
                            </Select>
                        </div>
                        <div><Label>Test / Package</Label><Input data-testid="input-test" value={form.test_name} onChange={(e) => set("test_name", e.target.value)} className="mt-1.5" placeholder="e.g. CBC" /></div>
                        <div><Label>Preferred Date</Label><Input data-testid="input-date" type="date" value={form.preferred_date} onChange={(e) => set("preferred_date", e.target.value)} className="mt-1.5" /></div>
                        <div><Label>Preferred Time</Label><Input data-testid="input-time" type="time" value={form.preferred_time} onChange={(e) => set("preferred_time", e.target.value)} className="mt-1.5" /></div>
                    </div>
                    <div><Label>Address</Label><Textarea data-testid="input-address" value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1.5" placeholder="Full address for home collection" /></div>
                    <div><Label>Additional Notes</Label><Textarea data-testid="input-notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} className="mt-1.5" placeholder="Anything we should know?" /></div>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox data-testid="input-home-collection" checked={form.home_collection} onCheckedChange={(v) => set("home_collection", !!v)} />
                        <span className="text-sm text-foreground">Request free home sample collection</span>
                    </label>
                    <Button type="submit" disabled={submitting} className="w-full rounded-full h-12 text-base" data-testid="submit-appointment">
                        {submitting ? "Booking…" : "Confirm Booking"}
                    </Button>
                </form>
            </Section>
        </>
    );
}
