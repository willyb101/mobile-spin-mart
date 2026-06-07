import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "./products";

export type CartItem = { id: string; qty: number };
export type Coupon = { code: string; label: string; kind: "percent" | "shipping"; value: number; issuedAt: number };

type AppState = {
  cart: CartItem[];
  wishlist: string[];
  coupons: Coupon[];
  appliedCoupon: string | null;
  user: { email: string; name: string } | null;
  lastSpin: number | null;
  addToCart: (id: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  addCoupon: (c: Coupon) => void;
  applyCoupon: (code: string | null) => void;
  setUser: (u: { email: string; name: string } | null) => void;
  setLastSpin: (t: number) => void;
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      cart: [],
      wishlist: [],
      coupons: [],
      appliedCoupon: null,
      user: null,
      lastSpin: null,
      addToCart: (id, qty = 1) =>
        set((s) => {
          const existing = s.cart.find((i) => i.id === id);
          if (existing) return { cart: s.cart.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i)) };
          return { cart: [...s.cart, { id, qty }] };
        }),
      removeFromCart: (id) => set((s) => ({ cart: s.cart.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({ cart: s.cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)) })),
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      toggleWishlist: (id) =>
        set((s) => ({
          wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id],
        })),
      addCoupon: (c) => set((s) => ({ coupons: [c, ...s.coupons] })),
      applyCoupon: (code) => set({ appliedCoupon: code }),
      setUser: (u) => set({ user: u }),
      setLastSpin: (t) => set({ lastSpin: t }),
    }),
    { name: "smartphone-hub" },
  ),
);

export const cartLines = (cart: CartItem[]) =>
  cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) as Product })).filter((c) => c.product);

export const cartTotals = (cart: CartItem[], coupon?: Coupon | null) => {
  const lines = cartLines(cart);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  let discount = 0;
  let shipping = subtotal > 0 ? 15 : 0;
  if (coupon?.kind === "percent") discount = (subtotal * coupon.value) / 100;
  if (coupon?.kind === "shipping") shipping = 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = +(taxable * 0.08).toFixed(2);
  const total = +(taxable + tax + shipping).toFixed(2);
  return { subtotal, discount, shipping, tax, total, lines };
};
