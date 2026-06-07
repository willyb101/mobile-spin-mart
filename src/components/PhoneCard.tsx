import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { useStore } from "@/lib/store";

export function PhoneVisual({ product, className = "h-44" }: { product: Product; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      style={{ background: product.image }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-[78%] w-[44%] rounded-[28px] border border-white/15"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.18), rgba(255,255,255,0.02))",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.45), 0 30px 60px -20px rgba(0,0,0,0.6)",
          }}
        >
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-white/30" />
        </div>
      </div>
      <div className="absolute left-3 top-3 flex gap-1">
        {product.tags.includes("new") && (
          <span className="rounded-full bg-accent/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
            New
          </span>
        )}
        {product.oldPrice && (
          <span className="rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            Sale
          </span>
        )}
      </div>
    </div>
  );
}

export function PhoneCard({ product }: { product: Product }) {
  const wishlist = useStore((s) => s.wishlist);
  const toggle = useStore((s) => s.toggleWishlist);
  const liked = wishlist.includes(product.id);
  return (
    <div className="group glass rounded-2xl p-3 transition hover:-translate-y-1 hover:shadow-2xl">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block"
      >
        <PhoneVisual product={product} />
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{product.brand}</p>
          <Link
            to="/product/$id"
            params={{ id: product.id }}
            className="text-sm font-semibold leading-tight text-foreground hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {product.ram}GB · {product.storage}GB · {product.os}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          className="rounded-full p-1.5 text-muted-foreground hover:text-accent"
          aria-label="Wishlist"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-accent text-accent" : ""}`} />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold neon-text">${product.price}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">${product.oldPrice}</span>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground">★ {product.rating}</span>
      </div>
    </div>
  );
}
