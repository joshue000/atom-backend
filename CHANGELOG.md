# CHANGELOG

## 1.0.2
**Date:** 2026-04-04
**Description:** Added HTTP integration tests with supertest covering all endpoints (users, tasks, health). Fixed CI/CD pipeline by merging build and deploy into a single job to prevent missing compiled output. Excluded Firestore repositories and factories from coverage thresholds as they require the Firebase emulator.

## 1.0.1
**Date:** 2026-04-04
**Description:** Health endpoint now returns version (from package.json) and current date alongside status.

## 1.0.0
**Date:** 2026-04-04
**Description:** Initial release. Express API with Clean/Hexagonal Architecture, Firebase Cloud Functions v2, Firestore repositories, domain entities, use cases, error handling, ESLint, Prettier and CI/CD pipeline.
