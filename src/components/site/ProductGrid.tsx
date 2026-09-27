import { MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
        <Dialog key={p.id}>
          <article className="group overflow-hidden rounded-lg border-2 border-gold/40 bg-card shadow-sm">
            <DialogTrigger asChild>
              <button type="button" className="block w-full text-left">
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
                  <span className="mt-2 inline-block text-sm font-semibold text-secondary">View details</span>
                </div>
              </button>
            </DialogTrigger>
            <a
              href={whatsappLink(`Hello, I am interested in "${p.name}". Please share price and sizes.`)}
              target="_blank"
              rel="noreferrer"
              className="mx-4 mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
            </a>
          </article>
          <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
            <div className="grid gap-5 sm:grid-cols-2 sm:items-start">
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="aspect-square w-full rounded-md object-cover" />
              )}
              <div className="space-y-4">
                <DialogHeader>
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary">{p.category}</p>
                  <DialogTitle className="text-2xl font-bold text-primary">{p.name}</DialogTitle>
                  <DialogDescription className="whitespace-pre-line">
                    {p.description || "Contact us to learn more about this product."}
                  </DialogDescription>
                </DialogHeader>
                <a
                  href={whatsappLink(`Hello, I am interested in "${p.name}". Please share price and sizes.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
