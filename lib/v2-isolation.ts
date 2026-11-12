type V2Environment = Record<string, string | undefined>;

export function v2IsolationError(env: V2Environment = process.env): string | null {
  if (env.LUNCHBOX_ENV !== "v2") return null;
  const projectId = env.LUNCHBOX_V2_PROJECT_ID;
  if (!projectId || env.GCP_PROJECT_ID !== projectId) return "V2 GCP access must target the dedicated LUNCHBOX_V2_PROJECT_ID.";
  if (!env.LUNCHBOX_V1_PROJECT_ID) return "V2 requires the verified LUNCHBOX_V1_PROJECT_ID for isolation checks.";
  if (projectId === env.LUNCHBOX_V1_PROJECT_ID) return "V2 and V1 must use different Google Cloud projects.";
  if (env.FIREBASE_PROJECT_ID !== projectId || env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== projectId) return "V2 Firebase Admin and client must use the dedicated V2 project.";
  if (!env.FIRESTORE_DATABASE_ID) return "V2 must set an explicit Firestore database ID.";
  if (!env.BIGQUERY_DATASET?.startsWith("lunchbox_v2")) return "V2 BigQuery must use a V2-specific dataset.";
  if (!env.SCHOOL_DIRECTORY_BIGQUERY_DATASET?.endsWith("_v2")) return "V2 school analytics must use a V2-specific dataset.";
  if (!env.GCS_BUCKET?.startsWith("lunchbox-v2-")) return "V2 storage must use a dedicated V2 bucket.";
  return null;
}

export function assertV2Isolation(env: V2Environment = process.env) {
  const error = v2IsolationError(env);
  if (error) throw new Error(error);
}

