export type VisitorStatistics = {
  availability: "not_configured";
  reportingPeriod: null;
  totalVisits: null;
  uniqueVisitors: null;
  topCountries: readonly [];
  recentTrend: readonly [];
  lastUpdated: null;
  authenticatedLogins: null;
  totalVisitors: null;
  onlineNow: null;
  pageViewsToday: null;
  percentageChangeFromYesterday: null;
  activityWindowMinutes: null;
  countryIdentificationMethod: null;
};

const unavailableStatistics: VisitorStatistics = {
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
};

export function getPublicVisitorStatistics(): VisitorStatistics {
  return unavailableStatistics;
}
