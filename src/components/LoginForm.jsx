"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-stone-gray bg-white px-3 py-2 text-heritage-navy focus:border-heritage-teal focus:outline-none";
const labelClass = "mb-1 block text-sm font-semibold text-heritage-navy";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6 px-6 py-16">
      <h1 className="font-heading text-center text-3xl font-semibold text-heritage-navy">
        Sign In
      </h1>

      {error && (
        <p className="border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className={inputClass}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          className={inputClass}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-heritage-gold px-5 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Signing in..." : "Sign In"}
      </button>

      <div className="flex justify-between text-sm text-heritage-navy">
        <Link href="/forgot-password" className="text-heritage-teal underline">
          Forgot password?
        </Link>
        <Link href="/register" className="text-heritage-teal underline">
          Apply for membership
        </Link>
      </div>
    </form>
  );
}
