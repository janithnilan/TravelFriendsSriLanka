import { NextResponse } from "next/server";

export const revalidate = 43200;

const currencies = ["USD", "GBP", "EUR", "AUD"] as const;

export async function GET() {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/LKR", {
      next: { revalidate: 43200 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Exchange rates are temporarily unavailable." },
        { status: 502 },
      );
    }

    const data = await response.json();

    if (data.result !== "success" || !data.rates) {
      return NextResponse.json(
        { error: "Exchange rates are temporarily unavailable." },
        { status: 502 },
      );
    }

    const rates = Object.fromEntries(
      currencies.map((code) => {
        const lkrPerUnit = data.rates[code];
        return [
          code,
          typeof lkrPerUnit === "number" && lkrPerUnit > 0
            ? 1 / lkrPerUnit
            : null,
        ];
      }),
    );

    if (currencies.some((code) => rates[code] === null)) {
      return NextResponse.json(
        { error: "Some exchange rates are temporarily unavailable." },
        { status: 502 },
      );
    }

    return NextResponse.json({
      base: "LKR",
      quote: "LKR per 1 unit of foreign currency",
      rates,
      updatedAt: data.time_last_update_utc ?? null,
      source: "ExchangeRate-API Open Access",
      sourceUrl: "https://www.exchangerate-api.com",
    });
  } catch {
    return NextResponse.json(
      { error: "Exchange rates are temporarily unavailable." },
      { status: 502 },
    );
  }
}
