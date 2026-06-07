import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { PhoneVisual } from "@/components/PhoneCard";
import { formatPrice } from "@/lib/currency";
import { cartTotals, useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — SmartPhone Hub" }] }),
  component: Cart,
});

function Cart() {
  const cart = useStore((s) => s.cart);
  const setQty = useStore((s) => s.setQty);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const coupons = useStore((s) => s.coupons);
  const appliedCode = useStore((s) => s.appliedCoupon);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const applied = coupons.find((c) => c.code === appliedCode) ?? null;
  const totals = cartTotals(cart, applied);
  const [code, setCode] = useState("");

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted-foreground">Browse the shop and add a flagship.</p>
        <Link to="/shop" className="btn-neon mt-6 inline-block">Browse phones</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-4xl font-bold tracking-tight">Cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {totals.lines.map((line) => (
            <div key={line.id} className="glass flex items-center gap-4 rounded-2xl p-3">
              <div className="h-24 w-24 shrink-0">
                <PhoneVisual product={line.product} className="h-24" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{line.product.brand}</p>
                <Link to="/product/$id" params={{ id: line.product.id }} className="text-sm font-semibold hover:text-primary">
                  {line.product.name}
                </Link>
                <p className="text-xs text-muted-foreground">{line.product.ram}GB · {line.product.storage}GB</p>
              </div>
              <div className="flex items-center rounded-md border border-border">
                <button onClick={() => setQty(line.id, line.qty - 1)} className="p-2"><Minus className="h-3 w-3" /></button>
                <span className="w-8 text-center text-sm">{line.qty}</span>
                <button onClick={() => setQty(line.id, line.qty + 1)} className="p-2"><Plus className="h-3 w-3" /></button>
              </div>
              <p className="w-20 text-right text-sm font-semibold">${line.product.price * line.qty}</p>
              <button onClick={() => removeFromCart(line.id)} className="rounded-md p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <aside className="glass h-fit rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Order summary</h3>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
            {totals.discount > 0 && <Row label={`Discount${applied ? ` (${applied.code})` : ""}`} value={`−$${totals.discount.toFixed(2)}`} accent />}
            <Row label="Shipping" value={totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`} />
            <Row label="Tax (8%)" value={`$${totals.tax.toFixed(2)}`} />
            <div className="my-3 border-t border-border" />
            <Row label="Total" value={`$${totals.total.toFixed(2)}`} bold />
          </dl>

          <div className="mt-5">
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <Tag className="h-3.5 w-3.5" /> Coupon code
            </label>
            <div className="mt-2 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="SPINXXXX"
                className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={() => {
                  const found = coupons.find((c) => c.code === code);
                  if (found) applyCoupon(found.code);
                }}
                className="btn-ghost text-sm"
              >Apply</button>
            </div>
            {coupons.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Your coupons</p>
                {coupons.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => applyCoupon(c.code === appliedCode ? null : c.code)}
                    className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-xs transition ${
                      appliedCode === c.code ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-primary/60"
                    }`}
                  >
                    <span className="font-mono">{c.code}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/checkout" className="btn-neon mt-6 block w-full text-center hover:btn-neon-hover">
            Checkout →
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value, bold, accent }: { label: string; value: string; bold?: boolean; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`${bold ? "text-lg font-bold neon-text" : ""} ${accent ? "text-accent" : ""}`}>{value}</dd>
    </div>
  );
}
