import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { List, X, Sun, Moon, Phone } from "@phosphor-icons/react";
import { useTheme } from "@/context/ThemeContext";
import { useContent } from "@/hooks/useContent";
import { Button } from "@/components/ui/button";

const NAV = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/services", label: "Services" },
    { to: "/tests", label: "Tests & Prices" },
    { to: "/packages", label: "Packages" },
    { to: "/gallery", label: "Gallery" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
];

export default function Header() {
    const { theme, toggle } = useTheme();
    const { data: content } = useContent();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <header className="sticky top-0 z-50 glass" data-testid="site-header">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-[72px] items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2.5" data-testid="brand-logo">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground font-head font-bold text-lg">
                            SB
                        </div>
                        <div className="leading-tight">
                            <div className="font-head font-bold text-[15px] text-foreground">
                                {content?.brand_name || "Shree Balaji"}
                            </div>
                            <div className="text-[11px] text-muted-foreground">Pathology Lab</div>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {NAV.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                data-testid={`nav-${n.label.toLowerCase().replace(/[^a-z]/g, "")}`}
                                className={({ isActive }) =>
                                    `rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                                        isActive
                                            ? "bg-secondary text-primary"
                                            : "text-muted-foreground hover:text-primary hover:bg-secondary/60"
                                    }`
                                }
                            >
                                {n.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggle}
                            data-testid="theme-toggle"
                            className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-primary transition-colors duration-200"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun size={20} weight="duotone" /> : <Moon size={20} weight="duotone" />}
                        </button>
                        <Button
                            onClick={() => navigate("/appointment")}
                            data-testid="header-book-btn"
                            className="hidden sm:inline-flex rounded-full bg-primary hover:bg-primary/90 font-semibold"
                        >
                            Book Test
                        </Button>
                        <button
                            onClick={() => setOpen((o) => !o)}
                            data-testid="mobile-menu-toggle"
                            className="lg:hidden grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-secondary"
                            aria-label="Menu"
                        >
                            {open ? <X size={22} /> : <List size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {open && (
                <div className="lg:hidden border-t border-border bg-background px-4 py-4 space-y-1" data-testid="mobile-menu">
                    {NAV.map((n) => (
                        <NavLink
                            key={n.to}
                            to={n.to}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                `block rounded-lg px-4 py-3 text-sm font-medium ${
                                    isActive ? "bg-secondary text-primary" : "text-foreground"
                                }`
                            }
                        >
                            {n.label}
                        </NavLink>
                    ))}
                    <Button onClick={() => { setOpen(false); navigate("/appointment"); }} className="w-full rounded-full mt-2">
                        Book Appointment
                    </Button>
                </div>
            )}
        </header>
    );
}
