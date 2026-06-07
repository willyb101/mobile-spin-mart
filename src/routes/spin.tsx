import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Gift, Lock, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { useStore, type Coupon } from "@/lib/store";

export const Route = createFileRoute("/spin")({
  head: () => ({
    meta: [
      { title: "Spin & Win — SmartPhone Hub" },
      { name: "description", content: "Spin once every 24 hours and win exclusive coupon codes." },
    ],
  }),
  component: Spin,
});

const PRIZES = [
  { label: "5% Off",    kind: "percent" as const, value: 5,  color: "#22d3ee" },
  { label: "No Prize",  kind: "none"    as const, value: 0,  color: "#475569" },
  { label: "10% Off",   kind: "percent" as const, value: 10, color: "#34d399" },
  { label: "Free Ship", kind: "shipping" as const, value: 0, color: "#f472b6" },
  { label: "15% Off",   kind: "percent" as const, value: 15, color: "#a78bfa" },
  { label: "No Prize",  kind: "none"    as const, value: 0,  color: "#475569" },
  { label: "20% Off",   kind: "percent" as const, value: 20, color: "#fbbf24" },
  { label: "5% Off",    kind: "percent" as const, value: 5,  color: "#22d3ee" },
];

const SEG = 360 / PRIZES.length;
const COOLDOWN = 24 * 60 * 60 * 1000;

function makeCode() {
  const a = Math.random().toString(36).slice(2, 6).toUpperCase();
  const b = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SPIN-${a}-${b}`;
}

function Spin() {
  const user = useStore((s) => s.user);
  const lastSpin = useStore((s) => s.lastSpin);
  const setLastSpin = useStore((s) => s.setLastSpin);
  const addCoupon = useStore((s) => s.addCoupon);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ prize: typeof PRIZES[number]; coupon?: Coupon } | null>(null);

  const canSpin = useMemo(() => {
    if (!user) return false;
    if (!lastSpin) return true;
    return Date.now() - lastSpin > COOLDOWN;
  }, [user, lastSpin]);

  const cooldownLeft = useMemo(() => {
    if (!lastSpin) return 0;
    return Math.max(0, COOLDOWN - (Date.now() - lastSpin));
  }, [lastSpin]);

  const conic = useMemo(() => {
    const stops = PRIZES.map((p, i) => `${p.color} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(", ");
    return `conic-gradient(from -${SEG / 2}deg, ${stops})`;
  }, []);

  const spin = () => {
    if (!canSpin || spinning) return;
    const idx = Math.floor(Math.random() * PRIZES.length);
    const turns = 6;
    const target = 360 * turns - idx * SEG;
    setResult(null);
    setSpinning(true);
    setRotation((prev) => prev + target);
    setTimeout(() => {
      const prize = PRIZES[idx];
      let coupon: Coupon | undefined;
      if (prize.kind !== "none") {
        coupon = {
          code: makeCode(),
          label: prize.label,
          kind: prize.kind,
          value: prize.value,
          issuedAt: Date.now(),
        };
        addCoupon(coupon);
      }
      setLastSpin(Date.now());
      setResult({ prize, coupon });
      setSpinning(false);
    }, 4200);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-primary">Daily Drop</p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">
          Spin & <span className="neon-text">Win</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          One spin every 24 hours. Win up to 20% off or free shipping. Coupons land instantly in your account.
        </p>
      </div>

      <div className="mt-12 grid items-center gap-10 md:grid-cols-[1fr_320px]">
        <div className="relative mx-auto h-[340px] w-[340px] md:h-[420px] md:w-[420px]">
          {/* Pointer */}
          <div className="absolute left-1/2 top-[-10px] z-20 -translate-x-1/2">
            <div className="h-0 w-0 border-l-[14px] border-r-[14px] border-t-[22px] border-l-transparent border-r-transparent" style={{ borderTopColor: "var(--neon)" }} />
          </div>
          {/* Wheel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.17, 0.84, 0.21, 1] }}
            className="absolute inset-0 rounded-full"
            style={{ background: conic, boxShadow: "0 0 80px -10px color-mix(in oklab, var(--neon) 50%, transparent)" }}
          >
            {PRIZES.map((p, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 origin-left text-[11px] font-bold uppercase tracking-wider text-black/80"
                style={{ transform: `rotate(${i * SEG + SEG / 2}deg) translate(45%, -50%)` }}
              >
                {p.label}
              </div>
            ))}
          </motion.div>
          {/* Hub */}
          <button
            onClick={spin}
            disabled={!canSpin || spinning}
            className="absolute left-1/2 top-1/2 z-10 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-background text-sm font-bold transition disabled:cursor-not-allowed"
            style={{
              background: canSpin ? "linear-gradient(135deg, var(--neon), var(--neon-2))" : "var(--surface-2)",
              color: canSpin ? "var(--primary-foreground)" : "var(--muted-foreground)",
              boxShadow: canSpin ? "0 0 30px color-mix(in oklab, var(--neon) 60%, transparent)" : "none",
            }}
          >
            {spinning ? "..." : canSpin ? "SPIN" : <Lock className="h-5 w-5" />}
          </button>
        </div>

        <div className="space-y-4">
          {!user && (
            <div className="glass rounded-2xl p-5">
              <p className="text-sm font-semibold">Sign in to spin</p>
              <p className="mt-1 text-xs text-muted-foreground">Login required to claim coupons.</p>
              <Link to="/login" className="btn-neon mt-4 inline-block w-full text-center hover:btn-neon-hover">Sign in</Link>
            </div>
          )}
          {user && !canSpin && (
            <div className="glass rounded-2xl p-5">
              <p className="text-sm font-semibold">Come back soon</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Next spin in {formatLeft(cooldownLeft)}
              </p>
            </div>
          )}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass neon-border rounded-2xl p-5"
            >
              <Sparkles className="h-5 w-5 text-primary" />
              {result.prize.kind === "none" ? (
                <>
                  <p className="mt-2 text-lg font-bold">No prize this time</p>
                  <p className="text-xs text-muted-foreground">Try again in 24 hours.</p>
                </>
              ) : (
                <>
                  <p className="mt-2 text-lg font-bold">You won {result.prize.label}!</p>
                  <p className="mt-1 text-xs text-muted-foreground">Your coupon code:</p>
                  <p className="mt-1 font-mono text-base font-bold neon-text">{result.coupon?.code}</p>
                  <Link to="/cart" className="btn-neon mt-4 inline-flex w-full items-center justify-center gap-2 hover:btn-neon-hover">
                    <Gift className="h-4 w-4" /> Use it now
                  </Link>
                </>
              )}
            </motion.div>
          )}
          <div className="glass rounded-2xl p-5 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Prize pool</p>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {[...new Set(PRIZES.map((p) => p.label))].map((l) => (
                <li key={l} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatLeft(ms: number) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}
