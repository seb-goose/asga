"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-stone-gray bg-white px-3 py-2 text-heritage-navy focus:border-heritage-teal focus:outline-none";
const labelClass = "mb-1 block text-sm font-semibold text-heritage-navy";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/account");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-6 px-6 py-16">
      <h1 className="font-heading text-center text-3xl font-semibold text-heritage-navy">
        Set New Password
      </h1>

      {error && (
        <p className="border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div>
        <label className={labelClass} htmlFor="password">
          New Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          className={inputClass}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="confirmPassword">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          required
          minLength={8}
          className={inputClass}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-heritage-gold px-5 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save Password"}
      </button>
    </form>
  );
}
