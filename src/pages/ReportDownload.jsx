import { useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, DownloadSimple, FileText, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";

export default function ReportDownload() {
    const [patientId, setPatientId] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const lookup = async (e) => {
        e.preventDefault();
        if (!patientId || !mobile) { toast.error("Enter Patient ID and mobile number."); return; }
        setLoading(true);
        setResult(null);
        try {
            const { data } = await api.post("/reports/lookup", { patient_id: patientId, mobile });
            setResult(data);
        } catch (err) {
            toast.error(err.response?.data?.detail || "No record found.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Seo title="Download Report | Shree Balaji Pathology Lab" description="Securely download your pathology test reports using your Patient ID and registered mobile number." />
            <Section className="max-w-xl">
                <SectionHeading eyebrow="Reports" title="Download your report" subtitle="Secure access with your Patient ID and registered mobile number." />
                <form onSubmit={lookup} className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5" data-testid="report-form">
                    <div className="flex items-center gap-2 rounded-xl bg-secondary p-3 text-sm text-primary">
                        <ShieldCheck size={20} weight="fill" /> Your data is verified securely.
                    </div>
                    <div><Label>Patient ID</Label><Input data-testid="report-patient-id" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1.5" placeholder="e.g. SBLA1B2C3" /></div>
                    <div><Label>Registered Mobile Number</Label><Input data-testid="report-mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1.5" placeholder="10-digit mobile" /></div>
                    <Button type="submit" disabled={loading} className="w-full rounded-full h-12" data-testid="report-lookup-btn">
                        <MagnifyingGlass size={18} className="mr-1.5" /> {loading ? "Verifying…" : "Find My Report"}
                    </Button>
                </form>

                {result && (
                    <div className="mt-6 rounded-2xl border border-border bg-card p-6" data-testid="report-result">
                        <div className="flex items-center gap-3">
                            <FileText size={28} weight="duotone" className="text-primary" />
                            <div>
                                <div className="font-head font-semibold text-foreground">{result.patient_name}</div>
                                <div className="text-sm text-muted-foreground">{result.patient_id} · {result.test_name || "General"}</div>
                            </div>
                        </div>
                        <div className="mt-4 rounded-xl bg-secondary/50 p-4 text-sm">
                            Status: <span className="font-semibold text-foreground capitalize">{result.status}</span>
                        </div>
                        {result.report_ready ? (
                            result.report_url ? (
                                <a href={result.report_url} target="_blank" rel="noreferrer">
                                    <Button className="w-full rounded-full mt-4" data-testid="download-report"><DownloadSimple size={18} className="mr-1.5" /> Download Report</Button>
                                </a>
                            ) : (
                                <p className="mt-4 text-sm text-muted-foreground">Your report is completed. Please contact the lab to receive your report file.</p>
                            )
                        ) : (
                            <p className="mt-4 text-sm text-muted-foreground">Your report is being processed. We'll notify you once it's ready.</p>
                        )}
                    </div>
                )}
            </Section>
        </>
    );
}
