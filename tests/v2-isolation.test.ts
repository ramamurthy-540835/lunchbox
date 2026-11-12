import { describe, expect, it } from "vitest";
import { v2IsolationError } from "@/lib/v2-isolation";

const isolated = {
  LUNCHBOX_ENV: "v2",
  LUNCHBOX_V1_PROJECT_ID: "lunchbox-production-456",
  LUNCHBOX_V2_PROJECT_ID: "lunchbox-dev-123",
  GCP_PROJECT_ID: "lunchbox-dev-123",
  FIREBASE_PROJECT_ID: "lunchbox-dev-123",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "lunchbox-dev-123",
  FIRESTORE_DATABASE_ID: "lunchbox-v2",
  BIGQUERY_DATASET: "lunchbox_v2_orders",
  SCHOOL_DIRECTORY_BIGQUERY_DATASET: "school_directory_v2",
  GCS_BUCKET: "lunchbox-v2-dev-123",
};

describe("V2 resource isolation", () => {
  it("accepts explicit resources scoped to the V2 project", () => {
    expect(v2IsolationError(isolated)).toBeNull();
  });

  it("rejects a V1 project target", () => {
    expect(v2IsolationError({ ...isolated, GCP_PROJECT_ID: "chennaifood" })).toMatch(/dedicated/i);
    expect(v2IsolationError({ ...isolated, LUNCHBOX_V2_PROJECT_ID: isolated.LUNCHBOX_V1_PROJECT_ID, GCP_PROJECT_ID: isolated.LUNCHBOX_V1_PROJECT_ID })).toMatch(/different Google Cloud projects/i);
  });

  it("requires the verified V1 project identifier", () => {
    expect(v2IsolationError({ ...isolated, LUNCHBOX_V1_PROJECT_ID: undefined })).toMatch(/verified LUNCHBOX_V1_PROJECT_ID/i);
  });

  it("rejects production or missing data resources", () => {
    expect(v2IsolationError({ ...isolated, BIGQUERY_DATASET: "school_lunch" })).toMatch(/BigQuery/i);
    expect(v2IsolationError({ ...isolated, GCS_BUCKET: "chennaifood" })).toMatch(/storage/i);
    expect(v2IsolationError({ ...isolated, FIRESTORE_DATABASE_ID: undefined })).toMatch(/Firestore/i);
  });

  it("does not change V1 configuration behavior", () => {
    expect(v2IsolationError({ GCP_PROJECT_ID: "chennaifood" })).toBeNull();
  });
});

