import { describe, expect, it } from "vitest";
import { siteContact } from "@/lib/site-config";
import { getPublicVisitorStatistics } from "@/services/visitor-analytics-service";

describe("public visitor statistics", () => {
  it("reports unavailable state without inventing visitor metrics", () => {
    expect(getPublicVisitorStatistics()).toEqual({
      availability: "not_configured",
      reportingPeriod: null,
      totalVisits: null,
      uniqueVisitors: null,
      topCountries: [],
      recentTrend: [],
      lastUpdated: null,
      authenticatedLogins: null,
      totalVisitors: null,
      onlineNow: null,
      pageViewsToday: null,
      percentageChangeFromYesterday: null,
      activityWindowMinutes: null,
      countryIdentificationMethod: null,
    });
  });
});

describe("public contact configuration", () => {
  it("contains only the supplied brand and contact destinations", () => {
    expect(siteContact).toMatchObject({
      brandName: "TravelFriendsSriLanka",
      email: "travelfriendsrilanka@gmail.com",
      whatsappNumber: "+94 776 937 932",
      whatsappUrl: "https://wa.me/94776937932",
      social: {
        facebook: "https://web.facebook.com/profile.php?id=100064862565009",
        youtube: "https://www.youtube.com/@travelfriendsrilanka7522",
      },
      logo: {
        src: "/images/brand/logo.png",
        alt: "TravelFriendsSriLanka logo",
      },
    });
  });
});
