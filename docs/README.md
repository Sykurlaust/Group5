# Project Documentation

## Overview
Gran Canaria Rentals is structured as a monorepo with two primary apps:

- **frontend/** — Vite + React (TypeScript) marketing and admin dashboards backed by Firebase client SDKs.
- **backend/** — Express + TypeScript API that authenticates via Firebase Admin and exposes profile management endpoints.
- **scripts/** — operational utilities such as `importListings.mjs` for seeding Firestore.

This folder centralizes onboarding notes so new contributors can ramp up without digging through Slack threads.

## Repository Layout
```
Group5/
├─ backend/            # Express API source, middlewares, validators, tests
├─ frontend/           # Vite SPA, Tailwind styles, routing, feature pages
├─ scripts/            # One-off maintenance scripts (imports, migrations)
├─ BACKEND_TODO.md     # Running backlog for API work
└─ docs/               # <— you are here
```

## Getting Started
### Prerequisites
- Node.js 20+ (aligns with Vite 8 beta and Firebase Admin 13 requirements)
- npm 10+ (bundled with Node)
- Firebase project with service account credentials

### Install Dependencies
```bash
# from repo root
cd backend && npm install
cd ../frontend && npm install
```

> Tip: run the commands separately or use PowerShell `;` separators. `&&` is not supported in Windows PowerShell.

### Run in Development
```bash
# Backend API (http://localhost:4000 by default)
cd backend
npm run dev

# Frontend app (http://localhost:5173)
cd frontend
npm run dev
```
Run both stacks simultaneously to exercise authenticated flows end-to-end.

## Environment Configuration
Create `backend/.env` (and optionally `.env.local`) with the Firebase Admin credentials used by `firebase-admin`:

| Variable | Description |
| --- | --- |
| `FIREBASE_PROJECT_ID` | Firebase project identifier |
| `FIREBASE_CLIENT_EMAIL` | Service account client email |
| `FIREBASE_PRIVATE_KEY` | Multiline private key (remember to wrap in quotes and replace `\n`) |
| `PORT` | API port (defaults to 4000) |

Implement `src/config/firebase.ts` to initialize `firebase-admin` and export `firebaseAuth` + `firestore` (see `src/middlewares/authenticate.ts` for the expected names).

For the frontend, prefer using Vite env variables instead of hardcoding credentials. Create `frontend/.env` with:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

Then consume them in `src/lib/firebase.ts` (Vite exposes them on `import.meta.env`).

## Useful Scripts
| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | TSX-based watch server |
| backend | `npm run build && npm start` | Compile to `dist/` and run node |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Type-check + production build |
| scripts | `node importListings.mjs` | Seed properties into Firestore |

## Recommended Next Docs
- `docs/api.md` — endpoints, request/response examples, auth requirements
- `docs/frontend-styleguide.md` — component patterns, typography, branding tokens
- `docs/runbooks/` — operational procedures (deploy, rollback, analytics exports)

Feel free to expand this directory as the project evolves; treat it as the single source of truth for process knowledge.
