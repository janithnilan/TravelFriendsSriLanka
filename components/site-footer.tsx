import Image from "next/image";
import { siteContact } from "@/lib/site-config";
import { getPublicVisitorStatistics } from "@/services/visitor-analytics-service";

function SocialIcon({ name }: { name: "whatsapp" | "facebook" | "youtube" }) {
  if (name === "youtube") {
    return (
      <svg
        aria-hidden="true"
        className="contact-icon"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect x="3" y="5" width="18" height="14" rx="4" />
        <path d="m10 9 5 3-5 3V9Z" />
      </svg>
    );
  }

  if (name === "facebook") {
    return (
      <svg
        aria-hidden="true"
        className="contact-icon"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path d="M13.2 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2h-2.8V13h2.8v8h3.4Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className="contact-icon"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L4 20l1.1-4a8.2 8.2 0 1 1 15.1-4.3Z" />
      <path d="M9 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2.1.4-.1.6l-.6.7c-.2.2-.2.4 0 .6.7 1.1 1.6 1.9 2.8 2.5.2.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.4-.9 1.9-.6.5-1.4.7-2.2.5-1.1-.2-2.5-.8-4.1-2.2-1.3-1.1-2.2-2.5-2.6-3.6-.4-1.1 0-2.1.4-2.7Z" />
    </svg>
  );
}

export function SiteFooter() {
  const statistics = getPublicVisitorStatistics();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-column">
          <a
            className="footer-logo-link"
            href="#top"
            aria-label={`${siteContact.brandName} home`}
          >
            <Image
              alt={siteContact.logo.alt}
              className="footer-logo"
              height={84}
              src={siteContact.logo.src}
              width={84}
            />
            <span>{siteContact.brandName}</span>
          </a>
          <p className="footer-description">
            Find local places, shape your journey, and make more room for the
            island.
          </p>
        </div>

        <div className="footer-contact-column">
          <h2 className="footer-heading">Get in touch</h2>
          <a className="contact-link" href={`mailto:${siteContact.email}`}>
            <span
              className="contact-icon contact-icon-letter"
              aria-hidden="true"
            >
              @
            </span>
            <span>{siteContact.email}</span>
          </a>
          <a
            className="contact-link"
            href={siteContact.whatsappUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SocialIcon name="whatsapp" />
            <span>WhatsApp {siteContact.whatsappNumber}</span>
          </a>
        </div>

        <div className="footer-social-column">
          <h2 className="footer-heading">Follow along</h2>
          <a
            className="contact-link"
            href={siteContact.social.facebook}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SocialIcon name="facebook" />
            <span>Facebook</span>
            <span className="external-indicator" aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            className="contact-link"
            href={siteContact.social.youtube}
            rel="noopener noreferrer"
            target="_blank"
          >
            <SocialIcon name="youtube" />
            <span>YouTube</span>
            <span className="external-indicator" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>

      <div className="footer-community-row">
        <div className="external-visitor-counter">
          <a
            href="https://liveflagcounter.com/stats/ISIcEGNR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://liveflagcounter.com/c/ISIcEGNR.png"
              alt="Live visitor counter with country flags"
              width={624}
              height={24}
              loading="lazy"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </a>
        </div>

        <section className="footer-reviews" aria-labelledby="footer-reviews-title">
          <h2 id="footer-reviews-title">Traveler Reviews</h2>
          <div className="footer-review-stars" aria-label="No ratings yet">
            <span aria-hidden="true">☆ ☆ ☆ ☆ ☆</span>
          </div>
          <p>Reviews coming soon. Be among the first to share your experience.</p>
        </section>
      </div>

      <p className="image-credits">
        Photography:{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:20160124_Sri_Lanka_3826_Sigiriya_sRGB_(25649808532).jpg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Sigiriya, Dan Lundberg (CC BY-SA 2.0)
        </a>
        ;{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Ella_Nine_Arch_Bridge_Sri_Lanka.jpg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ella, Kaushiru90 (CC BY-SA 4.0)
        </a>
        ;{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:GALLE_FORT_AND_LIGHTHOUSE_GALLE_SRI_LANKA_JAN2013_(8510167078).jpg"
          rel="noopener noreferrer"
          target="_blank"
        >
          Galle, calflier001 (CC BY-SA 2.0)
        </a>
        ;{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Island_of_Kandy_lake.JPG"
          rel="noopener noreferrer"
          target="_blank"
        >
          Kandy, AntanO (CC BY-SA 4.0)
        </a>
        .
      </p>

      <div className="footer-bottom">
        <p>
          © {currentYear} {siteContact.brandName}. All rights reserved.
        </p>
        <p>Made with care for journeys across Sri Lanka.</p>
      </div>
    </footer>
  );
}
