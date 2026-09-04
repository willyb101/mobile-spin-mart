import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { makePublishableClient, mapProduct, mapCoupon } from "@/lib/db";

/** Throw if the caller is not an admin. */
async function assertAdmin(context: { supabase: ReturnType<typeof makePublishableClient>; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin role required");
}

// ---------- Dashboard metrics ----------

export type AdminMetrics = {
  revenue: number;
  orders: number;
  users: number;
  products: number;
  pendingOrders: number;
  lowStock: number;
  recentOrders: { id: string; email: string; total: number; status: string; created_at: string }[];
};

export const getAdminMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: orders } = await supabaseAdmin.from("orders").select("id,total,status,email,created_at");
    const { count: usersCount } = await supabaseAdmin.from("profiles").select("*", { count: "exact", head: true });
    const { count: productsCount } = await supabaseAdmin.from("products").select("*", { count: "exact", head: true });
    const { data: products } = await supabaseAdmin.from("products").select("stock");

    const orderRows = orders ?? [];
    const revenue = orderRows.reduce((s: number, o: any) => s + Number(o.total ?? 0), 0);
    const pendingOrders = orderRows.filter((o: any) => o.status === "pending").length;
    const lowStock = (products ?? []).filter((p: any) => p.stock <= 15).length;

    return {
      revenue,
      orders: orderRows.length,
      users: usersCount ?? 0,
      products: productsCount ?? 0,
      pendingOrders,
      lowStock,
      recentOrders: orderRows
        .slice()
        .sort((a: any, b: any) => (b.created_at > a.created_at ? 1 : -1))
        .slice(0, 8)
        .map((o: any) => ({
          id: o.id,
          email: o.email,
          total: Number(o.total),
          status: o.status,
          created_at: o.created_at,
        })),
    } as AdminMetrics;
  });

// ---------- Orders ----------

export const listAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: orders } = await supabaseAdmin
      .from("orders")
      .select("id,email,status,total,created_at,payment_status,user_id")
      .order("created_at", { ascending: false });
    const ids = (orders ?? []).map((o: any) => o.id);
    let items: any[] = [];
    if (ids.length) {
      const { data: it } = await supabaseAdmin.from("order_items").select("order_id,name,price,qty").in("order_id", ids);
      items = it ?? [];
    }
    return (orders ?? []).map((o: any) => ({
      ...o,
      items: items.filter((i: any) => i.order_id === o.id),
    }));
  });

export const updateOrderStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string(), status: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Products CRUD ----------

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      id: z.string().optional(),
      name: z.string().min(1),
      brand: z.string().min(1),
      price: z.number(),
      oldPrice: z.number().nullable().optional(),
      ram: z.number().int(),
      storage: z.number().int(),
      os: z.string(),
      rating: z.number(),
      reviews: z.number().int(),
      stock: z.number().int(),
      tags: z.array(z.string()).default([]),
      color: z.string().default(""),
      image: z.string().default(""),
      description: z.string().default(""),
      specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const slug = data.id ?? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const payload = {
      id: data.id ?? slug,
      slug,
      name: data.name,
      brand: data.brand,
      price: data.price,
      old_price: data.oldPrice ?? null,
      ram: data.ram,
      storage: data.storage,
      os: data.os,
      rating: data.rating,
      reviews: data.reviews,
      stock: data.stock,
      tags: data.tags,
      color: data.color,
      image: data.image,
      description: data.description,
      specs: data.specs,
    };
    if (data.id) {
      const { error } = await supabaseAdmin.from("products").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin.from("products").insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true, id: payload.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Coupons ----------

export const listAdminCoupons = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("coupons").select("*").order("created_at", { ascending: false });
    return (data ?? []).map(mapCoupon);
  });

export const adminSaveCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({
      code: z.string().min(1),
      kind: z.enum(["percent", "shipping"]),
      value: z.number(),
      label: z.string().optional(),
      active: z.boolean().default(true),
    }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      code: data.code.toUpperCase(),
      kind: data.kind,
      value: data.value,
      label: data.label ?? data.code,
      active: data.active,
    };
    const { error } = await supabaseAdmin.from("coupons").upsert(payload, { onConflict: "code" }).select().single();
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminToggleCoupon = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string(), active: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("coupons").update({ active: data.active }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Security logs ----------

export const listAdminLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("audit_logs")
      .select("id,event,level,meta,ip,created_at,user_id")
      .order("created_at", { ascending: false })
      .limit(50);
    return data ?? [];
  });

// ---------- Customers ----------

export const listAdminCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("id,full_name,phone,created_at")
      .order("created_at", { ascending: false });
    return data ?? [];
  });
