"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MEMBERSHIP_TYPES = [
  { value: "single_adult", label: "Single Adult 18 & Over", price: "$30" },
  { value: "youth", label: "Youth", price: "$15" },
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

const DIRECTORY_CONTACT_METHODS = ["Email", "Phone"];

const SEBASTOPOL_COLORS = [
  "White",
  "Buff",
  "Gray / Grey",
  "Blue",
  "Lavender",
  "Lilac",
  "Cream",
  "Saddleback",
  "Splash",
];

const OFFER_TYPES = ["Hatching Eggs", "Goslings", "Juveniles", "Adults"];

const DELIVERY_OPTIONS = ["Ships Hatching Eggs", "Ships Live Birds", "Local Pickup Only"];

const BREEDING_FOCUS_OPTIONS = [
  "Exhibition",
  "Breeding Stock",
  "Pet / Hobby Homes",
  "Multiple / All of the Above",
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
    directoryOptIn: "",
    directoryFarmName: "",
    directoryCity: "",
    directoryState: "",
    directoryZip: "",
    directoryEmail: "",
    directoryPhone: "",
    directoryWebsite: "",
    directoryContactMethods: [],
    directoryColors: [],
    directoryColorsOther: "",
    directoryOffers: [],
    directoryDeliveryOptions: [],
    directoryDeliveryOther: "",
    directoryFocus: [],
    directoryNotes: "",
    communicationOptIn: false,
    codeOfConductAgreed: false,
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const toggleList = (field, value) => () =>
    setForm((prev) => ({ ...prev, [field]: toggleValue(prev[field], value) }));

  const toggleChecked = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.checked }));

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
    if (!form.codeOfConductAgreed) {
      setError("Please agree to the Code of Conduct policies to continue.");
      return;
    }

    setStatus("submitting");

    try {
      // Sign up from the browser so the PKCE code verifier lands in a
      // cookie here - it has to be read back from this same browser when
      // the confirmation link opens /auth/callback later.
      const supabase = createClient();
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/en/email-verified`,
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      const userId = signUpData.user?.id;
      if (!userId) {
        throw new Error("Sign-up failed. Please try again.");
      }

      const { password: _password, confirmPassword: _confirmPassword, ...profile } = form;
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, userId }),
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

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>ASGA Breeders Directory</h2>
        <p className="text-sm text-heritage-navy">
          ASGA maintains an optional Breeders Directory to help connect individuals looking for
          Sebastopol geese with ASGA members who breed and/or offer them.
        </p>
        <div>
          <p className={labelClass}>Would you like to be included in the ASGA Breeders Directory?</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-heritage-navy">
              <input
                type="radio"
                name="directoryOptIn"
                value="yes"
                checked={form.directoryOptIn === "yes"}
                onChange={update("directoryOptIn")}
              />
              Yes
            </label>
            <label className="flex items-center gap-2 text-heritage-navy">
              <input
                type="radio"
                name="directoryOptIn"
                value="no"
                checked={form.directoryOptIn === "no"}
                onChange={update("directoryOptIn")}
              />
              No
            </label>
          </div>
        </div>

        {form.directoryOptIn === "yes" && (
          <div className="space-y-4 border-l-2 border-stone-gray pl-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass} htmlFor="directoryFarmName">
                  Farm / Breeder Name
                </label>
                <input
                  id="directoryFarmName"
                  className={inputClass}
                  value={form.directoryFarmName}
                  onChange={update("directoryFarmName")}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="directoryCity">
                  City
                </label>
                <input
                  id="directoryCity"
                  className={inputClass}
                  value={form.directoryCity}
                  onChange={update("directoryCity")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="directoryState">
                    State
                  </label>
                  <input
                    id="directoryState"
                    className={inputClass}
                    value={form.directoryState}
                    onChange={update("directoryState")}
                  />
                </div>
                <div>
                  <label className={labelClass} htmlFor="directoryZip">
                    ZIP
                  </label>
                  <input
                    id="directoryZip"
                    className={inputClass}
                    value={form.directoryZip}
                    onChange={update("directoryZip")}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="directoryEmail">
                  Email
                </label>
                <input
                  id="directoryEmail"
                  type="email"
                  className={inputClass}
                  value={form.directoryEmail}
                  onChange={update("directoryEmail")}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="directoryPhone">
                  Phone
                </label>
                <input
                  id="directoryPhone"
                  type="tel"
                  className={inputClass}
                  value={form.directoryPhone}
                  onChange={update("directoryPhone")}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="directoryWebsite">
                  Website / Social Media
                </label>
                <input
                  id="directoryWebsite"
                  className={inputClass}
                  value={form.directoryWebsite}
                  onChange={update("directoryWebsite")}
                />
              </div>
            </div>

            <div>
              <p className={labelClass}>Preferred contact method</p>
              <div className="flex flex-wrap gap-4">
                {DIRECTORY_CONTACT_METHODS.map((method) => (
                  <label key={method} className="flex items-center gap-2 text-heritage-navy">
                    <input
                      type="checkbox"
                      checked={form.directoryContactMethods.includes(method)}
                      onChange={toggleList("directoryContactMethods", method)}
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className={labelClass}>Sebastopol Colors / Varieties You Breed</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SEBASTOPOL_COLORS.map((color) => (
                  <label key={color} className="flex items-center gap-2 text-heritage-navy">
                    <input
                      type="checkbox"
                      checked={form.directoryColors.includes(color)}
                      onChange={toggleList("directoryColors", color)}
                    />
                    {color}
                  </label>
                ))}
                <label className="flex items-center gap-2 text-heritage-navy">
                  <input
                    type="checkbox"
                    checked={form.directoryColors.includes("Other")}
                    onChange={toggleList("directoryColors", "Other")}
                  />
                  Other:
                </label>
                {form.directoryColors.includes("Other") && (
                  <input
                    className={inputClass}
                    placeholder="Please specify"
                    value={form.directoryColorsOther}
                    onChange={update("directoryColorsOther")}
                  />
                )}
              </div>
            </div>

            <div>
              <p className={labelClass}>What You Typically Offer</p>
              <div className="flex flex-wrap gap-4">
                {OFFER_TYPES.map((offer) => (
                  <label key={offer} className="flex items-center gap-2 text-heritage-navy">
                    <input
                      type="checkbox"
                      checked={form.directoryOffers.includes(offer)}
                      onChange={toggleList("directoryOffers", offer)}
                    />
                    {offer}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className={labelClass}>Sales / Delivery Options</p>
              <div className="flex flex-wrap gap-4">
                {DELIVERY_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-heritage-navy">
                    <input
                      type="checkbox"
                      checked={form.directoryDeliveryOptions.includes(option)}
                      onChange={toggleList("directoryDeliveryOptions", option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              <label className={labelClass} htmlFor="directoryDeliveryOther">
                Other delivery / meeting options
              </label>
              <input
                id="directoryDeliveryOther"
                className={inputClass}
                value={form.directoryDeliveryOther}
                onChange={update("directoryDeliveryOther")}
              />
            </div>

            <div>
              <p className={labelClass}>Breeding / Exhibition Focus</p>
              <div className="flex flex-wrap gap-4">
                {BREEDING_FOCUS_OPTIONS.map((focus) => (
                  <label key={focus} className="flex items-center gap-2 text-heritage-navy">
                    <input
                      type="checkbox"
                      checked={form.directoryFocus.includes(focus)}
                      onChange={toggleList("directoryFocus", focus)}
                    />
                    {focus}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="directoryNotes">
                Directory Listing Notes - additional information you would like included
              </label>
              <textarea
                id="directoryNotes"
                rows={3}
                className={inputClass}
                value={form.directoryNotes}
                onChange={update("directoryNotes")}
              />
            </div>

            <p className="text-sm text-heritage-navy/70">
              <strong>Directory Permission:</strong> By selecting Yes above, I give ASGA permission
              to publish the Breeders Directory information I have provided. I understand that
              inclusion in the directory does not constitute an endorsement or guarantee by ASGA
              regarding individual breeders, birds, availability, health, quality, sales, shipping,
              or transactions.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className={sectionHeadingClass}>Communication &amp; Membership Agreement</h2>
        <label className="flex items-start gap-2 text-heritage-navy">
          <input
            type="checkbox"
            className="mt-1"
            checked={form.communicationOptIn}
            onChange={toggleChecked("communicationOptIn")}
          />
          I agree to receive ASGA announcements, newsletters, meeting information, show/meet
          information, and other association communications by email.
        </label>
        <div className="space-y-2 text-sm text-heritage-navy">
          <p>
            Members must be aware of the Code of Conduct, and its policies. Bullying and
            harassment, complaints, grievance procedure, and disciplinary procedure as indicated
            in this document. Members will use the highest ethical standards and methods in
            acquiring, handling, breeding, showing, selling, shipping, advertising, care, and
            keeping of hatching eggs and stock. Members agree to conduct themselves in a
            respectful and sportsmanlike manner at club functions and online spaces.
          </p>
          <p>
            Actions deemed harmful to the club, breed, or members must be submitted in writing to
            a member of the Board. Submitted charges shall be reviewed by the Officers and the
            Board of Directors. With a majority vote conducted by the Board of Directors, the
            accused member may be suspended for a given time or expelled. All rights of the
            membership of the Association may be revoked.
          </p>
        </div>
        <label className="flex items-start gap-2 text-heritage-navy">
          <input
            type="checkbox"
            required
            className="mt-1"
            checked={form.codeOfConductAgreed}
            onChange={toggleChecked("codeOfConductAgreed")}
          />
          I understand these policies and agree.
        </label>
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
