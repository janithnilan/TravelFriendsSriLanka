import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { FeaturedDestinationSearch } from "@/features/homepage/featured-destination-search";
import { FeaturedDestinationsCarousel } from "@/features/homepage/featured-destinations-carousel";
import { TravelToolsSection } from "@/features/homepage/travel-tools-section";

export function Homepage() {
  return (
    <main id="top">
      <div className="page-shell">
        <SiteHeader />
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Sri Lanka, at your own pace
            </p>
            <h1 id="hero-title">
              Find a little
              <br />
              more <em>island.</em>
            </h1>
            <p className="hero-copy">
              From sea-washed ramparts to quiet hill towns, find the places that
              make the journey yours.
            </p>
            <a className="text-link" href="#island">
              Explore the island <span aria-hidden="true">-&gt;</span>
            </a>
          </div>

          <div className="hero-visual">
            <Image
              className="hero-photo"
              src="/images/galle/galle-fort.jpg"
              alt="The lighthouse and historic ramparts at Galle Fort"
              width={1280}
              height={867}
              sizes="(max-width: 700px) calc(100vw - 48px), 48vw"
              fetchPriority="high"
              loading="eager"
            />
            <span className="photo-index" aria-hidden="true">
              01 / SOUTHERN COAST
            </span>
            <aside
              className="hero-glass-note glass-surface"
              aria-label="Featured coastal destination"
            >
              <span className="glass-note-kicker">
                Along the southern shore
              </span>
              <span className="glass-note-title">Galle Fort</span>
              <span className="glass-note-copy">
                Sea walls, shaded lanes, slow afternoons.
              </span>
              <a href="#destination-galle" aria-label="Explore Galle Fort">
                Discover Galle <span aria-hidden="true">-&gt;</span>
              </a>
            </aside>
          </div>

          <FeaturedDestinationSearch />
        </section>

        <section
          className="island-section"
          id="island"
          aria-labelledby="island-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">A few good places to begin</p>
              <h2 id="island-title">
                The island, <em>your way.</em>
              </h2>
            </div>
            <a className="section-link" href="#approach">
              Get to know us <span aria-hidden="true">-&gt;</span>
            </a>
          </div>

          <FeaturedDestinationsCarousel />
        </section>

        <TravelToolsSection />

        <section
          className="approach-section"
          id="approach"
          aria-labelledby="approach-title"
        >
          <div className="approach-emblem" aria-hidden="true">
            TF
          </div>
          <div className="approach-content">
            <div>
              <p className="eyebrow">A more thoughtful travel companion</p>
              <h2 id="approach-title">
                Make room for <em>the unexpected.</em>
              </h2>
            </div>
            <p>
              Discover local places and shape the journey around what matters to
              you. Less planning noise; more time for the island.
            </p>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
