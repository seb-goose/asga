"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-stone-gray bg-white px-3 py-2 text-heritage-navy focus:border-heritage-teal focus:outline-none";
const labelClass = "mb-1 block text-sm font-semibold text-heritage-navy";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/en/update-password`,
    });

    setSubmitting(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold text-heritage-navy">
          Check your email
        </h1>
        <p className="mt-4 text-heritage-navy">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a link to reset your
          password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6 px-6 py-16">
      <h1 className="font-heading text-center text-3xl font-semibold text-heritage-navy">
        Reset Password
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

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-heritage-gold px-5 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Reset Link"}
      </button>

      <p className="text-center text-sm text-heritage-navy">
        <Link href="/login" className="text-heritage-teal underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
