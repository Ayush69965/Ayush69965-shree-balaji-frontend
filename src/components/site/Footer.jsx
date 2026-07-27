import { Link } from "react-router-dom";
import { Phone, EnvelopeSimple, MapPin, Clock, FacebookLogo, InstagramLogo, TwitterLogo, YoutubeLogo } from "@phosphor-icons/react";
import { useContent } from "@/hooks/useContent";

const cols = [
    { title: "Company", links: [["About Us", "/about"], ["Our Services", "/services"], ["Gallery", "/gallery"], ["Blog", "/blog"]] },
    { title: "Patients", links: [["Book Appointment", "/appointment"], ["Home Collection", "/home-collection"], ["Download Report", "/report"], ["Health Packages", "/packages"]] },
    { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms & Conditions", "/terms"], ["Refund Policy", "/refund"], ["FAQs", "/faqs"]] },
];

export default function Footer() {
    const { data: c } = useContent();
    const social = c?.social || {};
    return (
        <footer className="relative mt-24 bg-primary text-primary-foreground" data-testid="site-footer">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 font-head font-bold">SB</div>
                            <div>
                                <div className="font-head font-bold text-lg">{c?.brand_name || "Shree Balaji Pathology Lab"}</div>
                                <div className="text-xs text-white/70">{c?.tagline || "Accurate Reports. Trusted Care."}</div>
                            </div>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed max-w-sm">
                            NABL-accredited diagnostic centre committed to accurate, affordable and timely pathology services with free home sample collection.
                        </p>
                        <div className="flex gap-3 mt-6">
                            {social.facebook && <a href={social.facebook} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><FacebookLogo size={18} weight="fill" /></a>}
                            {social.instagram && <a href={social.instagram} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><InstagramLogo size={18} weight="fill" /></a>}
                            {social.twitter && <a href={social.twitter} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><TwitterLogo size={18} weight="fill" /></a>}
                            {social.youtube && <a href={social.youtube} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"><YoutubeLogo size={18} weight="fill" /></a>}
                        </div>
                    </div>

                    {cols.map((col) => (
                        <div key={col.title}>
                            <h4 className="font-head font-semibold mb-4 text-sm uppercase tracking-wider text-white/90">{col.title}</h4>
                            <ul className="space-y-2.5">
                                {col.links.map(([label, to]) => (
                                    <li key={to}>
                                        <Link to={to} className="text-sm text-white/70 hover:text-white transition-colors">{label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10 pt-8 text-sm text-white/80">
                    <div className="flex items-start gap-2.5"><Phone size={18} weight="duotone" className="mt-0.5 shrink-0" /><span>{c?.phone}</span></div>
                    <div className="flex items-start gap-2.5"><EnvelopeSimple size={18} weight="duotone" className="mt-0.5 shrink-0" /><span>{c?.email}</span></div>
                    <div className="flex items-start gap-2.5"><MapPin size={18} weight="duotone" className="mt-0.5 shrink-0" /><span>{c?.address}</span></div>
                    <div className="flex items-start gap-2.5"><Clock size={18} weight="duotone" className="mt-0.5 shrink-0" /><span>{c?.opening_hours}</span></div>
                </div>
            </div>
            <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
                © {new Date().getFullYear()} {c?.brand_name || "Shree Balaji Pathology Lab"}. All rights reserved. · <Link to="/admin" className="hover:text-white">Admin</Link>
            </div>
        </footer>
    );
}
