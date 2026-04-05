# ATOM Functions

REST API for the ATOM Task Manager, built with TypeScript and deployed as a Firebase Cloud Function.

## Table of Contents

- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Local Development](#local-development)
- [Firebase Setup](#firebase-setup)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [CI/CD](#cicd)

---

## Architecture

The backend follows **Clean/Hexagonal Architecture** organised into three layers:

### Domain layer (`src/domain/`)

The innermost layer. Contains business rules and has zero external dependencies.

- **Entities** — `Task` and `User` are rich domain objects with private constructors. Creation is done through static factory methods (`Task.create()`, `Task.reconstitute()`), which enforces invariants at the boundary. State transitions (`complete()`, `reopen()`, `updateDetails()`) return new immutable instances rather than mutating in place.
- **Repository interfaces** — `ITaskRepository` and `IUserRepository` define contracts as TypeScript interfaces. The domain has no knowledge of Firestore, HTTP, or any infrastructure detail.
- **Domain errors** — Typed error classes (`TaskNotFoundError`, `UserNotFoundError`, `UserAlreadyExistsError`, `ValidationError`) allow the error handler to produce correct HTTP status codes without `instanceof` chains scattered across controllers.

### Application layer (`src/application/`)

Orchestrates domain objects to fulfil use cases. Each use case is a single class with a single `execute()` method. Dependencies are injected via constructor — use cases receive repository interfaces, never concrete implementations.

Pagination is handled entirely in the application layer: all tasks for a user are fetched, sorted by `createdAt` descending in memory, then sliced. This avoids the composite Firestore index that `orderBy + where` queries would require.

### Infrastructure layer (`src/infrastructure/`)

Adapters that connect the application to the outside world:

- **Firestore repositories** — Concrete implementations of the domain repository interfaces. Firestore `Timestamp` values are converted to `Date` on read.
- **Factory functions** — `repository.factory.ts` and `use-case.factory.ts` wire the dependency graph. Repositories are cached as singletons. Controllers call these factories, keeping them free of `new` keywords.
- **HTTP layer** — Express routes → validators → controllers. Validators are Express middleware that throw `ValidationError` on invalid input. Controllers are thin: parse the request, call a use case, return the result.
- **Error handler middleware** — Central place that maps domain errors to HTTP status codes (`TaskNotFoundError` → 404, `ValidationError` → 400, etc.).

### Key decisions

| Decision | Rationale |
|---|---|
| Immutable entities | Prevents accidental state mutation across use-case boundaries |
| Factory functions over DI container | Sufficient for this scope; avoids adding a DI framework dependency |
| In-memory sort + slice for pagination | Avoids Firestore composite index requirement during development |
| `crypto.randomUUID()` for IDs | Built into Node 20, no extra dependency |
| Helmet for security headers | Production-ready baseline with one line |
| `ALLOWED_ORIGINS` env var for CORS | Keeps the origin list out of source code |
| Swagger docs disabled in production | Avoids exposing internal API shape in the deployed function |

---

## Project Structure

```
src/
  domain/
    entities/         — Task, User (rich domain objects)
    repositories/     — ITaskRepository, IUserRepository (interfaces)
    errors/           — Typed domain error classes
  application/
    use-cases/
      tasks/          — GetTasks, CreateTask, UpdateTask, DeleteTask
      users/          — GetUserByEmail, CreateUser
    dtos/             — Request/response data shapes
    constants/        — Pagination defaults
  infrastructure/
    firebase/         — Admin SDK initialisation, Firestore client singleton
    repositories/     — FirestoreTaskRepository, FirestoreUserRepository
    factories/        — repository.factory.ts, use-case.factory.ts
    http/
      controllers/    — task.controller.ts, user.controller.ts
      middleware/     — cors, error-handler
      routes/         — task.routes.ts, user.routes.ts
      validators/     — task.validator.ts, user.validator.ts
      swagger/        — OpenAPI spec and swagger-ui-express setup
    app.ts            — Express composition root
  index.ts            — Firebase Cloud Function entry point (exports `api`)
  server.ts           — Local dev entry point (app.listen)
test/
  unit/               — Use case tests with mocked repositories
  integration/        — HTTP-level tests with supertest
```

---

## API Reference

Interactive docs available at `http://localhost:3000/api/docs` when running locally.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/users/:email` | Find user by email |
| `POST` | `/api/users` | Create user |
| `GET` | `/api/tasks?userId=&limit=&offset=` | Get paginated tasks |
| `POST` | `/api/tasks` | Create task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

---

## Local Development

### Option A — Docker (recommended, no local dependencies required)

Requires Docker Desktop. From the project root:

```bash
docker-compose up --build
```

The functions service starts at `http://localhost:3000`. Swagger UI is available at `http://localhost:3000/api/docs`.

### Option B — Local setup

**Requirements:** Node 20, Java 21, `firebase-tools`

```bash
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)).

Start the Firestore emulator:

```bash
firebase emulators:start --only firestore --project demo-atom
```

Then in a separate terminal:

```bash
npm run dev
```

The server starts at `http://localhost:3000`.

---

## Firebase Setup

To deploy to Firebase, you need:

1. A Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Firestore enabled in Native mode
3. `firebase-tools` installed globally: `npm install -g firebase-tools`
4. Logged in: `firebase login`

### First-time deploy

```bash
npm run build
firebase deploy --only functions --project <your-project-id>
```

### CI/CD deploy token

Generate a token for GitHub Actions:

```bash
firebase login:ci
```

Add it as `FIREBASE_TOKEN` in your repository secrets.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Port for the local dev server |
| `GOOGLE_CLOUD_PROJECT` | — | Firebase project ID. Set to `demo-*` to use the Firestore emulator without credentials |
| `FIRESTORE_EMULATOR_HOST` | — | Set to `localhost:8080` (or `firestore:8080` in Docker) to route to the emulator |
| `ALLOWED_ORIGINS` | `http://localhost:4200` | Comma-separated list of allowed CORS origins |
| `NODE_ENV` | — | Set to `production` to disable Swagger UI |

Create a `.env` file in this directory for local development:

```env
PORT=3000
GOOGLE_CLOUD_PROJECT=demo-atom
FIRESTORE_EMULATOR_HOST=localhost:8080
ALLOWED_ORIGINS=http://localhost:4200
```

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test strategy

- **Unit tests** (`test/unit/`) — use case logic tested in isolation with in-memory mock repositories. No Firebase, no HTTP.
- **Integration tests** (`test/integration/`) — HTTP-level tests using `supertest`. Use cases are mocked; tests verify routing, validation, and status codes.

---

## CI/CD

GitHub Actions pipeline defined in `.github/workflows/ci-cd.yml`:

1. **Lint** — ESLint + Prettier check
2. **Test** — Jest with coverage (runs after lint)
3. **Build & Deploy** — TypeScript compilation + Firebase deploy (runs on `master` push only)
