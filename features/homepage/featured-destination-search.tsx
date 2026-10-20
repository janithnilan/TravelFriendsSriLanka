"use client";

import { useState, type FormEvent } from "react";
import { destinations } from "@/features/homepage/content";

export function FeaturedDestinationSearch() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const matches = destinations.filter((destination) =>
    `${destination.name} ${destination.region} ${destination.landscape}`
      .toLowerCase()
      .includes(submittedQuery.toLowerCase()),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = query.trim();
    if (!nextQuery) return;

    setSubmittedQuery(nextQuery);
    setHasSubmitted(true);
  }

  return (
    <div className="search-wrap">
      <form
        className="destination-search glass-surface"
        onSubmit={handleSubmit}
      >
        <label className="search-field" htmlFor="featured-destination-query">
          <span className="search-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
          </span>
          <span className="search-label">Find a place to begin</span>
          <input
            autoComplete="off"
            id="featured-destination-query"
            name="destination"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Try Ella, Galle or Kandy"
            type="search"
            value={query}
          />
        </label>
        <button className="button button-primary search-button" type="submit">
          Find places
        </button>
        {hasSubmitted && (
          <div className="search-results" aria-live="polite">
            <p className="search-results-heading">
              {matches.length
                ? `${matches.length} featured ${matches.length === 1 ? "place" : "places"}`
                : "No featured places found"}
            </p>
            {matches.length ? (
              matches.map((destination) => (
                <a
                  className="search-result"
                  href={`#destination-${destination.name.toLowerCase()}`}
                  key={destination.name}
                  onClick={() => setHasSubmitted(false)}
                >
                  <span>
                    <strong>{destination.name}</strong>
                    <small>{destination.region}</small>
                  </span>
                  <span aria-hidden="true">-&gt;</span>
                </a>
              ))
            ) : (
              <p className="search-empty-copy">
                Try a name or region from the featured places below.
              </p>
            )}
          </div>
        )}
      </form>
      <p className="search-scope">Explore our featured places</p>
    </div>
  );
}
