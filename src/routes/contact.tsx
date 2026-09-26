import { createFileRoute } from "@tanstack/react-router";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLayout, SectionTitle } from "@/components/site/SiteLayout";
import { BUSINESS, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Woolen Decorations, Kolhapur" },
      { name: "description", content: "Call, WhatsApp or visit Woolen Decorations at Kasaba Bawada, Kolhapur." },
      { property: "og:title", content: "Contact Woolen Decorations" },
      { property: "og:description", content: "Call +91 878 828 6161 or visit us in Kasaba Bawada, Kolhapur." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const cards = [
    { icon: Phone, title: "Call us", text: BUSINESS.phoneDisplay, href: `tel:${BUSINESS.phoneTel}` },
    { icon: MessageCircle, title: "WhatsApp", text: "Chat with us", href: whatsappLink("Hello Woolen Decorations!") },
    { icon: MapPin, title: "Visit us", text: BUSINESS.address, href: BUSINESS.mapsUrl },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle eyebrow="We'd love to hear from you" title="Contact Us" />
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <a key={c.title} href={c.href} target={c.href.startsWith("tel") ? undefined : "_blank"} rel="noreferrer"
              className="rounded-lg border-2 border-gold/50 bg-card p-6 text-center hover:border-primary transition">
              <c.icon className="mx-auto h-8 w-8 text-secondary" />
              <h3 className="mt-2 text-2xl font-bold text-primary">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </a>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border-2 border-gold">
          <iframe
            title="Map"
            src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.address)}&output=embed`}
            className="h-80 w-full"
            loading="lazy"
          />
        </div>
        <p className="mt-3 text-center">
          <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="font-semibold text-secondary underline">Open in Google Maps</a>
        </p>
      </section>
    </SiteLayout>
  );
}
