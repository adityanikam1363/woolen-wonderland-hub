import { Sparkles, Droplets, Ruler, Palette } from "lucide-react";

const FEATURES = [
  { icon: Sparkles, title: "Ready to Use", text: "Place it and decorate instantly." },
  { icon: Droplets, title: "Washable", text: "Easy care, lasts festival after festival." },
  { icon: Ruler, title: "Price Depends on Size", text: "Tell us your size for an exact price." },
  { icon: Palette, title: "Custom Orders Available", text: "Your colours, your design, your name." },
];

export function Features() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {FEATURES.map((f) => (
        <div key={f.title} className="rounded-lg border-2 border-gold/50 bg-card p-5 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-secondary text-gold">
            <f.icon className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-xl font-bold text-primary">{f.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
        </div>
      ))}
    </div>
  );
}
