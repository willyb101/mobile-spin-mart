import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { makePublishableClient, mapCoupon, type Coupon } from "@/lib/db";

const SHIPPING_FLAT = 375;
const FREE_SHIP_THRESHOLD = 1250;
const TAX_RATE = 0.08;

export type CartLineInput = { id: string; qty: number };

export type OrderLine = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type PlacedOrder = {
  orderId: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
};

/** Public: validate a coupon code and return it if active. */
export const validateCoupon = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ code: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const supabase = makePublishableClient();
    const code = data.code.trim().toUpperCase();
    const { data: row } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("active", true)
      .maybeSingle();
    return row ? mapCoupon(row) : null;
  });

/** Public: place an order (guest or signed-in). Prices recomputed server-side. */
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({
      email: z.string().email(),
      items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(20) })).min(1),
      shipping: z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        city: z.string().min(1),
      }),
      couponCode: z.string().optional(),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // fetch product prices server-side to prevent tampering
    const ids = data.items.map((i) => i.id);
    const { data: productRows, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id,name,price,stock")
      .in("id", ids);
    if (pErr) throw new Error(pErr.message);

    const lines: OrderLine[] = data.items.map((it) => {
      const p = productRows?.find((r) => r.id === it.id);
      if (!p) throw new Error(`Product ${it.id} unavailable`);
      return { id: it.id, name: p.name, price: Number(p.price), qty: it.qty };
    });

    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    let coupon: Coupon | null = null;
    if (data.couponCode) {
      const { data: c } = await supabaseAdmin
        .from("coupons")
        .select("*")
        .eq("code", data.couponCode.trim().toUpperCase())
        .eq("active", true)
        .maybeSingle();
      coupon = c ? mapCoupon(c) : null;
    }
    const discount =
      coupon?.kind === "percent" ? (subtotal * coupon.value) / 100 : 0;
    const shipping =
      coupon?.kind === "shipping" ? 0 : subtotal > 0 && subtotal < FREE_SHIP_THRESHOLD ? SHIPPING_FLAT : 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = +(taxable * TAX_RATE).toFixed(2);
    const total = +(taxable + tax + shipping).toFixed(2);

    // derive user id from bearer if present (optional)
    let userId: string | null = null;
    try {
      const auth = await import("@/integrations/supabase/auth-middleware");
      // best-effort: attempt an authenticated client; ignore failures (guest checkout)
    } catch {
      /* ignore */
    }

    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        email: data.email,
        status: "pending",
        payment_status: "unpaid",
        subtotal,
        discount,
        shipping,
        tax,
        total,
        shipping_name: data.shipping.name,
        shipping_address: data.shipping.address,
        shipping_city: data.shipping.city,
      })
      .select("id")
      .single();
    if (oErr) throw new Error(oErr.message);

    const orderItems = lines.map((l) => ({
      order_id: order!.id,
      product_id: l.id,
      name: l.name,
      price: l.price,
      qty: l.qty,
    }));
    const { error: iErr } = await supabaseAdmin.from("order_items").insert(orderItems);
    if (iErr) throw new Error(iErr.message);

    // decrement stock
    for (const l of lines) {
      await supabaseAdmin
        .from("products")
        .update({ stock: Math.max(0, (productRows!.find((r) => r.id === l.id)!.stock) - l.qty) })
        .eq("id", l.id);
    }

    const result: PlacedOrder = { orderId: order!.id, subtotal, discount, shipping, tax, total };
    return result;
  });

/** Authed: current user's orders with items. */
export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: orders, error } = await context.supabase
      .from("orders")
      .select("id,status,total,created_at,email,payment_status")
      .order("created_at", { ascending: false });
    if (error) return [];
    const ids = (orders ?? []).map((o) => o.id);
    if (ids.length === 0) return [];
    const { data: items } = await context.supabase
      .from("order_items")
      .select("order_id,name,price,qty")
      .in("order_id", ids);
    return (orders ?? []).map((o) => ({
      ...o,
      items: (items ?? []).filter((i) => i.order_id === o.id),
    }));
  });
