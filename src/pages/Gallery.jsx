import { useState } from "react";
import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";
import { useCollection } from "@/hooks/useContent";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Gallery() {
    const { data: gallery = [] } = useCollection("gallery");
    const [active, setActive] = useState(null);
    return (
        <>
            <Seo title="Gallery | Shree Balaji Pathology Lab" description="Take a virtual tour of our modern, hygienic pathology laboratory and equipment." />
            <Section>
                <SectionHeading eyebrow="Gallery" title="Inside our laboratory" subtitle="A glimpse of our modern facilities and state-of-the-art equipment." />
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                    {gallery.map((g) => (
                        <button key={g.id} onClick={() => setActive(g)} data-testid={`gallery-item-${g.id}`} className="group block w-full overflow-hidden rounded-2xl border border-border">
                            <div className="relative">
                                <img src={g.image_url} alt={g.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="font-head font-semibold text-white">{g.title}</div>
                                    <div className="text-xs text-white/80">{g.description}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </Section>
            <Dialog open={!!active} onOpenChange={() => setActive(null)}>
                <DialogContent className="max-w-3xl p-0 overflow-hidden">
                    {active && (
                        <div>
                            <img src={active.image_url} alt={active.title} className="w-full object-contain max-h-[70vh]" />
                            <div className="p-5">
                                <h3 className="font-head font-semibold text-lg text-foreground">{active.title}</h3>
                                <p className="text-sm text-muted-foreground">{active.description}</p>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
