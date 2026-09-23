import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOrder, isRegistrationPaymentComplete, getCaptureId } from "@/lib/paypal";

const MEMBERSHIP_TYPES = ["single", "family", "junior"];

export async function POST(request) {
  const body = await request.json();
  const {
    userId,
    email,
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
    paypalOrderId,
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

  if (!userId || !email || !firstName || !lastName) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  if (!MEMBERSHIP_TYPES.includes(membershipType)) {
    return NextResponse.json({ error: "Please select a membership type." }, { status: 400 });
  }
  if (!paypalOrderId) {
    return NextResponse.json({ error: "Missing payment confirmation." }, { status: 400 });
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

  const supabaseAdmin = createAdminClient();

  // The client reports payment success, but that's never trusted on its
  // own - re-verify the order directly with PayPal before creating the
  // member row, and roll back the auth user (created client-side just
  // before this call) if verification fails.
  let paypalOrder;
  try {
    paypalOrder = await getOrder(paypalOrderId);
  } catch {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json({ error: "Could not verify payment with PayPal." }, { status: 502 });
  }
  if (!isRegistrationPaymentComplete(paypalOrder, membershipType)) {
    await supabaseAdmin.auth.admin.deleteUser(userId);
    return NextResponse.json(
      { error: "Payment has not completed. Please try again." },
      { status: 402 },
    );
  }

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
    payment_status: "paid",
    paypal_order_id: paypalOrderId,
    paypal_capture_id: getCaptureId(paypalOrder),
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
