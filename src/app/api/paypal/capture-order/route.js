import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";

export async function POST(request) {
  const { orderID } = await request.json();
  if (!orderID) {
    return NextResponse.json({ error: "Missing orderID." }, { status: 400 });
  }

  try {
    const capture = await captureOrder(orderID);
    return NextResponse.json({ status: capture.status });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
