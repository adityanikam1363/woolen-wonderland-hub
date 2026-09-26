import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { SiteLayout, SectionTitle } from "@/components/site/SiteLayout";
import { Features } from "@/components/site/Features";
import { ProductGrid } from "@/components/site/ProductGrid";
import { Button } from "@/components/ui/button";
import { fetchPublishedProducts } from "@/lib/products";
import { whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Woolen Decorations — Handmade Woolen Mats & Torans, Kolhapur" },
      { name: "description", content: "Handmade woolen rangoli mats, pooja mats, torans, door hangings and custom designs from Kolhapur. Ready to use and washable." },
      { property: "og:title", content: "Woolen Decorations — Handmade in Kolhapur" },
      { property: "og:description", content: "Handmade woolen rangoli mats, pooja mats, torans and custom designs." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data, isLoading } = useQuery({ queryKey: ["products", "latest"], queryFn: () => fetchPublishedProducts(6) });
  return (
    <SiteLayout>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-gold">Handmade with love in Kolhapur</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight text-primary md:text-6xl">
            Woolen decorations for every <span className="text-secondary italic">festival</span> & home
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Decoration mats, rangoli mats, pooja mats, torans, door hangings and custom-designed woolen pieces.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/products">View latest products</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-secondary text-secondary">
              <a href={whatsappLink("Hello, I would like to enquire about your woolen decorations.")} target="_blank" rel="noreferrer">
                Enquire on WhatsApp
              </a>
            </Button>
          </div>
        </div>
        <div className="rounded-xl border-4 border-gold p-2 shadow-xl">
          <img src={hero} alt="Handmade woolen rangoli mat" width={1600} height={1104} className="rounded-lg" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4"><Features /></section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <SectionTitle eyebrow="Fresh from our loom" title="Latest Products" />
        <ProductGrid products={data} loading={isLoading} />
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link to="/products">See all products</Link></Button>
        </div>
      </section>

      <section className="bg-secondary text-secondary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <h2 className="text-4xl font-bold text-gold">Want something made just for you?</h2>
          <p className="mt-3 opacity-90">Choose your colours, size and design — we handcraft it to order.</p>
          <Button asChild size="lg" className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90">
            <Link to="/custom-orders">Place a custom order</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
