// Server-only PayPal REST API helper. Never import from a Client Component.
//
// Membership fees are fixed here, not accepted from the client, so a
// tampered request can't create an order for less than the real price.
// PAYPAL_ENVIRONMENT selects the sandbox or live API base - defaults to
// sandbox so nothing charges real money until it's explicitly set to
// "live".

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const CURRENCY_CODE = "USD";

export const MEMBERSHIP_FEES = {
  single: "30.00",
  family: "40.00",
  junior: "15.00",
};

async function getAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("PayPal is not configured.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Could not authenticate with PayPal.");
  }
  const data = await res.json();
  return data.access_token;
}

export async function createRegistrationOrder(membershipType) {
  const fee = MEMBERSHIP_FEES[membershipType];
  if (!fee) {
    throw new Error("Please select a membership type.");
  }

  const accessToken = await getAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: `ASGA ${membershipType} Membership`,
          amount: { value: fee, currency_code: CURRENCY_CODE },
        },
      ],
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not create PayPal order.");
  }
  return data;
}

export async function captureOrder(orderId) {
  const accessToken = await getAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not capture PayPal payment.");
  }
  return data;
}

export async function getOrder(orderId) {
  const accessToken = await getAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not verify PayPal order.");
  }
  return data;
}

// Re-checked server-side before a member row is ever created - the client's
// report of payment success is never trusted on its own.
export function isRegistrationPaymentComplete(order, membershipType) {
  const fee = MEMBERSHIP_FEES[membershipType];
  if (!fee) return false;

  const capture = order?.purchase_units?.[0]?.payments?.captures?.[0];
  return (
    order?.status === "COMPLETED" &&
    capture?.status === "COMPLETED" &&
    capture?.amount?.value === fee &&
    capture?.amount?.currency_code === CURRENCY_CODE
  );
}

export function getCaptureId(order) {
  return order?.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null;
}
