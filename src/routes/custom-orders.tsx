import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, SectionTitle } from "@/components/site/SiteLayout";
import { CustomOrderForm } from "@/components/site/CustomOrderForm";

export const Route = createFileRoute("/custom-orders")({
  head: () => ({
    meta: [
      { title: "Custom Orders — Woolen Decorations" },
      { name: "description", content: "Order custom-designed woolen mats, torans and door hangings in your colours and size." },
      { property: "og:title", content: "Custom Woolen Orders — Woolen Decorations" },
      { property: "og:description", content: "Your colours, your size, handmade to order in Kolhapur." },
    ],
  }),
  component: CustomOrders,
});

const STEPS = [
  ["Share your idea", "Tell us the product, size, colours and occasion."],
  ["Get a quote", "Price depends on size — we confirm on call or WhatsApp."],
  ["Handmade for you", "We craft it by hand and let you know when it's ready."],
];

function CustomOrders() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <SectionTitle eyebrow="Made just for you" title="Custom Orders" />
        <div className="mb-10 grid gap-4 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <div key={t} className="rounded-lg bg-card p-5 border">
              <span className="font-display text-4xl font-bold text-gold">0{i + 1}</span>
              <h3 className="text-xl font-bold text-primary">{t}</h3>
              <p className="text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <CustomOrderForm />
      </section>
    </SiteLayout>
  );
}
