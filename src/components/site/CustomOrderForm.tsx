import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CATEGORIES, whatsappLink } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  phone: z.string().trim().min(5, "Please enter a valid phone").max(20),
  product_type: z.string().max(50),
  size: z.string().trim().max(100),
  message: z.string().trim().max(2000),
});

export function CustomOrderForm() {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", product_type: CATEGORIES[0], size: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.from("custom_orders").insert(parsed.data);
    setBusy(false);
    if (error) return toast.error("Could not send. Please try WhatsApp.");
    toast.success("Thank you! We will contact you soon.");
    const d = parsed.data;
    window.open(
      whatsappLink(`Custom order request\nName: ${d.name}\nPhone: ${d.phone}\nProduct: ${d.product_type}\nSize: ${d.size}\n${d.message}`),
      "_blank",
    );
    setForm({ name: "", phone: "", product_type: CATEGORIES[0], size: "", message: "" });
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border-2 border-gold/50 bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><Label htmlFor="n">Your name</Label><Input id="n" value={form.name} onChange={set("name")} required /></div>
        <div><Label htmlFor="p">Phone / WhatsApp</Label><Input id="p" type="tel" value={form.phone} onChange={set("phone")} required /></div>
        <div>
          <Label htmlFor="t">Product type</Label>
          <select id="t" value={form.product_type} onChange={set("product_type")} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><Label htmlFor="s">Size (e.g. 2 x 2 ft)</Label><Input id="s" value={form.size} onChange={set("size")} /></div>
      </div>
      <div><Label htmlFor="m">Design details, colours, occasion</Label><Textarea id="m" rows={4} value={form.message} onChange={set("message")} /></div>
      <Button type="submit" disabled={busy} className="w-full">{busy ? "Sending…" : "Send custom order request"}</Button>
    </form>
  );
}
