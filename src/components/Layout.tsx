import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Heart, User, Zap, Search, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";

function NavLink({ to, children }: { to: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to || (to !== "/" && pathname.startsWith(to));
  return (
    <Link
      to={to}
      className={`text-sm transition hover:text-primary ${active ? "text-primary" : "text-muted-foreground"}`}
    >
      {children}
    </Link>
  );
}

export function Header() {
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const user = useStore((s) => s.user);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl"
      style={{ background: "color-mix(in oklab, var(--background) 70%, transparent)" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}>
            <Zap className="h-4 w-4 text-background" />
          </div>
          <span className="text-base font-bold tracking-tight">
            SmartPhone <span className="neon-text">Hub</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/shop" className="rounded-md p-2 text-muted-foreground hover:text-primary" aria-label="Search">
            <Search className="h-4 w-4" />
          </Link>
          <Link to="/account" className="rounded-md p-2 text-muted-foreground hover:text-primary" aria-label="Wishlist">
            <div className="relative">
              <Heart className="h-4 w-4" />
              {wishlist.length > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-foreground">
                  {wishlist.length}
                </span>
              )}
            </div>
          </Link>
          <Link to="/cart" className="rounded-md p-2 text-muted-foreground hover:text-primary" aria-label="Cart">
            <div className="relative">
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </div>
          </Link>
          <Link to="/account" className="ml-1 rounded-md p-2 text-muted-foreground hover:text-primary" aria-label="Account">
            <User className="h-4 w-4" />
          </Link>
          {!user && (
            <Link to="/login" className="ml-2 hidden rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary md:inline-block">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg" style={{ background: "linear-gradient(135deg, var(--neon), var(--neon-2))" }}>
              <Zap className="h-4 w-4 text-background" />
            </div>
            <span className="font-bold">SmartPhone <span className="neon-text">Hub</span></span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The future of mobile retail. Curated flagships, accessories, and unbeatable deals.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Secure checkout · 30-day returns
          </div>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-primary">All phones</Link></li>
            <li><Link to="/shop" className="hover:text-primary">New arrivals</Link></li>
            <li><Link to="/shop" className="hover:text-primary">Bestsellers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/login" className="hover:text-primary">Sign in</Link></li>
            <li><Link to="/account" className="hover:text-primary">Orders</Link></li>
            <li><Link to="/account" className="hover:text-primary">Wishlist</Link></li>
            <li><Link to="/admin" className="hover:text-primary">Admin</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Newsletter</h4>
          <p className="mt-3 text-xs text-muted-foreground">Drops, deals & device launches.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-3 flex gap-2">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button className="btn-neon text-sm">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} SmartPhone Hub. All rights reserved.
      </div>
    </footer>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
