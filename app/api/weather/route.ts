import { NextResponse } from "next/server";

export const revalidate = 3600;

const places = [
  { city: "Colombo", region: "Western coast" },
  { city: "Kandy", region: "Central hills" },
  { city: "Ella", region: "Hill country" },
];

export async function GET() {
  const apiKey = process.env.WEATHERAPI_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Weather service is not configured." },
      { status: 503 },
    );
  }

  try {
    const weather = await Promise.all(
      places.map(async (place) => {
        const url = new URL("https://api.weatherapi.com/v1/current.json");
        url.searchParams.set("key", apiKey);
        url.searchParams.set("q", place.city);
        url.searchParams.set("aqi", "no");

        const response = await fetch(url, {
          next: { revalidate: 3600 },
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Weather unavailable for ${place.city}`);
        }

        const data = await response.json();

        return {
          city: place.city,
          region: place.region,
          temperatureC: data.current.temp_c,
          condition: data.current.condition.text,
          icon: `https:${data.current.condition.icon}`,
          updatedAt: data.current.last_updated,
          localTime: data.location.localtime,
        };
      }),
    );

    return NextResponse.json({
      places: weather,
      source: "WeatherAPI.com",
      sourceUrl: "https://www.weatherapi.com/",
      disclaimer: "Weather information is provided by WeatherAPI.com.",
    });
  } catch {
    return NextResponse.json(
      { error: "Weather information is temporarily unavailable." },
      { status: 502 },
    );
  }
}
