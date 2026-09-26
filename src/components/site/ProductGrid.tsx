import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

export function ProductGrid({ products, loading }: { products?: Product[] | undefined; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }
  if (!products?.length) {
    return (
      <p className="rounded-lg border border-dashed bg-card p-10 text-center text-muted-foreground">
        New handmade products are coming soon. Message us on WhatsApp to see the latest designs.
      </p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <article key={p.id} className="group overflow-hidden rounded-lg border-2 border-gold/40 bg-card shadow-sm">
          <div className="aspect-square overflow-hidden bg-muted">
            {p.image_url && (
              <img
                src={p.image_url}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            )}
          </div>
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{p.category}</p>
            <h3 className="mt-1 text-2xl font-bold text-primary">{p.name}</h3>
            {p.description && <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{p.description}</p>}
            <a
              href={whatsappLink(`Hello, I am interested in "${p.name}". Please share price and sizes.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
