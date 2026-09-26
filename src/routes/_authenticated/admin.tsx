import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus, LogOut, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BUCKET, fetchAllProducts, uploadProductImage, type Product } from "@/lib/products";
import { CATEGORIES } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Owner Dashboard — Woolen Decorations" },
      { name: "description", content: "Manage products for Woolen Decorations." },
      { property: "og:title", content: "Owner Dashboard — Woolen Decorations" },
      { property: "og:description", content: "Owner-only product management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Draft = { id?: string; name: string; description: string; category: string; published: boolean; image_path: string | null; image_url: string | null };
const empty: Draft = { name: "", description: "", category: CATEGORIES[0]!, published: true, image_path: null, image_url: null };

function Admin() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const owner = useQuery({
    queryKey: ["is-owner"],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("claim_owner");
      if (error) throw error;
      return data as boolean;
    },
  });
  const products = useQuery({ queryKey: ["admin-products"], queryFn: fetchAllProducts, enabled: owner.data === true });
  const orders = useQuery({
    queryKey: ["admin-orders"],
    enabled: owner.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("custom_orders").select("*").order("created_at", { ascending: false }).limit(50);
      if (error) throw error;
      return data;
    },
  });

  const [draft, setDraft] = useState<Draft>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  async function signOut() {
    await supabase.auth.signOut();
    qc.clear();
    nav({ to: "/" });
  }

  function pick(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.name.trim()) { toast.error("Please add a product name"); return; }
    if (!draft.id && !file) { toast.error("Please choose a photo"); return; }
    setBusy(true);
    try {
      let image_path = draft.image_path;
      if (file) {
        image_path = await uploadProductImage(file);
        if (draft.image_path) await supabase.storage.from(BUCKET).remove([draft.image_path]);
      }
      const row = { name: draft.name.trim(), description: draft.description.trim(), category: draft.category, published: draft.published, image_path };
      const { error } = draft.id
        ? await supabase.from("products").update(row).eq("id", draft.id)
        : await supabase.from("products").insert(row);
      if (error) throw error;
      toast.success(draft.id ? "Product updated" : "Product added");
      setDraft(empty);
      pick(null);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    if (p.image_path) await supabase.storage.from(BUCKET).remove([p.image_path]);
    toast.success("Deleted");
    refresh();
  }

  async function togglePublish(p: Product) {
    const { error } = await supabase.from("products").update({ published: !p.published }).eq("id", p.id);
    if (error) { toast.error(error.message); return; }
    refresh();
  }

  if (owner.isLoading) return <p className="p-10 text-center">Checking access…</p>;
  if (!owner.data) {
    return (
      <div className="mx-auto max-w-md p-10 text-center">
        <h1 className="text-3xl font-bold text-primary">Access denied</h1>
        <p className="mt-2 text-muted-foreground">This dashboard is for the shop owner only.</p>
        <Button className="mt-4" onClick={signOut}>Sign out</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <h1 className="text-2xl font-bold text-gold">Owner Dashboard</h1>
          <div className="flex items-center gap-3 text-sm">
            <Link to="/products" className="hover:text-gold">View site</Link>
            <button onClick={signOut} className="flex items-center gap-1 hover:text-gold"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <form onSubmit={save} className="h-fit space-y-4 rounded-lg border-2 border-gold/50 bg-card p-5 lg:sticky lg:top-4">
          <h2 className="text-2xl font-bold text-primary">{draft.id ? "Edit product" : "Add new product"}</h2>
          <label className="block cursor-pointer">
            <div className="grid aspect-square place-items-center overflow-hidden rounded-md border-2 border-dashed bg-muted">
              {preview || draft.image_url ? (
                <img src={preview ?? draft.image_url!} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground"><ImagePlus className="mx-auto h-10 w-10" /><p className="text-sm">Tap to upload photo</p></div>
              )}
            </div>
            <input type="file" accept="image/*" className="sr-only" aria-label="Product photo" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
            {draft.id && <span className="mt-1 block text-xs text-muted-foreground">Tap image to replace it</span>}
          </label>
          <div><Label htmlFor="pn">Product name</Label><Input id="pn" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} maxLength={120} /></div>
          <div>
            <Label htmlFor="pc">Category</Label>
            <select id="pc" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className="h-9 w-full rounded-md border bg-background px-3 text-sm">
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div><Label htmlFor="pd">Description</Label><Textarea id="pd" rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={1000} /></div>
          <div className="flex items-center gap-2"><Switch id="pp" checked={draft.published} onCheckedChange={(v) => setDraft({ ...draft, published: v })} /><Label htmlFor="pp">Published (visible on website)</Label></div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy} className="flex-1">{busy ? "Saving…" : draft.id ? "Save changes" : "Publish product"}</Button>
            {draft.id && <Button type="button" variant="outline" onClick={() => { setDraft(empty); pick(null); }}>Cancel</Button>}
          </div>
        </form>

        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-primary">Your products ({products.data?.length ?? 0})</h2>
            {products.isLoading ? <p>Loading…</p> : !products.data?.length ? (
              <p className="text-muted-foreground">No products yet. Add your first one.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {products.data.map((p) => (
                  <div key={p.id} className="overflow-hidden rounded-lg border bg-card">
                    <div className="aspect-square bg-muted">{p.image_url && <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />}</div>
                    <div className="space-y-2 p-3">
                      <p className="font-semibold">{p.name}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <Switch checked={p.published} onCheckedChange={() => togglePublish(p)} />
                        {p.published ? "Published" : "Hidden"}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setDraft({ ...p }); pick(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}><Pencil className="h-4 w-4" /> Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-primary">Custom order requests</h2>
            {!orders.data?.length ? <p className="text-muted-foreground">No requests yet.</p> : (
              <div className="space-y-3">
                {orders.data.map((o) => (
                  <div key={o.id} className="rounded-lg border bg-card p-4 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <strong>{o.name}</strong>
                      <a href={`tel:${o.phone}`} className="text-secondary underline">{o.phone}</a>
                    </div>
                    <p className="text-muted-foreground">{o.product_type} · {o.size || "size not given"} · {new Date(o.created_at).toLocaleDateString()}</p>
                    {o.message && <p className="mt-1 whitespace-pre-line">{o.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
