import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PhoneCard } from "@/components/PhoneCard";
import { formatPrice } from "@/lib/currency";
import { brands, oses, products, ramOptions, storageOptions } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — SmartPhone Hub" },
      { name: "description", content: "Browse all smartphones. Filter by brand, price, RAM, storage, and OS." },
    ],
  }),
  component: Shop,
});

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

function Shop() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string[]>([]);
  const [os, setOs] = useState<string[]>([]);
  const [ram, setRam] = useState<number[]>([]);
  const [storage, setStorage] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(35000);
  const [sort, setSort] = useState<Sort>("featured");

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (brand.length && !brand.includes(p.brand)) return false;
      if (os.length && !os.includes(p.os)) return false;
      if (ram.length && !ram.includes(p.ram)) return false;
      if (storage.length && !storage.includes(p.storage)) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [q, brand, os, ram, storage, maxPrice, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <h1 className="text-4xl font-bold tracking-tight">All phones</h1>
      <p className="mt-1 text-sm text-muted-foreground">{filtered.length} of {products.length} products</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="iPhone, Pixel, Galaxy..."
              className="mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <FilterGroup label="Brand" options={brands} value={brand} onChange={setBrand} />
          <FilterGroup label="OS" options={oses as unknown as string[]} value={os} onChange={setOs} />
          <FilterGroup label="RAM (GB)" options={ramOptions.map(String)} value={ram.map(String)} onChange={(v) => setRam(v.map(Number))} />
          <FilterGroup label="Storage (GB)" options={storageOptions.map(String)} value={storage.map(String)} onChange={(v) => setStorage(v.map(Number))} />
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Max price: <span className="text-primary">{formatPrice(maxPrice)}</span>
            </label>
            <input
              type="range"
              min={5000} max={35000} step={1000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-end gap-3">
            <label className="text-xs text-muted-foreground">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((p) => <PhoneCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label, options, value, onChange,
}: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
