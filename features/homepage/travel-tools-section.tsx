"use client";

import { useEffect, useState } from "react";

const currencyPreviews = [
  { flag: "🇺🇸", code: "USD", name: "US dollar" },
  { flag: "🇬🇧", code: "GBP", name: "British pound" },
  { flag: "🇪🇺", code: "EUR", name: "Euro" },
  { flag: "🇦🇺", code: "AUD", name: "Australian dollar" },
];

type WeatherPlace = {
  city: string;
  region: string;
  temperatureC: number;
  condition: string;
  icon: string;
  updatedAt: string;
  localTime: string;
};

type WeatherData = {
  places: WeatherPlace[];
  sourceUrl: string;
};

type ExchangeRates = {
  rates: Record<string, number>;
  updatedAt: string | null;
  sourceUrl: string;
};

export function TravelToolsSection() {
  const [weatherPlaces, setWeatherPlaces] = useState<WeatherPlace[]>([]);
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [ratesUnavailable, setRatesUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      try {
        const response = await fetch("/api/weather");
        if (!response.ok) throw new Error("Weather unavailable");

        const data = (await response.json()) as WeatherData;
        if (!cancelled) setWeatherPlaces(data.places);
      } catch {
        if (!cancelled) setWeatherUnavailable(true);
      }
    }

    async function loadRates() {
      try {
        const response = await fetch("/api/exchange-rates");
        if (!response.ok) throw new Error("Rates unavailable");

        const data = (await response.json()) as ExchangeRates;
        if (!cancelled) setExchangeRates(data);
      } catch {
        if (!cancelled) setRatesUnavailable(true);
      }
    }

    loadWeather();
    loadRates();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateDate = exchangeRates?.updatedAt
    ? new Date(exchangeRates.updatedAt).toLocaleDateString("en-LK", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Colombo",
      })
    : null;

  return (
    <section className="travel-tools-section" aria-label="Travel essentials">
      <article className="travel-tool-card weather-card">
        <div className="travel-tool-heading">
          <div>
            <p className="eyebrow">Before you set out</p>
            <h2>Sri Lanka <em>weather.</em></h2>
          </div>
          <span className="travel-tool-symbol" aria-hidden="true">☼</span>
        </div>

        <p className="travel-tool-intro">
          A quick look at conditions around the island.
        </p>

        <div className="weather-preview-list" aria-live="polite">
          {weatherPlaces.length > 0 ? (
            weatherPlaces.map((place) => (
              <div className="weather-preview-row" key={place.city}>
                <img
                  className="weather-preview-icon"
                  src={place.icon}
                  alt={place.condition}
                  width="36"
                  height="36"
                />
                <span className="weather-place">
                  <strong>{place.city}</strong>
                  <small>{place.region}</small>
                </span>
                <span className="weather-condition">
                  <strong>{Math.round(place.temperatureC)}°C</strong>
                  <small>{place.condition}</small>
                </span>
              </div>
            ))
          ) : (
            <p className="travel-tool-note">
              {weatherUnavailable
                ? "Weather temporarily unavailable. Please try again later."
                : "Loading current weather…"}
            </p>
          )}
        </div>

        <p className="travel-tool-note">
          Weather information provided by WeatherAPI.com. Conditions may change.
        </p>
        <a
          className="travel-tool-link"
          href="https://www.weatherapi.com/"
          target="_blank"
          rel="noreferrer"
        >
          Weather data by WeatherAPI.com <span aria-hidden="true">-&gt;</span>
        </a>
      </article>

      <article className="travel-tool-card rates-card">
        <div className="travel-tool-heading">
          <div>
            <p className="eyebrow">A little travel planning</p>
            <h2>Exchange <em>rates.</em></h2>
          </div>
          <span className="travel-tool-symbol" aria-hidden="true">↔</span>
        </div>

        <p className="travel-tool-intro">
          Reference rate for one unit of foreign currency in Sri Lankan rupees.
        </p>

        <div className="currency-preview-list" aria-live="polite">
          {currencyPreviews.map((currency) => {
            const rate = exchangeRates?.rates[currency.code];

            return (
              <div className="currency-preview-row" key={currency.code}>
                <span className="currency-flag" aria-hidden="true">
                  {currency.flag}
                </span>
                <span className="currency-name">
                  <strong>{currency.code}</strong>
                  <small>{currency.name}</small>
                </span>
                <span className="currency-value">
                  {typeof rate === "number"
                    ? rate.toLocaleString("en-LK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "—"}{" "}
                  <small>LKR</small>
                </span>
              </div>
            );
          })}
        </div>

        <p className="travel-tool-note">
          {ratesUnavailable
            ? "Rates temporarily unavailable. Please try again later."
            : updateDate
              ? `Provider update: ${updateDate} · Reference rates only`
              : "Loading latest available reference rates…"}
        </p>
        <a
          className="travel-tool-link"
          href={exchangeRates?.sourceUrl ?? "https://www.exchangerate-api.com"}
          target="_blank"
          rel="noreferrer"
        >
          Rates by ExchangeRate-API <span aria-hidden="true">-&gt;</span>
        </a>
      </article>
    </section>
  );
}
