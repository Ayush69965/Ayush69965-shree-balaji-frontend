import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    CalendarCheck, House, Phone, WhatsappLogo, ListMagnifyingGlass, ShieldCheck, Truck, Clock,
    Flask, CurrencyInr, Star, ArrowRight, CheckCircle, Quotes, MapPin, TestTube, Heartbeat, Drop,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading, FadeIn } from "@/components/site/Primitives";
import { useContent, useCollection } from "@/hooks/useContent";

const WHY = [
    { icon: ShieldCheck, title: "NABL Accredited", desc: "Quality-assured results following strict national standards." },
    { icon: Truck, title: "Free Home Collection", desc: "Trained phlebotomists collect samples at your doorstep." },
    { icon: Clock, title: "Fast Reports", desc: "Most reports delivered the same day via WhatsApp & email." },
    { icon: CurrencyInr, title: "Affordable Pricing", desc: "Premium diagnostics at prices friendly to every family." },
];

const SERVICES = [
    { icon: Drop, name: "Blood Tests" }, { icon: TestTube, name: "Urine Tests" },
    { icon: Heartbeat, name: "Thyroid Profile" }, { icon: Flask, name: "Vitamin Profile" },
    { icon: Heartbeat, name: "Diabetes Profile" }, { icon: ShieldCheck, name: "Liver & Kidney" },
];

