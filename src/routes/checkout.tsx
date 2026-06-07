import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/currency";
import { cartTotals, useStore } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — SmartPhone Hub" }] }),
  component: Checkout,
});

function Checkout() {
  const cart = useStore((s) => s.cart);
  const coupons = useStore((s) => s.coupons);
  const applied = coupons.find((c) => c.code === useStore.getState().appliedCoupon) ?? null;
  const totals = cartTotals(cart, applied);
  const clearCart = useStore((s) => s.clearCart);
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  if (cart.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Link to="/shop" className="btn-neon mt-4 inline-block">Browse phones</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">Order placed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you. A confirmation has been sent to your email. (Demo — payment was not actually processed.)
        </p>
        <Link to="/" className="btn-neon mt-6 inline-block">Back home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          clearCart();
          setDone(true);
          setTimeout(() => navigate({ to: "/" }), 5000);
        }}
        className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          <Section title="Contact">
            <Field label="Email" name="email" type="email" required />
          </Section>
          <Section title="Shipping">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
            </div>
            <Field label="Address" name="address" required />
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="City" name="city" required />
              <Field label="State" name="state" required />
              <Field label="ZIP" name="zip" required />
            </div>
          </Section>
          <Section title="Payment">
            <p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure · demo placeholder · real Stripe checkout in next iteration
            </p>
            <Field label="Card number" name="card" placeholder="4242 4242 4242 4242" required />
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Expiry" name="exp" placeholder="MM/YY" required />
              <Field label="CVC" name="cvc" placeholder="123" required />
              <Field label="ZIP" name="cardZip" required />
            </div>
          </Section>
        </div>

        <aside className="glass h-fit rounded-2xl p-5">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Order</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {totals.lines.map((l) => (
              <li key={l.id} className="flex justify-between">
                <span className="text-muted-foreground">{l.product.name} × {l.qty}</span>
                <span>${l.product.price * l.qty}</span>
              </li>
            ))}
          </ul>
          <div className="my-3 border-t border-border" />
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${totals.subtotal.toFixed(2)}</dd></div>
            {totals.discount > 0 && <div className="flex justify-between text-accent"><dt>Discount</dt><dd>−${totals.discount.toFixed(2)}</dd></div>}
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>${totals.tax.toFixed(2)}</dd></div>
            <div className="mt-2 flex justify-between border-t border-border pt-2"><dt className="font-bold">Total</dt><dd className="text-lg font-bold neon-text">${totals.total.toFixed(2)}</dd></div>
          </dl>
          <button className="btn-neon mt-5 w-full hover:btn-neon-hover">Place order</button>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="glass space-y-3 rounded-2xl p-5">
      <legend className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-muted-foreground">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </label>
  );
}
