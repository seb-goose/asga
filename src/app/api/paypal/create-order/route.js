import { NextResponse } from "next/server";
import { createRegistrationOrder } from "@/lib/paypal";

export async function POST(request) {
  const { membershipType } = await request.json();
  try {
    const order = await createRegistrationOrder(membershipType);
    return NextResponse.json({ id: order.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
