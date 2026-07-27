import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useCollection } from "@/hooks/useContent";

export default function Faqs() {
    const { data: faqs = [] } = useCollection("faqs");
    return (
        <>
            <Seo title="FAQs | Shree Balaji Pathology Lab" description="Answers to common questions about our tests, home collection, reports and services." />
            <Section className="max-w-3xl">
                <SectionHeading eyebrow="FAQs" title="Frequently asked questions" />
                <Accordion type="single" collapsible className="space-y-3">
                    {faqs.map((f) => (
                        <AccordionItem key={f.id} value={f.id} className="rounded-xl border border-border bg-card px-5" data-testid={`faq-${f.id}`}>
                            <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">{f.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Section>
        </>
    );
}
