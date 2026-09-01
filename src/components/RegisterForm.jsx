"use client";

import Link from "next/link";
import { useState } from "react";

const MEMBERSHIP_TYPES = [
  { value: "single_adult", label: "Single Adult 18 & Over", price: "$30" },
  { value: "junior", label: "Junior", price: "$20" },
  { value: "family", label: "Family", price: "$40" },
];

const OWNS_GEESE_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "planning", label: "Planning to in the future" },
];

const PRIMARY_INTERESTS = [
  "Exhibition / Showing",
  "Breeding",
  "Preservation",
  "Education",
  "Youth Programs",
  "Pet / Hobby Ownership",
  "Learning About the Breed",
];

const POULTRY_ORGS = ["APA", "ABA", "Local / Regional Club"];

const PARTICIPATION_INTERESTS = [
  "Shows / Meets",
  "Membership",
  "Youth Programs",
  "Education",
  "Fundraising",
  "Website / Social Media",
  "Committees",
  "Not at this time",
];

const inputClass =
  "w-full border border-stone-gray bg-white px-3 py-2 text-heritage-navy focus:border-heritage-teal focus:outline-none";
const labelClass = "mb-1 block text-sm font-semibold text-heritage-navy";
const sectionHeadingClass =
  "bg-heritage-navy px-4 py-2 text-sm font-bold tracking-wider text-warm-cream uppercase";

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export default function RegisterForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    farmName: "",
    mailingAddress: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    website: "",
    membershipType: "",
    ownsGeese: "",
    primaryInterests: [],
    primaryInterestOther: "",
    poultryOrgs: [],
    poultryOrgOther: "",
    participationInterests: [],
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const toggleList = (field, value) => () =>
    setForm((prev) => ({ ...prev, [field]: toggleValue(prev[field], value) }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.membershipType) {
      setError("Please select a membership type.");
      return;
    }
    if (form.primaryInterests.length === 0) {
      setError("Please select at least one primary interest.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="font-heading text-2xl font-semibold text-heritage-navy">
          Check your email
        </h1>
        <p className="mt-4 text-heritage-navy">
          We&apos;ve sent a confirmation link to <strong>{form.email}</strong>. Follow it to
          activate your account, then{" "}
          <Link href="/login" className="text-heritage-teal underline">
            sign in
          </Link>
          .
        </p>
        <p className="mt-4 text-sm text-heritage-navy/70">
          Membership fee payment isn&apos;t collected yet - we&apos;ll follow up separately once
          that&apos;s ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-8 px-6 py-12">
      <div className="text-center">
        <h1 className="font-heading text-3xl font-semibold text-heritage-navy">
          Membership Application
        </h1>
        <p className="mt-2 text-heritage-navy/80">
          Join the American Sebastopol Goose Association.
        </p>
      </div>

      {error && (
        <p className="border border-red-400 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className={inputClass}
              value={form.email}
              onChange={update("email")}
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
              minLength={8}
              className={inputClass}
              value={form.password}
              onChange={update("password")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              className={inputClass}
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Member Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              required
              className={inputClass}
              value={form.firstName}
              onChange={update("firstName")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              required
              className={inputClass}
              value={form.lastName}
              onChange={update("lastName")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="farmName">
              Farm / Breeder Name (if applicable)
            </label>
            <input
              id="farmName"
              className={inputClass}
              value={form.farmName}
              onChange={update("farmName")}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="mailingAddress">
              Mailing Address
            </label>
            <input
              id="mailingAddress"
              className={inputClass}
              value={form.mailingAddress}
              onChange={update("mailingAddress")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="city">
              City
            </label>
            <input
              id="city"
              className={inputClass}
              value={form.city}
              onChange={update("city")}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="state">
                State
              </label>
              <input
                id="state"
                className={inputClass}
                value={form.state}
                onChange={update("state")}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="zip">
                ZIP
              </label>
              <input
                id="zip"
                className={inputClass}
                value={form.zip}
                onChange={update("zip")}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              className={inputClass}
              value={form.phone}
              onChange={update("phone")}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="website">
              Website / Social Media (optional)
            </label>
            <input
              id="website"
              className={inputClass}
              value={form.website}
              onChange={update("website")}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Membership</h2>
        <div className="space-y-2">
          {MEMBERSHIP_TYPES.map((option) => (
            <label key={option.value} className="flex items-center gap-2 text-heritage-navy">
              <input
                type="radio"
                name="membershipType"
                value={option.value}
                checked={form.membershipType === option.value}
                onChange={update("membershipType")}
                required
              />
              {option.label}: {option.price}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>About You</h2>
        <div>
          <p className={labelClass}>Do you currently own or raise Sebastopol geese?</p>
          <div className="flex flex-wrap gap-4">
            {OWNS_GEESE_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-heritage-navy">
                <input
                  type="radio"
                  name="ownsGeese"
                  value={option.value}
                  checked={form.ownsGeese === option.value}
                  onChange={update("ownsGeese")}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className={labelClass}>Primary interests (select at least one)</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRIMARY_INTERESTS.map((interest) => (
              <label key={interest} className="flex items-center gap-2 text-heritage-navy">
                <input
                  type="checkbox"
                  checked={form.primaryInterests.includes(interest)}
                  onChange={toggleList("primaryInterests", interest)}
                />
                {interest}
              </label>
            ))}
            <label className="flex items-center gap-2 text-heritage-navy">
              <input
                type="checkbox"
                checked={form.primaryInterests.includes("Other")}
                onChange={toggleList("primaryInterests", "Other")}
              />
              Other:
            </label>
            {form.primaryInterests.includes("Other") && (
              <input
                className={inputClass}
                placeholder="Please specify"
                value={form.primaryInterestOther}
                onChange={update("primaryInterestOther")}
              />
            )}
          </div>
        </div>

        <div>
          <p className={labelClass}>Poultry / waterfowl organizations (optional)</p>
          <div className="flex flex-wrap gap-4">
            {POULTRY_ORGS.map((org) => (
              <label key={org} className="flex items-center gap-2 text-heritage-navy">
                <input
                  type="checkbox"
                  checked={form.poultryOrgs.includes(org)}
                  onChange={toggleList("poultryOrgs", org)}
                />
                {org}
              </label>
            ))}
            <label className="flex items-center gap-2 text-heritage-navy">
              <input
                type="checkbox"
                checked={form.poultryOrgs.includes("Other")}
                onChange={toggleList("poultryOrgs", "Other")}
              />
              Other:
            </label>
            {form.poultryOrgs.includes("Other") && (
              <input
                className={inputClass}
                placeholder="Please specify"
                value={form.poultryOrgOther}
                onChange={update("poultryOrgOther")}
              />
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>ASGA Participation</h2>
        <p className={labelClass}>Would you be interested in helping with ASGA activities?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {PARTICIPATION_INTERESTS.map((interest) => (
            <label key={interest} className="flex items-center gap-2 text-heritage-navy">
              <input
                type="checkbox"
                checked={form.participationInterests.includes(interest)}
                onChange={toggleList("participationInterests", interest)}
              />
              {interest}
            </label>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-heritage-gold px-5 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90 disabled:opacity-50"
      >
        {status === "submitting" ? "Submitting..." : "Submit Application"}
      </button>

      <p className="text-center text-sm text-heritage-navy">
        Already a member?{" "}
        <Link href="/login" className="text-heritage-teal underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
