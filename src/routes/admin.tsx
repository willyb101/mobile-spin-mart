import { createFileRoute } from "@tanstack/react-router";
import { Activity, DollarSign, Gift, Package, ShieldAlert, ShoppingBag, Tag, Users } from "lucide-react";
import { useState } from "react";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — SmartPhone Hub" }] }),
  component: Admin,
});

type Tab = "overview" | "products" | "orders" | "customers" | "coupons" | "security";

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const coupons = useStore((s) => s.coupons);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-primary">Admin</p>
          <h1 className="mt-1 text-4xl font-bold">Dashboard</h1>
        </div>
        <span className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
          Demo · read-only · v2 will wire real data
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border">
        {(["overview", "products", "orders", "customers", "coupons", "security"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 text-sm capitalize transition ${
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "overview" && <Overview couponsCount={coupons.length} />}
        {tab === "products" && <ProductsTable />}
        {tab === "orders" && <OrdersTable />}
        {tab === "customers" && <CustomersTable />}
        {tab === "coupons" && <CouponsTable />}
        {tab === "security" && <Security />}
      </div>
    </div>
  );
}

function Overview({ couponsCount }: { couponsCount: number }) {
  const stats = [
    { label: "Revenue", value: "K3,709,800", icon: DollarSign, delta: "+12.4%" },
    { label: "Orders", value: "1,247", icon: ShoppingBag, delta: "+8.1%" },
    { label: "Customers", value: "892", icon: Users, delta: "+5.6%" },
    { label: "Inventory", value: `${products.reduce((s, p) => s + p.stock, 0)} units`, icon: Package, delta: "" },
    { label: "Visitors today", value: "324", icon: Activity, delta: "+22%" },
    { label: "Coupons issued", value: String(couponsCount + 218), icon: Gift, delta: "" },
  ];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="mt-3 text-3xl font-bold neon-text">{s.value}</p>
            {s.delta && <p className="mt-1 text-xs text-primary">{s.delta} vs last week</p>}
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Revenue (7d)</h3>
          <Sparkline data={[12, 18, 14, 22, 28, 24, 32]} />
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Traffic — last 7 days</h3>
          <Sparkline data={[80, 120, 105, 160, 200, 240, 324]} color="var(--accent)" />
        </div>
      </div>
    </>
  );
}

function Sparkline({ data, color = "var(--neon)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 90}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-4 h-32 w-full">
      <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      {data.map((v, i) => (
        <circle key={i} cx={(i / (data.length - 1)) * 100} cy={100 - (v / max) * 90} r="1.5" fill={color} />
      ))}
    </svg>
  );
}

function ProductsTable() {
  return (
    <Table
      headers={["Product", "Brand", "Price", "Stock", "Rating"]}
      rows={products.map((p) => [
        <span key="n" className="font-medium">{p.name}</span>,
        p.brand,
        `K${p.price.toLocaleString("en-ZM")}`,
        <span key="s" className={p.stock < 15 ? "text-accent" : "text-primary"}>{p.stock}</span>,
        `★ ${p.rating}`,
      ])}
    />
  );
}

function OrdersTable() {
  const orders = [
    { id: "#10421", customer: "M. Roberts", total: "K27,999", status: "Shipped" },
    { id: "#10420", customer: "D. Singh",   total: "K19,999", status: "Processing" },
    { id: "#10419", customer: "J. Kim",     total: "K11,249", status: "Delivered" },
    { id: "#10418", customer: "A. Chen",    total: "K32,499", status: "Pending" },
  ];
  return (
    <Table
      headers={["Order", "Customer", "Total", "Status"]}
      rows={orders.map((o) => [
        <span key="i" className="font-mono">{o.id}</span>,
        o.customer,
        o.total,
        <span key="s" className="rounded-full border border-border px-2 py-0.5 text-xs">{o.status}</span>,
      ])}
    />
  );
}

function CustomersTable() {
  const customers = [
    { name: "Maya Roberts", email: "maya@example.com", orders: 4, spent: "K82,250" },
    { name: "Dev Singh",    email: "dev@example.com",  orders: 2, spent: "K39,998" },
    { name: "Jules Kim",    email: "jules@example.com",orders: 6, spent: "K103,000" },
  ];
  return (
    <Table
      headers={["Name", "Email", "Orders", "Lifetime"]}
      rows={customers.map((c) => [c.name, c.email, String(c.orders), c.spent])}
    />
  );
}

function CouponsTable() {
  const coupons = useStore((s) => s.coupons);
  const seed = [
    { code: "WELCOME10", label: "10% Off", issuedAt: Date.now() - 86400000 * 3 },
    { code: "SHIPFREE",  label: "Free Shipping", issuedAt: Date.now() - 86400000 * 6 },
  ];
  const rows = [...coupons, ...seed].map((c) => [
    <span key="c" className="font-mono text-primary">{c.code}</span>,
    c.label,
    new Date(c.issuedAt).toLocaleDateString(),
    <button key="b" className="text-xs text-destructive hover:underline">Disable</button>,
  ]);
  return (
    <>
      <div className="mb-4 flex justify-end">
        <button className="btn-neon text-sm">+ New coupon</button>
      </div>
      <Table headers={["Code", "Reward", "Issued", ""]} rows={rows} />
    </>
  );
}

function Security() {
  const events = [
    { time: "2 min ago",  type: "Login",          user: "admin@hub.com",  ip: "192.168.1.4",  level: "ok" },
    { time: "14 min ago", type: "Failed login",   user: "unknown",        ip: "45.91.22.10",  level: "warn" },
    { time: "1 h ago",    type: "Coupon issued",  user: "maya@example.com", ip: "10.0.0.2",   level: "ok" },
    { time: "3 h ago",    type: "Role changed",   user: "admin@hub.com",  ip: "192.168.1.4",  level: "warn" },
    { time: "8 h ago",    type: "Suspicious login",user: "bot42@x.com",   ip: "199.66.4.4",   level: "alert" },
  ];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <SecStat label="Failed logins (24h)" value="12" icon={ShieldAlert} tone="warn" />
        <SecStat label="Active sessions" value="34" icon={Users} tone="ok" />
        <SecStat label="Alerts" value="2" icon={Activity} tone="alert" />
      </div>
      <div className="mt-6">
        <Table
          headers={["Time", "Event", "User", "IP", "Level"]}
          rows={events.map((e) => [
            e.time,
            e.type,
            e.user,
            <span key="i" className="font-mono text-xs">{e.ip}</span>,
            <span
              key="l"
              className={`rounded-full px-2 py-0.5 text-xs ${
                e.level === "ok" ? "bg-primary/15 text-primary"
                : e.level === "warn" ? "bg-accent/15 text-accent"
                : "bg-destructive/15 text-destructive"
              }`}
            >{e.level}</span>,
          ])}
        />
      </div>
    </>
  );
}

function SecStat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Tag; tone: "ok" | "warn" | "alert" }) {
  const color = tone === "ok" ? "var(--neon)" : tone === "warn" ? "var(--neon-2)" : "var(--destructive)";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="mt-3 text-3xl font-bold" style={{ color }}>{value}</p>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-card/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
            {headers.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-card/30">
              {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
