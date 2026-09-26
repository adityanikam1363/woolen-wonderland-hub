import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Owner Login — Woolen Decorations" },
      { name: "description", content: "Owner login for managing Woolen Decorations products." },
      { property: "og:title", content: "Owner Login — Woolen Decorations" },
      { property: "og:description", content: "Owner-only product management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const REMEMBERED_OWNER_EMAIL_KEY = "owner-login-email";

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(REMEMBERED_OWNER_EMAIL_KEY) ?? "";
  });
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.localStorage.getItem(REMEMBERED_OWNER_EMAIL_KEY));
  });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const resolvedEmail = email.trim();
    const resolvedPassword = password;
    setBusy(true);

    if (mode === "in") {
      if (rememberMe) window.localStorage.setItem(REMEMBERED_OWNER_EMAIL_KEY, resolvedEmail);
      else window.localStorage.removeItem(REMEMBERED_OWNER_EMAIL_KEY);
      const { data, error } = await supabase.auth.signInWithPassword({ email: resolvedEmail, password: resolvedPassword });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (data.session) nav({ to: "/admin" });
      else toast.success("Login succeeded. Redirecting…");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: resolvedEmail,
      password: resolvedPassword,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (data.session) nav({ to: "/admin" });
    else toast.success("Check your email to confirm your account, then log in.");
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="text-center text-4xl font-bold text-primary">Owner {mode === "in" ? "Login" : "Setup"}</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {mode === "in" ? "Sign in to manage the shop." : "One-time setup: the first account becomes the shop owner."}
        </p>
        <form onSubmit={submit} autoComplete="on" className="mt-6 space-y-4 rounded-lg border-2 border-gold/50 bg-card p-6">
          <div><Label htmlFor="e">Email</Label><Input id="e" name="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div><Label htmlFor="pw">Password</Label><Input id="pw" name="password" type="password" autoComplete="current-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          {mode === "in" && (
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked === true)} />
              <Label htmlFor="remember">Remember me</Label>
            </div>
          )}
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Please wait…" : mode === "in" ? "Log in" : "Create owner account"}</Button>
        </form>
        <button className="mt-4 w-full text-center text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "First time? Set up the owner account" : "Already have an account? Log in"}
        </button>
      </div>
    </SiteLayout>
  );
}
