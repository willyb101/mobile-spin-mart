import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — SmartPhone Hub" }] }),
  component: Login,
});

function Login() {
  const setUser = useStore((s) => s.setUser);
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-5 py-10">
      <div className="glass w-full rounded-2xl p-7">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login" ? "Sign in to save devices and check out faster." : "Join SmartPhone Hub in seconds."}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setUser({ email, name: name || email.split("@")[0] });
            navigate({ to: "/account" });
          }}
          className="mt-5 space-y-3"
        >
          {mode === "signup" && (
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          )}
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button className="btn-neon w-full hover:btn-neon-hover">
            {mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === "login" ? "New here? " : "Have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary hover:underline"
          >
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Forgot password?</Link>
        </p>
        <p className="mt-4 rounded-md border border-border bg-card/40 p-2 text-center text-[11px] text-muted-foreground">
          Demo mode — auth is local-only. Real auth coming in v2.
        </p>
      </div>
    </div>
  );
}
