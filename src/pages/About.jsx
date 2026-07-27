import { Target, Eye, Users, Cpu, ShieldCheck, Path } from "@phosphor-icons/react";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading, FadeIn } from "@/components/site/Primitives";
import { useContent } from "@/hooks/useContent";

const VALUES = [
    { icon: Users, title: "Experienced Staff", desc: "A team of 25+ qualified pathologists and trained technicians." },
    { icon: Cpu, title: "Modern Equipment", desc: "Fully automated analyzers ensuring precision and speed." },
    { icon: ShieldCheck, title: "Quality Standards", desc: "NABL-aligned protocols with rigorous quality checks." },
];

export default function About() {
    const { data: c } = useContent();
    return (
        <>
            <Seo title={`About Us | ${c?.brand_name || "Shree Balaji Pathology Lab"}`} description={c?.about_intro} />
            <div className="bg-primary text-primary-foreground">
                <Section className="!py-16">
                    <span className="inline-block rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">About Us</span>
                    <h1 className="font-head text-4xl sm:text-5xl font-bold tracking-tighter max-w-3xl">Caring for your health for over 15 years</h1>
                    <p className="mt-5 max-w-2xl text-white/80 text-lg leading-relaxed">{c?.about_intro}</p>
                </Section>
            </div>

            <Section>
                <div className="grid lg:grid-cols-2 gap-8">
                    <FadeIn>
                        <div className="h-full rounded-2xl border border-border bg-card p-8">
                            <Target size={40} weight="duotone" className="text-primary" />
                            <h2 className="mt-4 font-head text-2xl font-bold text-foreground">Our Mission</h2>
                            <p className="mt-3 text-muted-foreground leading-relaxed">{c?.mission}</p>
                        </div>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <div className="h-full rounded-2xl border border-border bg-card p-8">
                            <Eye size={40} weight="duotone" className="text-accent" />
                            <h2 className="mt-4 font-head text-2xl font-bold text-foreground">Our Vision</h2>
                            <p className="mt-3 text-muted-foreground leading-relaxed">{c?.vision}</p>
                        </div>
                    </FadeIn>
                </div>
            </Section>

            <div className="bg-secondary/40">
                <Section>
                    <SectionHeading eyebrow="Our Journey" title="Built on trust and precision" subtitle="From a single collection centre to a full-scale diagnostic laboratory serving lakhs of patients." />
                    <div className="grid gap-6 sm:grid-cols-3">
                        {VALUES.map((v, i) => (
                            <FadeIn key={v.title} delay={i * 0.08}>
                                <div className="h-full rounded-2xl bg-card border border-border p-6 text-center">
                                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-primary"><v.icon size={28} weight="duotone" /></div>
                                    <h3 className="mt-4 font-head font-semibold text-lg text-foreground">{v.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </Section>
            </div>
        </>
    );
}
