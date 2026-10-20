import Image from "next/image";
import { siteContact } from "@/lib/site-config";

export function SiteHeader() {
  return (
    <header className="site-header glass-surface">
      <a
        className="brand"
        href="#top"
        aria-label={`${siteContact.brandName} home`}
      >
        <Image
          alt={siteContact.logo.alt}
          className="header-logo"
          height={56}
          src={siteContact.logo.src}
          width={56}
        />
        <span className="header-brand-name">{siteContact.brandName}</span>
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#island">The island</a>
        <a href="#approach">Our approach</a>
      </nav>
      <a className="button button-primary header-action" href="#island">
        Explore places <span aria-hidden="true">-&gt;</span>
      </a>
    </header>
  );
}
