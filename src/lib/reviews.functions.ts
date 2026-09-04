import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { makePublishableClient, mapReview, type Review } from "@/lib/db";

/** Public: approved reviews for a product. */
export const listReviews = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ productId: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = makePublishableClient();
    const { data: rows } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", data.productId)
    .order("created_at", { ascending: false });
    return (rows ?? []).map(mapReview) as Review[];
  });

/** Authed: submit a review (held for approval). */
export const addReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      body: z.string().min(3).max(1000),
      authorName: z.string().min(1).max(80).optional(),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("reviews").insert({
      product_id: data.productId,
      user_id: context.userId,
      rating: data.rating,
      body: data.body,
      author_name: data.authorName ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
