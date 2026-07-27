import Seo from "@/components/site/Seo";
import { Section, SectionHeading } from "@/components/site/Primitives";
import { useContent } from "@/hooks/useContent";

const CONTENT = {
    privacy: {
        title: "Privacy Policy",
        eyebrow: "Legal",
        body: [
            ["Information We Collect", "We collect personal information such as your name, contact number, email, address and health-related details solely for the purpose of providing diagnostic services and delivering reports."],
            ["How We Use Your Data", "Your information is used to process bookings, collect samples, generate and deliver reports, and improve our services. We never sell your data to third parties."],
            ["Data Security", "We implement industry-standard security measures including encryption and access controls to protect your personal and health information."],
            ["Report Confidentiality", "All test reports are strictly confidential and accessible only to you via secure Patient ID and registered mobile verification."],
            ["Your Rights", "You may request access to, correction of, or deletion of your personal data at any time by contacting our support team."],
        ],
    },
    terms: {
        title: "Terms & Conditions",
        eyebrow: "Legal",
        body: [
            ["Acceptance of Terms", "By booking a test or using our services, you agree to these terms and conditions in full."],
            ["Services", "We provide pathology testing and home sample collection services. Report timelines are indicative and may vary for specialised tests."],
            ["Bookings & Payments", "Bookings are confirmed after verification by our team. Prices are subject to change and will be confirmed at the time of booking."],
            ["Sample Collection", "Patients must provide accurate information and follow preparation instructions. Incorrect preparation may affect results."],
            ["Liability", "While we ensure accuracy through strict quality control, results should be interpreted in consultation with a qualified physician."],
        ],
    },
    refund: {
        title: "Refund Policy",
        eyebrow: "Legal",
        body: [
            ["Cancellations", "Bookings can be cancelled free of charge before sample collection. Simply contact our support team."],
            ["Refund Eligibility", "Refunds are applicable if a test could not be performed due to lab-side issues or if the booking was cancelled before collection."],
            ["Refund Process", "Approved refunds are processed to the original payment method within 5-7 business days."],
            ["Non-Refundable Cases", "Tests already performed and reports generated are non-refundable."],
            ["Contact", "For any refund queries, please reach out to our support team with your Patient ID."],
        ],
    },
};

export default function Legal({ type }) {
    const { data: c } = useContent();
    const page = CONTENT[type];
    return (
        <>
            <Seo title={`${page.title} | ${c?.brand_name || "Shree Balaji Pathology Lab"}`} description={`${page.title} for Shree Balaji Pathology Lab.`} />
            <Section className="max-w-3xl">
                <SectionHeading eyebrow={page.eyebrow} title={page.title} center={false} />
                <div className="space-y-8">
                    {page.body.map(([h, p], i) => (
                        <div key={i}>
                            <h3 className="font-head font-semibold text-lg text-foreground">{i + 1}. {h}</h3>
                            <p className="mt-2 text-muted-foreground leading-relaxed">{p}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </>
    );
}
