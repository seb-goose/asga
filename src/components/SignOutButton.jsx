"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="bg-heritage-navy px-5 py-2.5 text-xs font-bold tracking-wider text-warm-cream uppercase hover:bg-classic-navy"
    >
      Sign Out
    </button>
  );
}
