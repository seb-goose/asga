import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export const metadata = {
  title: "My Account",
};

const MEMBERSHIP_LABELS = {
  single_adult: "Single Adult 18 & Over ($30)",
  youth: "Youth ($15)",
  family: "Family ($40)",
};

const PAYMENT_LABELS = {
  pending: "Pending - payment collection isn't set up yet",
  paid: "Paid",
  waived: "Waived",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase.from("members").select("*").eq("id", user.id).single();

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold text-heritage-navy">My Account</h1>
        <SignOutButton />
      </div>

      <div className="space-y-2 text-heritage-navy">
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        {member && (
          <>
            <p>
              <span className="font-semibold">Name:</span> {member.first_name} {member.last_name}
            </p>
            <p>
              <span className="font-semibold">Membership:</span>{" "}
              {MEMBERSHIP_LABELS[member.membership_type] || member.membership_type}
            </p>
            <p>
              <span className="font-semibold">Payment status:</span>{" "}
              {PAYMENT_LABELS[member.payment_status] || member.payment_status}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
