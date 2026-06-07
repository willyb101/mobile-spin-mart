import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, ShoppingCart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useState } from "react";
import { PhoneCard, PhoneVisual } from "@/components/PhoneCard";
import { formatPrice } from "@/lib/currency";
import { getProduct, related } from "@/lib/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — SmartPhone Hub` : "Product" },
      { name: "description", content: loaderData?.product.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-20 text-center">
      <h1 className="text-3xl font-bold">Product not found</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">Back to shop</Link>
    </div>
  ),
  errorComponent: () => <div className="p-10 text-center text-muted-foreground">Something went wrong.</div>,
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const rel = related(product.id);
  const addToCart = useStore((s) => s.addToCart);
  const toggleWishlist = useStore((s) => s.toggleWishlist);
  const liked = useStore((s) => s.wishlist.includes(product.id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="text-xs text-muted-foreground">
        <Link to="/shop" className="hover:text-primary">Shop</Link> / {product.brand} / {product.name}
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <PhoneVisual product={product} className="h-[480px]" />
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-lg" style={{ background: product.image, opacity: 0.7 + i * 0.1 }} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{product.brand} · {product.color}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm">
            <span className="text-primary">★ {product.rating}</span>
            <span className="text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${product.stock > 10 ? "bg-primary/15 text-primary" : "bg-accent/15 text-accent"}`}>
              {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
            </span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-4xl font-bold neon-text">${product.price}</span>
            {product.oldPrice && <span className="text-base text-muted-foreground line-through">${product.oldPrice}</span>}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border border-border">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-muted-foreground hover:text-foreground">−</button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-muted-foreground hover:text-foreground">+</button>
            </div>
            <button
              onClick={() => { addToCart(product.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1500); }}
              className="btn-neon inline-flex flex-1 items-center justify-center gap-2 hover:btn-neon-hover"
            >
              <ShoppingCart className="h-4 w-4" /> {added ? "Added!" : "Add to cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`rounded-md border p-3 transition ${liked ? "border-accent text-accent" : "border-border text-muted-foreground hover:text-accent"}`}
              aria-label="Wishlist"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-accent" : ""}`} />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="glass rounded-lg p-3"><Truck className="mb-1 h-4 w-4 text-primary" />Free shipping over $50</div>
            <div className="glass rounded-lg p-3"><RotateCcw className="mb-1 h-4 w-4 text-primary" />30-day returns</div>
            <div className="glass rounded-lg p-3"><ShieldCheck className="mb-1 h-4 w-4 text-primary" />2-year warranty</div>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Specifications</h3>
            <dl className="mt-3 divide-y divide-border rounded-xl border border-border">
              {product.specs.map((s: { label: string; value: string }) => (
                <div key={s.label} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 text-sm">
                <dt className="text-muted-foreground">RAM / Storage</dt>
                <dd className="font-medium">{product.ram}GB / {product.storage}GB</dd>
              </div>
              <div className="flex justify-between px-4 py-3 text-sm">
                <dt className="text-muted-foreground">OS</dt>
                <dd className="font-medium">{product.os}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">Customer reviews</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {sampleReviews.map((r) => (
            <div key={r.name} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">{r.name}</span>
                <span className="text-primary">{"★".repeat(r.stars)}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {rel.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">You might also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {rel.map((p) => <PhoneCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}

const sampleReviews = [
  { name: "Alex", stars: 5, text: "Incredible build quality, battery lasts all day. Camera is unreal." },
  { name: "Priya", stars: 4, text: "Love the design, slight learning curve with new gestures." },
  { name: "Sam", stars: 5, text: "Shipped fast and arrived in perfect condition. Highly recommend." },
];
