# LunchBox V2 isolated deployment

V2 is built only from the `lunchbox2` branch using `cloudbuild.v2.yaml`, a V2-only Artifact Registry repository, and the `lunchbox-v2` Cloud Run service. `Dockerfile.v2` has no V1 Firebase defaults. The existing `cloudbuild.yaml` and `Dockerfile` are unchanged.

## Isolation requirements

1. Use a dedicated Google Cloud project that is different from the verified V1 project. Enable Firebase on that V2 project and create a Firebase Web app there. Do not reuse V1 Firebase configuration.
2. Create a V2 Cloud Build service account and a separate V2 Cloud Run runtime service account in the V2 project. Grant the build identity deployment, Artifact Registry, storage, BigQuery, Firestore, Firebase Rules, and service account use permissions only in the V2 project. Grant the runtime identity Firestore, BigQuery, and object access only in V2 resources. Do not grant either identity V1 project roles.
3. In the V2 Firebase project, enable phone authentication and configure its reCAPTCHA and authorized domains. Keep `REQUIRE_FIREBASE_AUTH=true`.
4. Create the V2 Maps/Places and SerpAPI keys in the V2 projectâ€™s Secret Manager using the names `lunchbox-v2-google-maps-api-key` and `lunchbox-v2-serpapi-api-key`. Give only the V2 runtime service account secret access. Provider search remains unavailable until those V2 secrets are configured.
5. Use a unique bucket name beginning `lunchbox-v2-`. The build creates it with uniform bucket access and public access prevention. V2 BigQuery schemas are created in `lunchbox_v2_orders` and `school_directory_v2`; the SQL is rewritten to target the V2 project and region.
6. The default Firestore database is safe here because the V2 project is separate. The build creates it if needed and deploys the repositoryâ€™s deny-all browser rules and required indexes. The server uses Firebase Admin and the V2 runtime identity.
7. Payments and franchise payment links are disabled for V2. Only enable test Razorpay credentials deliberately; V2 rejects live-key payment setup.

The V2 backend checks the verified V1 project ID against the V2 project ID, then validates Firebase, BigQuery, Firestore, and bucket configuration before using those clients. Cloud Run receives the verified V1 project ID from the guarded build substitution. The Cloud Build preflight also rejects a build outside `lunchbox2` and refuses to deploy when the build project equals the verified V1 project. The V2 build identity has no V1 permissions, so it cannot change or inspect V1 services.

## Cloud Build trigger

Connect this GitHub repository to Cloud Build if no GitHub connection exists, then create a push trigger in the V2 project. For a legacy GitHub connection, use this shape after replacing each value with verified V2 configuration:

```powershell
gcloud builds triggers create github `
  --project=YOUR_V2_PROJECT_ID `
  --name=lunchbox-v2-lunchbox2 `
  --repo-owner=ramamurthy-540835 `
  --repo-name=lunchbox `
  --branch-pattern='^lunchbox2$' `
  --build-config=cloudbuild.v2.yaml `
  --service-account=projects/YOUR_V2_PROJECT_ID/serviceAccounts/YOUR_V2_BUILD_SA_EMAIL `
  --substitutions=_V1_PROJECT_ID=VERIFIED_V1_PROJECT_ID,_V2_RUNTIME_SERVICE_ACCOUNT=YOUR_V2_RUNTIME_SA_EMAIL,_V2_GCS_BUCKET=lunchbox-v2-REPLACE_WITH_UNIQUE_SUFFIX,_V2_BQ_DATASET=lunchbox_v2_orders,_V2_FIREBASE_WEB_API_KEY=YOUR_V2_WEB_API_KEY,_V2_FIREBASE_APP_ID=YOUR_V2_WEB_APP_ID
```

If the repository is connected through a second-generation Cloud Build repository connection, use its full `projects/.../locations/.../connections/.../repositories/...` resource with `--repository` instead of `--repo-owner` and `--repo-name`, and set the supported Cloud Build trigger region. Cloud Build documents both trigger forms and the branch pattern behavior in its [GitHub trigger reference](https://docs.cloud.google.com/sdk/gcloud/reference/builds/triggers/create/github).

Before creating the trigger, verify the V1 project ID using the existing production serviceâ€™s project configuration; do not infer it from the repositoryâ€™s older example. Verify the V2 project, billing, region availability, GitHub connection, Firebase setup, service accounts, and the custom substitutions. The build itself checks that the V2 project is different from the supplied V1 project and that `asia-south1` is available for Cloud Run and Firestore.

## Build and smoke check

The V2 trigger runs lint, Vitest, schema provisioning, Firebase rules/index deployment, a Next.js production build inside `Dockerfile.v2`, image push with the triggering commit SHA, and deploys only `lunchbox-v2`. It prints the actual generated service URL and checks `/api/health?ready=1`. V2 displays a development-mode notice, uses an independent PWA identity/cache, and records orders only in the V2 project.

Builds require the Cloud Build identity to have permissions only in the V2 project. The V2 runtime service account needs access to its own Firestore database, BigQuery datasets, bucket, and optional V2 secrets. Do not add V1 IAM bindings to make a V2 build pass.

