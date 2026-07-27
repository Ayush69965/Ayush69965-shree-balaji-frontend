import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "@phosphor-icons/react";
import api from "@/lib/api";
import Seo from "@/components/site/Seo";
import { Section } from "@/components/site/Primitives";

export default function BlogPost() {
    const { slug } = useParams();
    const { data: b, isLoading } = useQuery({
        queryKey: ["blog", slug],
        queryFn: async () => (await api.get(`/blogs/${slug}`)).data,
    });

    if (isLoading) return <Section><div className="animate-pulse text-muted-foreground">Loading…</div></Section>;
    if (!b) return <Section><p>Article not found.</p></Section>;

    return (
        <>
            <Seo title={b.meta_title || b.title} description={b.meta_description || b.excerpt} />
            <Section className="max-w-3xl">
                <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mb-6"><ArrowLeft size={16} /> Back to Blog</Link>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{b.category}</span>
                <h1 className="mt-3 font-head text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{b.title}</h1>
                <img src={b.image} alt={b.title} className="mt-8 w-full rounded-2xl object-cover aspect-[16/9]" />
                <div className="mt-8 prose max-w-none text-foreground leading-relaxed whitespace-pre-line text-lg">{b.content}</div>
            </Section>
        </>
    );
}