export default function Home() {
    const navigate = useNavigate();
    const { data: c } = useContent();
    const { data: tests = [] } = useCollection("tests");
    const { data: packages = [] } = useCollection("packages");
    const { data: doctors = [] } = useCollection("doctors");
    const { data: testimonials = [] } = useCollection("testimonials");
    const { data: faqs = [] } = useCollection("faqs");
    const { data: blogs = [] } = useCollection("blogs");

    const popularTests = Array.isArray(tests)
  ? tests.filter((t) => t.popular).slice(0, 6)
  : [];
    const wa = (c?.whatsapp || "").replace(/[^0-9]/g, "");
    const phone = (c?.phone || "").replace(/[^0-9+]/g, "");

    return (
        <>
            <Seo title={c?.seo?.title} description={c?.seo?.description} keywords={c?.seo?.keywords} />

            {/* HERO */}
            <section className="relative overflow-hidden bg-primary">
                <div className="absolute inset-0">
                    <img src={c?.hero_image} alt="Modern pathology laboratory" className="h-full w-full object-cover opacity-25" />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
                </div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 grid lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-7 text-primary-foreground">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur"
                        >
                            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> NABL Accredited Diagnostic Centre
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-6 font-head text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05]"
                        >
                            {c?.hero_title || "Advanced Diagnostics You Can Trust"}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed"
                        >
                            {c?.hero_subtitle}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-8 flex flex-wrap gap-3"
                        >
                            <Button onClick={() => navigate("/appointment")} data-testid="hero-book-appointment" className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 px-6">
                                <CalendarCheck size={20} weight="bold" className="mr-1" /> Book Appointment
                            </Button>
                            <Button onClick={() => navigate("/home-collection")} data-testid="hero-home-collection" className="rounded-full bg-white text-primary hover:bg-white/90 font-semibold h-12 px-6">
                                <House size={20} weight="bold" className="mr-1" /> Home Sample
                            </Button>
                            <a href={`tel:${phone}`} data-testid="hero-call" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 h-12 font-semibold hover:bg-white/20 transition-colors">
                                <Phone size={20} weight="bold" className="mr-2" /> Call Now
                            </a>
                            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" data-testid="hero-whatsapp" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 backdrop-blur px-6 h-12 font-semibold hover:bg-white/20 transition-colors">
                                <WhatsappLogo size={20} weight="bold" className="mr-2" /> WhatsApp
                            </a>
                            <Button onClick={() => navigate("/tests")} data-testid="hero-view-tests" variant="ghost" className="rounded-full text-white hover:bg-white/10 h-12 px-6 font-semibold">
                                <ListMagnifyingGlass size={20} weight="bold" className="mr-1" /> View Test List
                            </Button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.35 }}
                        className="lg:col-span-5"
                    >
                        <div className="glass rounded-2xl p-6 sm:p-8 shadow-2xl">
                            <h3 className="font-head font-bold text-lg text-foreground">Trusted by families across the city</h3>
                            <div className="mt-5 grid grid-cols-2 gap-4">
                                {(c?.stats || []).map((s) => (
                                    <div key={s.label} className="rounded-xl bg-secondary/60 p-4">
                                        <div className="font-head text-2xl font-bold text-primary">{s.value}</div>
                                        <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-5 flex items-center gap-2 rounded-xl bg-accent/10 p-3.5 text-sm text-accent-foreground">
                                <CheckCircle size={20} weight="fill" className="text-accent" />
                                <span className="text-foreground font-medium">100% Accurate & Confidential Reports</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <Section>
                <SectionHeading eyebrow="Why Choose Us" title="Diagnostics designed around you" subtitle="Everything we do is built to make testing accurate, convenient and stress-free." />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {WHY.map((w, i) => (
                        <FadeIn key={w.title} delay={i * 0.08}>
                            <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-transform duration-300">
                                <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                    <w.icon size={26} weight="duotone" />
                                </div>
                                <h3 className="mt-5 font-head font-semibold text-lg text-foreground">{w.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>

            {/* SERVICES */}
            <div className="bg-secondary/40">
                <Section>
                    <SectionHeading eyebrow="Our Services" title="Comprehensive test menu" subtitle="From routine screening to specialised panels — all under one roof." />
                    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                        {SERVICES.map((s, i) => (
                            <FadeIn key={s.name} delay={i * 0.05}>
                                <Link to="/services" className="flex flex-col items-center gap-3 rounded-2xl bg-card border border-border p-6 text-center hover:-translate-y-1 hover:border-primary/30 transition-all duration-300">
                                    <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary text-primary">
                                        <s.icon size={24} weight="duotone" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                </Section>
            </div>

            {/* POPULAR TESTS */}
            <Section>
                <SectionHeading eyebrow="Popular Tests" title="Most booked tests this week" />
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {popularTests.map((t, i) => (
                        <FadeIn key={t.id} delay={i * 0.06}>
                            <div className="flex flex-col h-full rounded-2xl border border-border bg-card p-6 hover:shadow-lg transition-shadow duration-300">
                                <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{t.category}</span>
                                <h3 className="mt-4 font-head font-semibold text-lg text-foreground">{t.name}</h3>
                                <div className="mt-2 text-sm text-muted-foreground space-y-1">
                                    <div>Sample: {t.sample_type} · {t.report_time}</div>
                                    <div>{t.preparation}</div>
                                </div>
                                <div className="mt-auto pt-5 flex items-center justify-between">
                                    <span className="font-head text-2xl font-bold text-primary">₹{t.price}</span>
                                    <Button onClick={() => navigate(`/appointment?test=${encodeURIComponent(t.name)}`)} size="sm" className="rounded-full">Book Now</Button>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
                <div className="text-center mt-10">
                    <Button onClick={() => navigate("/tests")} variant="outline" className="rounded-full">View All Tests <ArrowRight size={18} className="ml-1.5" /></Button>
                </div>
            </Section>

            {/* PACKAGES */}
            <div className="bg-primary text-primary-foreground">
                <Section>
                    <div className="max-w-2xl mx-auto text-center mb-12">
                        <span className="inline-block rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider mb-4">Health Packages</span>
                        <h2 className="font-head text-3xl sm:text-4xl font-bold tracking-tight">Save more with curated packages</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {packages.map((p, i) => (
                            <FadeIn key={p.id} delay={i * 0.08}>
                                <div className={`relative flex flex-col h-full rounded-2xl p-6 ${p.popular ? "bg-white text-foreground ring-2 ring-accent" : "bg-white/10 backdrop-blur border border-white/15"}`}>
                                    {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Most Popular</span>}
                                    <h3 className={`font-head font-semibold text-lg ${p.popular ? "text-foreground" : "text-white"}`}>{p.name}</h3>
                                    <div className="mt-3 flex items-end gap-2">
                                        <span className={`font-head text-3xl font-bold ${p.popular ? "text-primary" : "text-white"}`}>₹{p.price}</span>
                                        <span className={`text-sm line-through ${p.popular ? "text-muted-foreground" : "text-white/60"}`}>₹{p.original_price}</span>
                                    </div>
                                    <div className={`mt-1 text-xs ${p.popular ? "text-muted-foreground" : "text-white/70"}`}>{p.tests_count} tests included</div>
                                    <ul className="mt-4 space-y-2 flex-1">
                                        {(p.features || []).map((f) => (
                                            <li key={f} className={`flex items-center gap-2 text-sm ${p.popular ? "text-foreground" : "text-white/90"}`}>
                                                <CheckCircle size={16} weight="fill" className="text-accent shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button onClick={() => navigate(`/appointment?test=${encodeURIComponent(p.name)}`)} className={`mt-5 rounded-full ${p.popular ? "bg-primary" : "bg-white text-primary hover:bg-white/90"}`}>Book Package</Button>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </Section>
            </div>

            {/* DOCTORS */}
            <Section>
                <SectionHeading eyebrow="Our Experts" title="Meet our pathologists" subtitle="Highly experienced specialists ensuring every report is accurate and reliable." />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {doctors.map((d, i) => (
                        <FadeIn key={d.id} delay={i * 0.08}>
                            <div className="group overflow-hidden rounded-2xl border border-border bg-card">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={d.image} alt={d.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-head font-semibold text-lg text-foreground">{d.name}</h3>
                                    <p className="text-sm text-primary font-medium mt-0.5">{d.designation}</p>
                                    <p className="text-sm text-muted-foreground mt-2">{d.experience} experience · {d.bio}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </Section>

            {/* TESTIMONIALS */}
            <div className="bg-secondary/40">
                <Section>
                    <SectionHeading eyebrow="Testimonials" title="Loved by our patients" subtitle="Rated 4.9/5 across thousands of Google reviews." />
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.slice(0, 6).map((t, i) => (
                            <FadeIn key={t.id} delay={i * 0.06}>
                                <div className="h-full rounded-2xl bg-card border border-border p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                    <Quotes size={28} weight="fill" className="text-primary/20" />
                                    <div className="flex gap-0.5 mt-2">
                                        {Array.from({ length: 5 }).map((_, s) => (
                                            <Star key={s} size={16} weight="fill" className={s < t.rating ? "text-amber-400" : "text-muted"} />
                                        ))}
                                    </div>
                                    <p className="mt-3 text-sm text-foreground leading-relaxed">{t.review}</p>
                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">{t.name?.[0]}</div>
                                        <div>
                                            <div className="text-sm font-semibold text-foreground">{t.name}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {t.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </Section>
            </div>

            {/* FAQ + BLOG */}
            <Section>
                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <SectionHeading eyebrow="FAQs" title="Frequently asked questions" center={false} />
                        <Accordion type="single" collapsible className="space-y-3">
                            {faqs.slice(0, 5).map((f) => (
                                <AccordionItem key={f.id} value={f.id} className="rounded-xl border border-border bg-card px-5">
                                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">{f.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                    <div>
                        <SectionHeading eyebrow="Latest Blog" title="Health tips & insights" center={false} />
                        <div className="space-y-4">
                            {blogs.slice(0, 3).map((b) => (
                                <Link key={b.id} to={`/blog/${b.slug}`} className="group flex gap-4 rounded-2xl border border-border bg-card p-3 hover:-translate-y-0.5 transition-transform duration-300">
                                    <img src={b.image} alt={b.title} className="h-24 w-32 shrink-0 rounded-xl object-cover" />
                                    <div className="py-1">
                                        <span className="text-xs font-medium text-primary">{b.category}</span>
                                        <h3 className="font-head font-semibold text-foreground leading-snug mt-1 group-hover:text-primary transition-colors">{b.title}</h3>
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{b.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* CONTACT + MAP */}
            <div className="bg-secondary/40">
                <Section>
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div>
                            <SectionHeading eyebrow="Visit Us" title="Find our laboratory" center={false} />
                            <div className="space-y-4 text-foreground">
                                <div className="flex items-start gap-3"><MapPin size={22} weight="duotone" className="text-primary mt-0.5" /><span>{c?.address}</span></div>
                                <div className="flex items-start gap-3"><Phone size={22} weight="duotone" className="text-primary mt-0.5" /><span>{c?.phone}</span></div>
                                <div className="flex items-start gap-3"><Clock size={22} weight="duotone" className="text-primary mt-0.5" /><span>{c?.opening_hours}</span></div>
                            </div>
                            <div className="mt-6 flex gap-3">
                                <Button onClick={() => navigate("/appointment")} className="rounded-full">Book Appointment</Button>
                                <Button onClick={() => navigate("/contact")} variant="outline" className="rounded-full">Contact Us</Button>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-border shadow-lg h-[320px]">
                            <iframe title="Lab location" src={c?.map_embed} className="h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                        </div>
                    </div>
                </Section>
            </div>
        </>
    );
}
