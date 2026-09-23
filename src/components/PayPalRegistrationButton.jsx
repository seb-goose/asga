"use client";

import { useEffect, useRef, useState } from "react";

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export default function PayPalRegistrationButton({ membershipType, onPaid, onError }) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (window.paypal) {
      setSdkReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture`;
    script.onload = () => setSdkReady(true);
    script.onerror = () => onError("Could not load PayPal. Please refresh and try again.");
    document.body.appendChild(script);
  }, [onError]);

  useEffect(() => {
    if (!sdkReady || !containerRef.current || !window.paypal) return;

    containerRef.current.innerHTML = "";
    const buttons = window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", label: "pay" },
      createOrder: async () => {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ membershipType }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not start payment.");
        return data.id;
      },
      onApprove: async (data) => {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: data.orderID }),
        });
        const result = await res.json();
        if (!res.ok || result.status !== "COMPLETED") {
          onError(result.error || "Payment could not be completed. Please try again.");
          return;
        }
        onPaid(data.orderID);
      },
      onError: () => onError("PayPal payment failed. Please try again."),
    });
    buttons.render(containerRef.current);

    return () => buttons.close?.();
  }, [sdkReady, membershipType, onPaid, onError]);

  return <div ref={containerRef} />;
}
