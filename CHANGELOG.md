# CHANGELOG

## 1.0.10
**Date:** 2026-04-07
**Description:** Fixed CORS persisting in production despite source code fix. A previous manual deploy had baked ALLOWED_ORIGINS=http://localhost:4200 into the Cloud Run service config, which Firebase merges rather than replaces on subsequent deploys. Added .env.atom-task-manager-2026 (project-specific env file, safe to commit) with both localhost and the production hosting URL. Firebase CLI picks this up automatically during deploy and overwrites the stale value.

## 1.0.9
**Date:** 2026-04-07
**Description:** Fixed CORS blocking requests from the production Firebase Hosting URL. ALLOWED_ORIGINS env var was not set in the Firebase Functions runtime, causing the default (localhost:4200 only) to reject requests from https://atom-task-manager-2026.web.app. Updated the default to include both localhost and the production URL. The env var override remains functional for other environments.

## 1.0.8
**Date:** 2026-04-07
**Description:** Fixed 500 error on user creation in production. Two bugs: (1) firebase-app.ts was passing { projectId } to initializeApp() whenever GOOGLE_CLOUD_PROJECT was set, which is always true in the Firebase Functions runtime — this bypassed automatic credential setup and caused Firestore permission failures. Fixed by only passing { projectId } when FIRESTORE_EMULATOR_HOST is also present (Docker local dev). (2) User.create() threw a plain Error for invalid email format, which the error handler could not map to a 400 — it fell through to the 500 catch-all. Fixed by throwing ValidationError instead.

## 1.0.7
**Date:** 2026-04-05
**Description:** Added README.md documenting architecture decisions (Clean/Hexagonal layers, immutable entities, factory pattern, in-memory pagination), project structure, API reference, local development options (Docker and manual), Firebase setup, environment variables, testing strategy, and CI/CD pipeline.

## 1.0.6
**Date:** 2026-04-05
**Description:** Added Swagger documentation. swagger-jsdoc generates the OpenAPI 3.0 spec from JSDoc comments on route files. swagger-ui-express serves the interactive UI at /api/docs. All endpoints documented with request params, request bodies, and response schemas. Docs are only available outside production (NODE_ENV !== production).

## 1.0.5
**Date:** 2026-04-05
**Description:** Added Docker support for local development. New Dockerfile runs the Express app via ts-node-dev (hot reload) using a new src/server.ts entrypoint that calls app.listen() instead of Firebase's onRequest(). Added ts-node-dev, ts-node, and tsconfig-paths as dev dependencies. Added dev script to package.json. firebase-app.ts now reads GOOGLE_CLOUD_PROJECT env var so Admin SDK initialises correctly against the Firestore emulator without a service account.

## 1.0.4
**Date:** 2026-04-04
**Description:** Added pagination to GET /api/tasks. Accepts limit and offset query parameters with defaults defined in pagination.constants.ts (limit: 10, max: 100). Response shape changed to { metadata: { page, numberOfPages, limit, offset, total }, data: Task[] }. Updated unit and integration tests accordingly.

## 1.0.3
**Date:** 2026-04-04
**Description:** Fixed CI/CD deploy failure by explicitly setting rootDir to "src" in tsconfig.json. Without it, TypeScript inferred the wrong rootDir on a clean CI checkout and output compiled files to lib/src/index.js instead of lib/index.js.

## 1.0.2
**Date:** 2026-04-04
**Description:** Added HTTP integration tests with supertest covering all endpoints (users, tasks, health). Fixed CI/CD pipeline by merging build and deploy into a single job to prevent missing compiled output. Excluded Firestore repositories and factories from coverage thresholds as they require the Firebase emulator.

## 1.0.1
**Date:** 2026-04-04
**Description:** Health endpoint now returns version (from package.json) and current date alongside status.

## 1.0.0
**Date:** 2026-04-04
**Description:** Initial release. Express API with Clean/Hexagonal Architecture, Firebase Cloud Functions v2, Firestore repositories, domain entities, use cases, error handling, ESLint, Prettier and CI/CD pipeline.
