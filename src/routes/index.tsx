import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Gift, ShieldCheck, Sparkles, Truck, Zap } from "lucide-react";
import { PhoneCard, PhoneVisual } from "@/components/PhoneCard";
import { formatPrice } from "@/lib/currency";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartPhone Hub — Flagship phones, neon-fast deals" },
      { name: "description", content: "Shop the latest iPhone, Galaxy, Pixel and more. Spin & Win exclusive coupons every 24 hours." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.filter((p) => p.tags.includes("featured")).slice(0, 4);
  const latest = products.filter((p) => p.tags.includes("new")).slice(0, 4);
  const best = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);
  const hero = featured[0] ?? products[0];

  return (
    <>
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-5 pt-10 md:pt-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-muted-foreground">New flagships in stock</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
            >
              Tomorrow's <br />
              <span className="neon-text">smartphones</span>, <br />
              today.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-5 max-w-md text-base text-muted-foreground"
            >
              Curated flagship phones, accessories, and a Spin & Win wheel that drops a fresh
              discount in your wallet every 24 hours.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link to="/shop" className="btn-neon inline-flex items-center gap-2 hover:btn-neon-hover">
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/spin" className="btn-ghost inline-flex items-center gap-2">
                <Gift className="h-4 w-4 text-accent" /> Spin & Win
              </Link>
            </motion.div>
            <div className="mt-10 grid max-w-md grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Free shipping</div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Secure pay</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> 24h dispatch</div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 -z-10 blur-3xl opacity-50"
              style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--neon) 50%, transparent), transparent 70%)" }}
            />
            <Link to="/product/$id" params={{ id: hero.id }} className="block">
              <PhoneVisual product={hero} className="h-[480px]" />
            </Link>
            <div className="glass absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-xl p-4">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{hero.brand}</p>
                <p className="text-sm font-semibold">{hero.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold neon-text">{formatPrice(hero.price)}</p>
                <Link to="/product/$id" params={{ id: hero.id }} className="text-xs text-primary hover:underline">
                  View →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <Section title="Featured" subtitle="Hand-picked flagships" link="/shop">
        <Grid items={featured} />
      </Section>

      {/* PROMO */}
      <section className="mx-auto mt-20 max-w-7xl px-5">
        <div className="glass neon-border relative overflow-hidden rounded-3xl p-8 md:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">Limited drop</p>
              <h3 className="mt-2 text-3xl font-bold md:text-4xl">
                Spin the wheel. <span className="neon-text">Win up to 20% off.</span>
              </h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                One spin every 24 hours. Coupons land instantly in your account.
              </p>
            </div>
            <Link to="/spin" className="btn-neon inline-flex items-center gap-2 hover:btn-neon-hover">
              <Gift className="h-4 w-4" /> Try your luck
            </Link>
          </div>
        </div>
      </section>

      <Section title="Latest arrivals" subtitle="Fresh in the lineup" link="/shop">
        <Grid items={latest} />
      </Section>

      <Section title="Bestsellers" subtitle="Loved by thousands" link="/shop">
        <Grid items={best} />
      </Section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-20 max-w-7xl px-5">
        <h2 className="text-3xl font-bold tracking-tight">What customers say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-5">
              <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
              <p className="mt-4 text-xs text-muted-foreground">— {t.name}, {t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto mt-20 max-w-3xl px-5 text-center">
        <h3 className="text-3xl font-bold">Get device drops in your inbox</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Weekly digest. No spam. Unsubscribe anytime.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button className="btn-neon">Subscribe</button>
        </form>
      </section>
    </>
  );
}

function Section({ title, subtitle, link, children }: { title: string; subtitle?: string; link?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-20 max-w-7xl px-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="text-sm text-primary hover:underline">View all →</Link>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Grid({ items }: { items: typeof products }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((p) => <PhoneCard key={p.id} product={p} />)}
    </div>
  );
}

const testimonials = [
  { name: "Maya R.", role: "Photographer", quote: "Pixel 8 Pro arrived next day, perfectly packaged. The Spin & Win coupon saved me K2,250." },
  { name: "Dev S.", role: "Engineer", quote: "Cleanest checkout I've used. Specs are exactly what I needed to compare before buying." },
  { name: "Jules K.", role: "Designer", quote: "Beautiful site, but more importantly — the prices actually beat the carriers." },
];
