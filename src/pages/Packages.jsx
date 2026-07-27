import { useNavigate } from "react-router-dom";
import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading, FadeIn } from "@/components/site/Primitives";
import { useCollection } from "@/hooks/useContent";

export default function Packages() {
    const navigate = useNavigate();
    const { data: packages = [] } = useCollection("packages");
    return (
        <>
            <Seo title="Health Packages | Shree Balaji Pathology Lab" description="Affordable curated health checkup packages with significant savings. Full body, diabetes, women's wellness and more." />
            <Section>
                <SectionHeading eyebrow="Health Packages" title="Curated checkups that save you more" subtitle="Comprehensive bundles designed by our doctors for complete peace of mind." />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {packages.map((p, i) => (
                        <FadeIn key={p.id} delay={i * 0.08}>
                            <div className={`relative flex flex-col h-full rounded-2xl border p-6 ${p.popular ? "border-accent ring-1 ring-accent bg-card" : "border-border bg-card"}`}>
                                {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Most Popular</span>}
                                <h3 className="font-head font-semibold text-lg text-foreground">{p.name}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                                <div className="mt-4 flex items-end gap-2">
                                    <span className="font-head text-3xl font-bold text-primary">₹{p.price}</span>
                                    <span className="text-sm line-through text-muted-foreground">₹{p.original_price}</span>
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">{p.tests_count} tests included</div>
                                <ul className="mt-4 space-y-2 flex-1">
                                    {(p.features || []).map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle size={16} weight="fill" className="text-accent shrink-0" /> {f}</li>
                                    ))}
                                </ul>
                                <Button onClick={() => navigate(`/appointment?test=${encodeURIComponent(p.name)}`)} className="mt-5 rounded-full">Book Package</Button>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>
        </>
    );
}
