import { supabase } from "@/integrations/supabase/client";

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  image_path: string | null;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export const BUCKET = "product-images";

async function withImageUrls(rows: Product[]): Promise<Product[]> {
  const paths = rows.map((r) => r.image_path).filter(Boolean) as string[];
  if (!paths.length) return rows;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return rows.map((r) => ({ ...r, image_url: r.image_path ? (map.get(r.image_path) ?? null) : null }));
}

/** Published products, newest first (RLS hides unpublished rows from visitors). */
export async function fetchPublishedProducts(limit?: number): Promise<Product[]> {
  let q = supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return withImageUrls((data ?? []) as Product[]);
}

/** All products for the owner dashboard. */
export async function fetchAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return withImageUrls((data ?? []) as Product[]);
}

export async function uploadProductImage(file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return path;
}
