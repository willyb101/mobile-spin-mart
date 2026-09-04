import type { Database } from "@/integrations/supabase/types";
import type { Product } from "@/lib/products";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type CouponRow = Database["public"]["Tables"]["coupons"]["Row"];
export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

/** Map a DB product row to the frontend Product shape. */
export function mapProduct(r: ProductRow): Product {
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    price: Number(r.price),
    oldPrice: r.old_price ? Number(r.old_price) : undefined,
    ram: r.ram,
    storage: r.storage,
    os: r.os as Product["os"],
    rating: Number(r.rating),
    reviews: r.reviews,
    stock: r.stock,
    tags: (r.tags ?? []) as Product["tags"],
    color: r.color ?? "",
    image: r.image ?? "",
    specs: (r.specs as { label: string; value: string }[]) ?? [],
    description: r.description ?? "",
  };
}

export type Review = {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  body: string;
  createdAt: string;
};

export function mapReview(r: ReviewRow): Review {
  return {
    id: r.id,
    productId: r.product_id,
    authorName: r.author_name ?? "Anonymous",
    rating: r.rating,
    body: r.body ?? "",
    createdAt: r.created_at,
  };
}

export type Coupon = {
  id: string;
  code: string;
  kind: "percent" | "shipping";
  value: number;
  label: string;
  active: boolean;
};

export function mapCoupon(r: CouponRow): Coupon {
  return {
    id: r.id,
    code: r.code,
    kind: r.kind as Coupon["kind"],
    value: Number(r.value),
    label: r.label ?? r.code,
    active: r.active,
  };
}

/** Create a server-side publishable Supabase client for public reads. */
export function makePublishableClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createPublishableClient(url, key);
}

// imported lazily by callers via this helper to keep bundle clean
import { createClient } from "@supabase/supabase-js";

export function createPublishableClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        // New opaque sb_ keys are not JWTs — send apikey only, no bearer.
        if (key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) {
          if (headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}
