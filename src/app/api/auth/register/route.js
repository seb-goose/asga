import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

const MEMBERSHIP_TYPES = ["single_adult", "youth", "family"];

export async function POST(request) {
  const body = await request.json();
  const {
    email,
    password,
    firstName,
    lastName,
    farmName,
    mailingAddress,
    city,
    state,
    zip,
    phone,
    website,
    membershipType,
    ownsGeese,
    primaryInterests,
    primaryInterestOther,
    poultryOrgs,
    poultryOrgOther,
    participationInterests,
    directoryOptIn,
    directoryFarmName,
    directoryCity,
    directoryState,
    directoryZip,
    directoryEmail,
    directoryPhone,
    directoryWebsite,
    directoryContactMethods,
    directoryColors,
    directoryColorsOther,
    directoryOffers,
    directoryDeliveryOptions,
    directoryDeliveryOther,
    directoryFocus,
    directoryNotes,
    communicationOptIn,
    codeOfConductAgreed,
  } = body;

  if (!email || !password || !firstName || !lastName) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!MEMBERSHIP_TYPES.includes(membershipType)) {
    return NextResponse.json({ error: "Please select a membership type." }, { status: 400 });
  }
  if (!Array.isArray(primaryInterests) || primaryInterests.length === 0) {
    return NextResponse.json(
      { error: "Please select at least one primary interest." },
      { status: 400 },
    );
  }
  if (!codeOfConductAgreed) {
    return NextResponse.json(
      { error: "Please agree to the Code of Conduct policies to continue." },
      { status: 400 },
    );
  }

  const origin = request.headers.get("origin") || new URL(request.url).origin;

  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  const { data: signUpData, error: signUpError } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/en/account`,
    },
  });

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 });
  }

  const userId = signUpData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Sign-up failed. Please try again." }, { status: 500 });
  }

  const supabaseAdmin = createAdminClient();
  const { error: profileError } = await supabaseAdmin.from("members").insert({
    id: userId,
    first_name: firstName,
    last_name: lastName,
    farm_name: farmName || null,
    mailing_address: mailingAddress || null,
    city: city || null,
    state: state || null,
    zip: zip || null,
    phone: phone || null,
    email,
    website: website || null,
    membership_type: membershipType,
    owns_geese: ownsGeese || null,
    primary_interests: primaryInterests,
    primary_interest_other: primaryInterestOther || null,
    poultry_orgs: poultryOrgs || [],
    poultry_org_other: poultryOrgOther || null,
    participation_interests: participationInterests || [],
    directory_opt_in: directoryOptIn === "yes",
    directory_farm_name: directoryFarmName || null,
    directory_city: directoryCity || null,
    directory_state: directoryState || null,
    directory_zip: directoryZip || null,
    directory_email: directoryEmail || null,
    directory_phone: directoryPhone || null,
    directory_website: directoryWebsite || null,
    directory_contact_methods: directoryContactMethods || [],
    directory_colors: directoryColors || [],
    directory_colors_other: directoryColorsOther || null,
    directory_offers: directoryOffers || [],
    directory_delivery_options: directoryDeliveryOptions || [],
    directory_delivery_other: directoryDeliveryOther || null,
    directory_focus: directoryFocus || [],
    directory_notes: directoryNotes || null,
    communication_opt_in: Boolean(communicationOptIn),
    code_of_conduct_agreed: Boolean(codeOfConductAgreed),
  });

  if (profileError) {
    // Roll back the auth user so a retry with the same email starts clean.
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
