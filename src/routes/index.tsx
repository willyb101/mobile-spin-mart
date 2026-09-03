import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { PhoneCard, PhoneVisual } from "@/components/PhoneCard";
import { formatPrice } from "@/lib/currency";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartPhone Hub — Flagship phones, delivered in Zambia" },
      { name: "description", content: "Shop the latest iPhone, Galaxy and Pixel flagships with Kwacha pricing, free delivery and secure checkout." },
      { property: "og:title", content: "SmartPhone Hub — Flagship phones, delivered in Zambia" },
      { property: "og:description", content: "Curated flagship smartphones and accessories with Kwacha pricing and secure checkout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
      {/* HERO — notched gradient panel + product visual */}
      <section className="mx-auto grid max-w-7xl gap-5 px-5 pt-6 md:grid-cols-2 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="panel notch-tr flex min-h-[440px] flex-col justify-between p-8 md:p-12"
        >
          <div>
            <p className="mono-label text-primary-foreground/80">Smartphone Store + Lab</p>
            <h1 className="mt-10 text-6xl leading-[0.92] md:text-7xl">
              Let&apos;s get
              <br />
              <span className="font-black">mobile</span>
            </h1>
            <p className="mono-label mt-8 max-w-xs leading-relaxed text-primary-foreground/85">
              Our new flagship line-up has landed in Lusaka
            </p>
          </div>
          <Link to="/shop" className="btn-neon mt-10 w-fit hover:btn-neon-hover">
            Shop now
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <Link to="/product/$id" params={{ id: hero.id }} className="block">
            <PhoneVisual product={hero} className="h-[440px] rounded-3xl md:h-full" />
          </Link>
          <div className="glass absolute bottom-5 left-5 right-5 flex items-center justify-between p-4">
            <div>
              <p className="mono-label text-muted-foreground">{hero.brand}</p>
              <p className="text-sm font-semibold">{hero.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold neon-text">{formatPrice(hero.price)}</p>
              <Link to="/product/$id" params={{ id: hero.id }} className="mono-label text-primary hover:underline">
                View
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATEMENT + PAIN POINT CARDS */}
      <section className="mx-auto mt-24 max-w-5xl px-5 text-center">
        <h2 className="text-4xl leading-tight md:text-6xl">
          Buying a phone doesn&apos;t have to be difficult.
          <br />
          <span className="font-black">We&apos;re here to help.</span>
        </h2>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-5 px-5 md:grid-cols-3">
        {valueProps.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="panel p-7"
          >
            <h3 className="mono-label !text-sm font-bold text-primary-foreground">{v.title}</h3>
            <p className="mono-label mt-5 leading-relaxed text-primary-foreground/85">{v.body}</p>
          </motion.div>
        ))}
      </section>

      {/* GRADIENT BAND — "Grow your presence" analogue */}
      <section className="relative mt-24 overflow-hidden py-24" style={{ background: "var(--gradient-band)" }}>
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="text-5xl leading-[0.95] md:text-6xl">
            Upgrade your
            <br />
            <span className="font-black">everyday.</span>
          </h2>
          <p className="mono-label mx-auto mt-6 max-w-md leading-relaxed">
            We&apos;ll put the right device in your hand — flagships, mid-rangers and accessories, priced in Kwacha.
          </p>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="mx-auto mt-24 max-w-7xl px-5">
        <h2 className="text-5xl md:text-6xl">What we offer</h2>
        <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-5">
            {offers.map((o) => (
              <div key={o} className="pill-grad px-8 py-4 text-center text-sm text-primary-foreground">
                {o}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 2).map((p) => (
              <PhoneCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Section title="Featured" subtitle="Hand-picked flagships" link="/shop">
        <Grid items={featured} />
      </Section>

      <Section title="Latest arrivals" subtitle="Fresh in the line-up" link="/shop">
        <Grid items={latest} />
      </Section>

      <Section title="Bestsellers" subtitle="Loved by thousands" link="/shop">
        <Grid items={best} />
      </Section>

      {/* PROMISES */}
      <section className="mx-auto mt-24 max-w-7xl px-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Promise icon={Truck} title="Free delivery" body="Countrywide dispatch within 24 hours on orders over K1,250." />
          <Promise icon={ShieldCheck} title="Secure checkout" body="Encrypted payments and 30-day returns on every device." />
          <Promise icon={Zap} title="Real warranty" body="12-month manufacturer warranty handled locally in Lusaka." />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto mt-24 max-w-7xl px-5">
        <h2 className="text-5xl md:text-6xl">What customers say</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass p-6">
              <p className="mono-label leading-relaxed text-foreground/90">&quot;{t.quote}&quot;</p>
              <p className="mono-label mt-5 text-muted-foreground">— {t.name}, {t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto mt-24 max-w-3xl px-5 text-center">
        <h2 className="text-4xl md:text-5xl">Get device drops in your inbox</h2>
        <p className="mono-label mt-4 text-muted-foreground">Weekly digest. No spam. Unsubscribe anytime.</p>
        <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-7 flex max-w-md gap-2">
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary"
          />
          <button className="btn-neon hover:btn-neon-hover">Join</button>
        </form>
        <Link to="/shop" className="mono-label mt-8 inline-flex items-center gap-2 text-primary hover:underline">
          Browse the catalogue <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </>
  );
}

function Promise({ icon: Icon, title, body }: { icon: typeof Truck; title: string; body: string }) {
  return (
    <div className="glass p-6">
      <Icon className="h-5 w-5 text-accent" />
      <h3 className="mono-label mt-4 !text-sm font-bold">{title}</h3>
      <p className="mono-label mt-2 leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

function Section({ title, subtitle, link, children }: { title: string; subtitle?: string; link?: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto mt-24 max-w-7xl px-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl">{title}</h2>
          {subtitle && <p className="mono-label mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        {link && (
          <Link to={link} className="mono-label text-primary hover:underline">View all →</Link>
        )}
      </div>
      <div className="mt-8">{children}</div>
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

const valueProps = [
  {
    title: "Getting lost in the specs?",
    body: "We translate RAM, chipsets and camera sensors into plain language so you buy the phone that fits your life.",
  },
  {
    title: "Tired of grey imports?",
    body: "Every device is sourced sealed, warranty-backed and tested before it leaves our Lusaka counter.",
  },
  {
    title: "Feeling left in the dark?",
    body: "Live order tracking, transparent Kwacha pricing and a real human on the other end of the line.",
  },
];

const offers = ["Flagship smartphones", "Accessories & audio", "Trade-in & upgrades"];

const testimonials = [
  { name: "Maya R.", role: "Photographer", quote: "Pixel 8 Pro arrived next day, perfectly packaged. Best price I found in Lusaka." },
  { name: "Dev S.", role: "Engineer", quote: "Cleanest checkout I've used. Specs are exactly what I needed to compare before buying." },
  { name: "Jules K.", role: "Designer", quote: "Beautiful site, but more importantly — the prices actually beat the carriers." },
];
