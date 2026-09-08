import Link from "next/link";

export const metadata = {
  title: "Email Verified",
};

export default function EmailVerifiedPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="font-heading text-2xl font-semibold text-heritage-navy">
        Your email is verified
      </h1>
      <p className="mt-4 text-heritage-navy">
        Thanks for confirming your email address. You can now sign in to your account.
      </p>
      <Link
        href="/login"
        className="mt-6 inline-block bg-heritage-gold px-5 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90"
      >
        Sign In
      </Link>
    </div>
  );
}
