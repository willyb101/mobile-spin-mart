import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { makePublishableClient, mapProduct } from "@/lib/db";
import type { Product } from "@/lib/products";

/** Authed: list current user's wishlist products. */
export const listWishlist = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabase = makePublishableClient();
    const { data: rows } = await context.supabase
      .from("wishlist")
      .select("product_id");
    const ids = (rows ?? []).map((r) => r.product_id);
    if (ids.length === 0) return [] as Product[];
    const { data: products } = await supabase.from("products").select("*").in("id", ids);
    return (products ?? []).map(mapProduct);
  });

/** Authed: toggle a product in the wishlist. Returns true if added. */
export const toggleWishlist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ productId: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing } = await context.supabase
      .from("wishlist")
      .select("id")
      .eq("product_id", data.productId)
      .maybeSingle();
    if (existing) {
      await context.supabase.from("wishlist").delete().eq("id", existing.id);
      return { added: false };
    }
    const { error } = await context.supabase
      .from("wishlist")
      .insert({ user_id: context.userId, product_id: data.productId });
    if (error) throw new Error(error.message);
    return { added: true };
  });
