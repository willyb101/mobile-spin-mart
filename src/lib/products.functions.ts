import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { makePublishableClient, mapProduct } from "@/lib/db";
import type { Product } from "@/lib/products";

/** Public: list all products. */
export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = makePublishableClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) return [] as Product[];
  return (data ?? []).map(mapProduct);
});

/** Public: single product by id. */
export const getProductFn = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = makePublishableClient();
    const { data: row } = await supabase.from("products").select("*").eq("id", data.id).maybeSingle();
    return row ? mapProduct(row) : null;
  });

/** Public: related products (same brand or OS). */
export const getRelatedFn = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = makePublishableClient();
    const { data: p } = await supabase.from("products").select("*").eq("id", data.id).maybeSingle();
    if (!p) return [] as Product[];
    const { data: rows } = await supabase
      .from("products")
      .select("*")
      .neq("id", data.id)
      .or(`brand.eq.${p.brand},os.eq.${p.os}`)
      .limit(4);
    return (rows ?? []).map(mapProduct);
  });
