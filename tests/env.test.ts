import { describe, expect, it } from "vitest";
import { getEnvironment } from "@/lib/env";

describe("environment configuration", () => {
  it("allows the application to run before a local database is configured", () => {
    expect(getEnvironment({ NODE_ENV: "test" })).toEqual({ NODE_ENV: "test" });
  });

  it("accepts a PostgreSQL connection URL", () => {
    expect(
      getEnvironment({
        NODE_ENV: "test",
        DATABASE_URL:
          "postgresql://traveler:local@localhost:5432/travel_friends",
      }).DATABASE_URL,
    ).toBe("postgresql://traveler:local@localhost:5432/travel_friends");
  });

  it("rejects non-PostgreSQL database URLs", () => {
    expect(() =>
      getEnvironment({
        NODE_ENV: "test",
        DATABASE_URL: "mysql://localhost/travel_friends",
      }),
    ).toThrow();
  });

  it("rejects invalid runtime modes", () => {
    expect(() => getEnvironment({ NODE_ENV: "staging" })).toThrow();
  });
});
