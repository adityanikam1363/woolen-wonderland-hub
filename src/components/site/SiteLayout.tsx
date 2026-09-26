import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, MapPin, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { BUSINESS, whatsappLink } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/custom-orders", label: "Custom Orders" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-secondary text-secondary-foreground text-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5">
          <a href={`tel:${BUSINESS.phoneTel}`} className="flex items-center gap-1.5 hover:text-gold">
            <Phone className="h-3.5 w-3.5" /> {BUSINESS.phoneDisplay}
          </a>
          <span className="hidden sm:inline">Handmade in Kolhapur · Custom orders welcome</span>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full border-2 border-gold bg-primary font-display text-xl font-bold text-primary-foreground">
              W
            </span>
            <span className="font-display text-2xl font-bold leading-none text-primary">
              Woolen <span className="text-secondary">Decorations</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-foreground/80 hover:text-primary"
                activeProps={{ className: "text-primary font-semibold" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col border-t px-4 py-2 md:hidden">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2">
                {n.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="border-motif" />
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-primary text-primary-foreground">
        <div className="border-motif" />
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <h3 className="text-2xl font-bold text-gold">{BUSINESS.name}</h3>
            <p className="mt-2 text-sm opacity-90">
              Handmade woolen decoration mats, rangoli mats, pooja mats, torans and door hangings.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <a href={`tel:${BUSINESS.phoneTel}`} className="flex items-center gap-2 hover:text-gold">
              <Phone className="h-4 w-4" /> {BUSINESS.phoneDisplay}
            </a>
            <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="flex gap-2 hover:text-gold">
              <MapPin className="h-4 w-4 shrink-0" /> {BUSINESS.address}
            </a>
          </div>
          <div className="text-sm md:text-right">
            <Link to="/auth" className="opacity-70 hover:text-gold">Owner login</Link>
            <p className="mt-2 opacity-70">© {new Date().getFullYear()} {BUSINESS.name}</p>
          </div>
        </div>
      </footer>

      <a
        href={whatsappLink("Hello Woolen Decorations, I would like to enquire about your products.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-whatsapp px-4 py-3 font-semibold text-primary-foreground shadow-lg hover:scale-105 transition"
      >
        <MessageCircle className="h-5 w-5" /> <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
      <h2 className="mt-1 text-4xl font-bold text-primary md:text-5xl">{title}</h2>
      <div className="mx-auto mt-3 h-0.5 w-24 bg-gold" />
    </div>
  );
}
