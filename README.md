# IELTS Computer-Based Practice Simulator

A full-stack IELTS-style practice application built with Node.js, Express, browser JavaScript and SQLite. The existing four-skill interface is served by the Node application, and its versioned practice content is loaded through the backend API.

## Features

- **Listening:** four parts and 40 original sample questions, a 30-minute timer and browser speech-synthesis playback.
- **Reading:** three passages and 40 questions, a 60-minute timer, navigation, highlight and strike-through tools.
- **Writing:** two task prompts, word counts, a 60-minute timer and autosaved drafts.
- **Speaking:** three practice parts, a one-minute preparation timer and two-minute speaking timer for Part 2, notes and optional browser microphone recording.
- **Versioned content API:** all four skill prompts are served from `server/question-bank.js`, not hard-coded into API responses. Update the question bank and increment its version when publishing content changes.
- **Accounts:** email/password registration, sign-in/sign-out, bcrypt password hashes and HTTP-only SameSite session cookies.
- **Database-backed attempts:** save answers, writing drafts, notes and remaining time to SQLite, see recent attempts and resume unfinished attempts across browsers.
- **Server-side scoring:** Listening and Reading results are calculated by the backend answer key. The score and band conversion are approximate practice feedback, not an official IELTS score. Writing and Speaking are not automatically band-scored.
- **Security and operations:** Helmet headers, rate limiting for authentication, same-origin checks for state-changing API requests, bounded request sizes, user-owned attempt checks, parameterized SQL, graceful shutdown, health check and Docker Compose.
- **Local-first fallback:** practice progress also saves to browser storage, so the UI can still be used without an account when served by a compatible static host. Account syncing requires the Node server.

## Requirements

- Node.js 22 LTS recommended (Node.js 20.11+ supported).
- npm.
- For microphone recording, a browser that supports MediaRecorder and a secure context (localhost or HTTPS).

## Run locally

```bash
npm install
cp .env.example .env
```

Edit `.env` and set `SESSION_SECRET` to a random value of at least 32 characters. Then start the application:

```bash
npm run dev
```

Open http://127.0.0.1:3000. SQLite data and session records are created automatically in `./data/`. Do not commit the data directory or `.env` file.

Generate a suitable secret using:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## API

- `GET /api/health` — health check.
- `GET /api/config` and `GET /api/tests` — test catalog, durations and content version.
- `GET /api/tests/:skill` — current versioned content for Listening, Reading, Writing or Speaking. Answer keys are not included.
- `GET /api/auth/me` — current account.
- `POST /api/auth/register` — create account (`email`, `password`; password 10–128 characters).
- `POST /api/auth/login` — sign in.
- `POST /api/auth/logout` — sign out.
- `GET /api/attempts` — current user's recent attempts.
- `POST /api/attempts` — create attempt (`skill`).
- `GET /api/attempts/:id` — read an owned attempt.
- `PUT /api/attempts/:id` — save answers, writing, notes and remaining time.
- `POST /api/attempts/:id/submit` — submit an attempt and calculate Listening/Reading results.

Attempt endpoints require authentication. Each attempt is scoped to its owner; another account cannot read or change it.

## Tests

```bash
npm run check
npm test
```

The automated suite checks authentication, input validation, session state, answer persistence, server-side scoring, submission state and cross-account attempt isolation. GitHub Actions additionally runs Playwright browser smoke tests on desktop and mobile against the Node.js server.

## Docker

Generate a secret and start the service:

```bash
export SESSION_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")"
docker compose up --build -d
```

The application listens on port 3000 inside the container and persists the SQLite database/session store in the named `ielts_data` volume. Back up this volume before upgrades. The container runs as a non-root user. Do not expose the service to the public internet without HTTPS and an appropriate reverse proxy.

## Production launch checklist

This is a solid local full-stack foundation, but it should not be advertised as a fully production-hardened exam platform until these items are completed:

- Validate every question and answer-key variant with qualified IELTS educators; calibrate practice band conversion before relying on it.
- Add email verification, password reset, account deletion and data export.
- Add CSRF protection if the application later supports cross-origin deployments or relaxes SameSite cookies; keep the UI and API same-origin for this design.
- Configure HTTPS, reverse proxy trust, backups and a tested restore procedure.
- Add accessibility and supported-browser testing, structured logging and error monitoring.
- Speaking recordings are intentionally not uploaded or stored in SQLite. Persisting audio would require an explicit privacy/retention design and storage limits.
- SQLite is intended for a simple single-instance deployment. Move to PostgreSQL and shared session storage before running multiple app replicas or handling high concurrent traffic.

This independent tool uses original demonstration content and browser-generated listening audio. It is not affiliated with or endorsed by IELTS or the British Council.
