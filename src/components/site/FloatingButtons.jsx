import { useEffect, useState } from "react";
import { WhatsappLogo, Phone, ArrowUp } from "@phosphor-icons/react";
import { useContent } from "@/hooks/useContent";

export default function FloatingButtons() {
    const { data: c } = useContent();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 400);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const wa = (c?.whatsapp || "").replace(/[^0-9]/g, "");
    const phone = (c?.phone || "").replace(/[^0-9+]/g, "");

    return (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
            {show && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    data-testid="back-to-top"
                    className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform duration-200"
                    aria-label="Back to top"
                >
                    <ArrowUp size={20} weight="bold" />
                </button>
            )}
            <a
                href={`tel:${phone}`}
                data-testid="floating-call"
                className="grid h-13 w-13 h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl hover:scale-110 transition-transform duration-200"
                aria-label="Call now"
            >
                <Phone size={26} weight="fill" />
            </a>
            <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                data-testid="floating-whatsapp"
                className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform duration-200 animate-float"
                aria-label="WhatsApp"
            >
                <WhatsappLogo size={28} weight="fill" />
            </a>
        </div>
    );
}
