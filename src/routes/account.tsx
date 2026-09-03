import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneCard } from "@/components/PhoneCard";
import { products } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — SmartPhone Hub" }] }),
  component: Account,
});

function Account() {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const wishlist = useStore((s) => s.wishlist);
  const coupons = useStore((s) => s.coupons);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold">Sign in to view your account</h1>
        <Link to="/login" className="btn-neon mt-6 inline-block">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Account</p>
          <h1 className="mt-1 text-4xl font-bold">Hi, <span className="neon-text">{user.name}</span></h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <button onClick={() => setUser(null)} className="btn-ghost text-sm">Sign out</button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <Stat label="Orders" value="0" />
        <Stat label="Wishlist" value={String(wishlist.length)} />
        <Stat label="Coupons" value={String(coupons.length)} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Your coupons</h2>
        {coupons.length === 0 ? (
          <div className="glass mt-4 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            No coupons yet. Promo codes you receive will appear here.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {coupons.map((c) => (
              <div key={c.code} className="glass neon-border rounded-2xl p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</p>
                <p className="mt-2 font-mono text-lg font-bold neon-text">{c.code}</p>
                <p className="mt-1 text-xs text-muted-foreground">Issued {new Date(c.issuedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Wishlist</h2>
        {wishlistProducts.length === 0 ? (
          <div className="glass mt-4 rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Nothing saved yet.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {wishlistProducts.map((p) => <PhoneCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold">Order history</h2>
        <div className="glass mt-4 rounded-2xl p-8 text-center text-sm text-muted-foreground">
          No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping →</Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold neon-text">{value}</p>
    </div>
  );
}
