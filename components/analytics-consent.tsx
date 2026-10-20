"use client";

import { useEffect, useRef, useState } from "react";
import { visitInactivityMs } from "@/lib/analytics-policy";

const consentKey = "tf-analytics-permission";
const activityKey = "tf-analytics-last-load";

export function AnalyticsConsent({ enabled }: { enabled: boolean }) {
  const [state, setState] = useState("No collection without your permission.");
  const attempted = useRef(false);

  async function sendPageView() {
    if (attempted.current) return;
    attempted.current = true;
    if (
      navigator.doNotTrack === "1" ||
      (navigator as Navigator & { globalPrivacyControl?: boolean })
        .globalPrivacyControl
    ) {
      setState(
        "Your browser privacy preference is respected. Collection is off.",
      );
      return;
    }
    try {
      const now = Date.now();
      const last = Number(sessionStorage.getItem(activityKey));
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consent: true,
          visitStart: !last || now - last >= visitInactivityMs,
        }),
        credentials: "same-origin",
        cache: "no-store",
      });
      if (response.ok) {
        sessionStorage.setItem(activityKey, String(now));
        setState("Aggregate measurement allowed for this tab.");
      } else
        setState(
          "Collection unavailable. No successful recording was confirmed.",
        );
    } catch {
      setState("Collection unavailable. Nothing was confirmed as recorded.");
    }
  }

  useEffect(() => {
    if (!enabled) return;
    try {
      if (sessionStorage.getItem(consentKey) === "allowed") void sendPageView();
    } catch {
      setState("Tab storage unavailable. Collection is off.");
    }
  }, [enabled]);

  if (!enabled)
    return (
      <p className="analytics-period-status">
        Collection is disabled by the site. No visitor events are sent.
      </p>
    );
  return (
    <div className="analytics-consent">
      <p>
        Optional first-party measurement counts homepage loads and tab visits in
        daily aggregates. No IPs or browsing histories are stored. Tab-only
        permission expires when this tab closes. Withdrawing stops future
        collection; existing anonymous totals cannot be linked back to you.
      </p>
      <div>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            try {
              const alreadyAllowed =
                sessionStorage.getItem(consentKey) === "allowed";
              sessionStorage.setItem(consentKey, "allowed");
              if (!alreadyAllowed) void sendPageView();
            } catch {
              setState("Tab storage unavailable. Collection is off.");
            }
          }}
        >
          Allow aggregate measurement
        </button>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            try {
              sessionStorage.removeItem(consentKey);
              sessionStorage.removeItem(activityKey);
            } catch {
              setState(
                "Tab storage unavailable. No further collection will be attempted.",
              );
              return;
            }
            setState("Collection is off for future loads in this tab.");
          }}
        >
          Decline / withdraw
        </button>
      </div>
      <p role="status">{state}</p>
    </div>
  );
}
