CREATE TABLE "AnalyticsDaily" (
    "day" DATE NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0 CHECK ("pageViews" >= 0),
    "visits" INTEGER NOT NULL DEFAULT 0 CHECK ("visits" >= 0 AND "visits" <= "pageViews"),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AnalyticsDaily_pkey" PRIMARY KEY ("day", "country")
);