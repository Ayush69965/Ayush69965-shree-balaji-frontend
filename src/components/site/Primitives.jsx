import { motion } from "framer-motion";

export const Section = ({ children, className = "", id }) => (
    <section id={id} className={`mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 ${className}`}>
        {children}
    </section>
);

export const SectionHeading = ({ eyebrow, title, subtitle, center = true }) => (
    <div className={`max-w-2xl mb-12 ${center ? "mx-auto text-center" : ""}`}>
        {eyebrow && (
            <span className="inline-block rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                {eyebrow}
            </span>
        )}
        <h2 className="font-head text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
    </div>
);

export const FadeIn = ({ children, delay = 0, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);
