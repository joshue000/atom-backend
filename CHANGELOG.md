# CHANGELOG

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
