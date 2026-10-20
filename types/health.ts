export type HealthResponse = {
  status: "ok" | "error";
  database: "connected" | "not_configured" | "unavailable";
};
