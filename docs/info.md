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
Follow the detailed checklist in [`docs/firebase-setup.md`](firebase-setup.md). Summary:

1. **Frontend** — copy `frontend/.env.example` to `.env` and paste the Firebase Web App keys. `src/lib/firebase.ts` now reads those values from `import.meta.env` and throws if any are missing.
2. **Backend** — copy `backend/.env.example` to `.env` and set the `FIREBASE_SERVICE_ACCOUNT_PATH`, CORS origin, and rate-limit numbers you need. Place your downloaded Admin SDK JSON next to it (the file is gitignored; use `serviceAccountKey.example.json` as a reference).
3. Restart both dev servers after editing env files so the new variables are loaded.

## Useful Scripts
| Location | Command | Purpose |
| --- | --- | --- |
| backend | `npm run dev` | TSX-based watch server |
| backend | `npm run build && npm start` | Compile to `dist/` and run node |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Type-check + production build |
| scripts | `node importListings.mjs` | Seed properties into Firestore |

## Recommended Next Docs
- `docs/firebase-setup.md` — end-to-end checklist for configuring Firebase keys and service accounts
- `docs/api.md` — endpoints, request/response examples, auth requirements
- `docs/frontend-styleguide.md` — component patterns, typography, branding tokens
- `docs/runbooks/` — operational procedures (deploy, rollback, analytics exports)

Feel free to expand this directory as the project evolves; treat it as the single source of truth for process knowledge.
