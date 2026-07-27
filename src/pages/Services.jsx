import { useNavigate } from "react-router-dom";
import { Drop, TestTube, Heartbeat, Flask, ShieldCheck, House, Buildings, Baby, GenderIntersex } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading, FadeIn } from "@/components/site/Primitives";

const SERVICES = [
    { icon: Drop, name: "Blood Tests", desc: "Complete range of routine and specialised blood investigations." },
    { icon: Drop, name: "CBC", desc: "Complete Blood Count for infections, anaemia and overall health." },
    { icon: TestTube, name: "Urine Test", desc: "Routine and microscopic urine examination." },
    { icon: ShieldCheck, name: "Liver Function Test", desc: "Assess liver health and detect disorders early." },
    { icon: ShieldCheck, name: "Kidney Function Test", desc: "Evaluate kidney performance and function." },
    { icon: Heartbeat, name: "Thyroid Profile", desc: "T3, T4 and TSH to monitor metabolism." },
    { icon: Flask, name: "Vitamin Profile", desc: "Vitamin D, B12 and more to track deficiencies." },
    { icon: Heartbeat, name: "Diabetes Profile", desc: "HbA1c, fasting and PP sugar monitoring." },
    { icon: GenderIntersex, name: "Hormone Tests", desc: "Comprehensive hormonal assays." },
    { icon: Baby, name: "Pregnancy Tests", desc: "Beta HCG and prenatal screening." },
    { icon: House, name: "Home Sample Collection", desc: "Free doorstep collection by trained staff." },
    { icon: Buildings, name: "Corporate Checkups", desc: "Health checkup programs for organisations." },
];

export default function Services() {
    const navigate = useNavigate();
    return (
        <>
            <Seo title="Our Services | Shree Balaji Pathology Lab" description="Explore our complete range of pathology services including blood tests, thyroid, diabetes, vitamin profiles and home sample collection." />
            <Section>
                <SectionHeading eyebrow="Our Services" title="A complete diagnostic menu" subtitle="Everything you need for preventive and diagnostic testing under one trusted roof." />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {SERVICES.map((s, i) => (
                        <FadeIn key={s.name} delay={i * 0.05}>
                            <div className="group h-full rounded-2xl border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                                <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <s.icon size={26} weight="duotone" />
                                </div>
                                <h3 className="mt-5 font-head font-semibold text-lg text-foreground">{s.name}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                                <Button onClick={() => navigate("/appointment")} variant="link" className="mt-3 px-0 text-primary">Book now →</Button>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>
        </>
    );
}
