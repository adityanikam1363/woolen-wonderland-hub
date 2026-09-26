import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout, SectionTitle } from "@/components/site/SiteLayout";
import { ProductGrid } from "@/components/site/ProductGrid";
import { fetchPublishedProducts } from "@/lib/products";
import { CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Latest Products — Woolen Decorations" },
      { name: "description", content: "Browse our newest handmade woolen rangoli mats, pooja mats, torans and door hangings." },
      { property: "og:title", content: "Latest Products — Woolen Decorations" },
      { property: "og:description", content: "Newest handmade woolen decorations from Kolhapur." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["products", "all"], queryFn: () => fetchPublishedProducts() });
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? data : data?.filter((p) => p.category === cat);
  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle eyebrow="Our collection" title="Latest Products" />
        <p className="-mt-4 mb-6 text-center text-muted-foreground">Price depends on size — enquire on WhatsApp for rates.</p>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-sm ${cat === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-gold"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <ProductGrid products={list} loading={isLoading} />
      </section>
    </SiteLayout>
  );
}
