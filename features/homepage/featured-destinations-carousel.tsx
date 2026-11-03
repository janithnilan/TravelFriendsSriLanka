"use client";

import Image from "next/image";
import { useState } from "react";
import { destinations } from "@/features/homepage/content";

export function FeaturedDestinationsCarousel() {
  const [start, setStart] = useState(0);

  const visibleDestinations = Array.from(
    { length: Math.min(3, destinations.length) },
    (_, index) => destinations[(start + index) % destinations.length],
  );

  function move(direction: number) {
    setStart(
      (current) =>
        (current + direction + destinations.length) % destinations.length,
    );
  }

  return (
    <div className="destination-carousel">
      <div className="destination-carousel-controls">
        <span className="destination-carousel-count">
          {String(start + 1).padStart(2, "0")} /{" "}
          {String(destinations.length).padStart(2, "0")}
        </span>
        <div className="destination-carousel-buttons">
          <button
            className="destination-carousel-button"
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous destinations"
            disabled={destinations.length <= 3}
          >
            &larr;
          </button>
          <button
            className="destination-carousel-button"
            type="button"
            onClick={() => move(1)}
            aria-label="Next destinations"
            disabled={destinations.length <= 3}
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="destination-grid">
        {visibleDestinations.map((destination, index) => (
          <article
            className="destination"
            id={`destination-${destination.name.toLowerCase()}`}
            key={destination.name}
          >
            <div className={`destination-image ${destination.className}`}>
              <Image
                src={destination.image}
                alt={destination.imageAlt}
                width={1200}
                height={1200}
                loading="lazy"
              />
              <span className="destination-index">
                {String((start + index) % destinations.length + 1).padStart(2, "0")}
              </span>
              <span className="destination-open" aria-hidden="true">
                -&gt;
              </span>
            </div>
            <div className="destination-caption">
              <div>
                <p className="destination-region">{destination.region}</p>
                <h3>{destination.name}</h3>
                <p className="destination-description">
                  {destination.landscape}
                </p>
              </div>
              <span className="destination-arrow" aria-hidden="true">
                -&gt;
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
