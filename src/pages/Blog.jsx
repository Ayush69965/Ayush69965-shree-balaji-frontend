import { Link } from "react-router-dom";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading, FadeIn } from "@/components/site/Primitives";
import { useCollection } from "@/hooks/useContent";

export default function Blog() {
    const { data: blogs = [] } = useCollection("blogs");
    return (
        <>
            <Seo title="Health Blog | Shree Balaji Pathology Lab" description="Health tips, awareness articles and diagnostic insights from our medical experts." />
            <Section>
                <SectionHeading eyebrow="Blog" title="Health tips & insights" subtitle="Expert-written articles to help you stay informed and healthy." />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((b, i) => (
                        <FadeIn key={b.id} delay={i * 0.06}>
                            <Link to={`/blog/${b.slug}`} className="group flex flex-col h-full overflow-hidden rounded-2xl border border-border bg-card hover:-translate-y-1 hover:shadow-lg transition-all duration-300" data-testid={`blog-card-${b.slug}`}>
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img src={b.image} alt={b.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <span className="text-xs font-semibold text-primary">{b.category}</span>
                                    <h3 className="mt-2 font-head font-semibold text-lg text-foreground leading-snug group-hover:text-primary transition-colors">{b.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{b.excerpt}</p>
                                    <span className="mt-4 text-sm font-medium text-primary">Read more →</span>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </Section>
        </>
    );
}
