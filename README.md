# GC Renting — Group5 (Complete project README)

This repository contains the GC Renting application: a web platform to list and find long-term rental properties in Gran Canaria. The project is split into a frontend (Vite + React + TypeScript) and a backend (Express + TypeScript) that integrates with Firebase (Authentication, Firestore, Storage).

Table of contents

- Project overview
- Repository layout (detailed)
- Requirements
- Local development (frontend + backend)
- Environment variables and example files
- Firebase setup and seeds
- Scripts and common commands
- Important files and directories (expanded)
- CI / Deployment notes
- Contributing
- Troubleshooting
- Security notes
- Suggested next steps
- License

Project overview

GC Renting is a marketplace-like app for long-term rentals. Main features:

- Public listing browsing and filtering
- Listing details, images and landlord contact
- Contact form that sends leads to Firestore
- Authentication and role-based admin pages
- Admin capabilities to manage listings, reviews and renter applications

Repository layout (detailed)

Top-level folders

- `frontend/` — Vite React application (TypeScript + Tailwind)
- `backend/` — Node/Express API (TypeScript) using Firebase Admin SDK
- `docs/` — documentation notes and setup guides
- `public/` — top-level public assets used by the repo (favicons, global assets)
- `scripts/` — maintenance utilities (e.g., import scripts)

Frontend structure (selected)

- `frontend/package.json` — frontend scripts & deps
- `frontend/index.html` — HTML entry, fonts and favicon links
- `frontend/public/` — static assets served by Vite
- `frontend/src/main.tsx` — React entry point
- `frontend/src/App.tsx` — app root and router
- `frontend/src/components/` — shared components (Header, Footer, Logo, Card components)
- `frontend/src/pages/` — page-level components (Home, Contact, AboutUs, Admin pages)
- `frontend/src/lib/` — api client, firebase client, helpers
- `frontend/src/styles/` — Tailwind overrides or global styles

Backend structure (selected)

- `backend/package.json` — backend scripts & deps
- `backend/src/index.ts` — Express server entry
- `backend/src/config/firebase.ts` — firebase-admin init (reads service account)
- `backend/src/controllers/` — route handlers
- `backend/src/services/` — business logic interacting with Firestore
- `backend/src/routes/` — express routes
- `backend/src/seeds/seedAdmin.ts` — seed script to create initial admin

Requirements

- Node.js 18+ (Node 20 recommended)
- npm 9+ (or yarn/pnpm)
- A Firebase project (Firestore + Authentication enabled)

Local development instructions

1) Clone repo

```bash
git clone https://github.com/Sykurlaust/Group5.git
cd Group5
```

2) Start frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

Vite dev server usually runs on http://localhost:5173.

3) Start backend (another terminal)

```bash
cd backend
npm install
npm run dev
```

Default backend port is 4000. Ensure `VITE_API_BASE_URL` (in frontend env) points at `http://localhost:4000/api` or your configured backend URL.

Environment variables and example files

You should not commit real secrets. Create `.env` files locally. Recommended variables:

frontend/.env (example)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_API_BASE_URL=http://localhost:4000/api
```

backend/.env (example)

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./group5-grancanaria-firebase-adminsdk-fbsvc-325f7fb903.json
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

I can generate `frontend/.env.example` and `backend/.env.example` files if you want them added to the repo.

Firebase setup & seeds

1. Create a Firebase project in console.firebase.google.com.
2. Enable Firestore and Authentication providers you need (Email/Password, Google, etc.).
3. Generate a Service Account key and place the JSON file locally; configure `FIREBASE_SERVICE_ACCOUNT_PATH` in backend `.env`.
4. Review `firestore.rules` and `storage.rules` present at repo root before deploying.
5. Optionally run the seed script `backend/src/seeds/seedAdmin.ts` to create an initial admin account.

Scripts and common commands

- Frontend (run inside `frontend/`):
    - `npm run dev` — start dev server
    - `npm run build` — build for production
    - `npm run preview` — preview production build
- Backend (run inside `backend/`):
    - `npm run dev` — run server in watch mode
    - `npm run build` — build for production (if configured)

Important files and references

- `firebase.json` — firebase configuration for hosting/emulators
- `firestore.rules` / `storage.rules` — security rules for Firestore and Storage
- `frontend/public/gc-renting-logo.svg`, `gc-renting-favicon.svg` — brand assets
- `frontend/src/components/Header.tsx`, `Footer.tsx` — top-level layout
- `frontend/src/pages/Contact.tsx` — contact form handling
- `backend/src/config/firebase.ts` — service account initialization
- `backend/src/seeds/seedAdmin.ts` — read before running seeds

CI / Deployment notes

- There is a GitHub Actions workflow in `.github/workflows/` (check `deploy-pages.yml`) that may be used to deploy the frontend to GitHub Pages or other providers. Review the workflow and update secrets in GitHub repository settings.
- For backend deployment consider Cloud Run, Heroku, or a VM. Ensure service account secrets are provided via the host platform's secret manager.

Contributing

Workflow recommendations:

1. Branch from `develop`: `git checkout -b feature/your-feature`
2. Small, focused commits with descriptive messages
3. Open PRs to `develop` with description and test steps
4. Use code review and link issues where applicable

I can add a `CONTRIBUTING.md` and PR/issue templates if you want.

Troubleshooting

- Missing Firebase config in frontend: restart Vite after adding `.env` variables.
- CORS errors: confirm `CORS_ORIGIN` matches frontend origin and backend is restarted.
- Service account errors: verify `FIREBASE_SERVICE_ACCOUNT_PATH` and file permissions.

Security notes

- Never commit service account JSON or `.env` files to Git.
- Use Firebase security rules.
- Use secret managers for production deployments.

Suggested next steps I can implement for you

- Create `frontend/.env.example` and `backend/.env.example` files (safe placeholders)
- Add `CONTRIBUTING.md`, `ISSUE_TEMPLATE.md`, `PULL_REQUEST_TEMPLATE.md` and a `LICENSE` (e.g., MIT)
- Add README badges (build, license) and a short `DEPLOY.md` describing deploy targets

License

Add a `LICENSE` file to the repo (for example MIT or Apache-2.0). If you want, I can add an MIT license file now.

---

If you'd like, I will now create the `frontend/.env.example`, `backend/.env.example`, `CONTRIBUTING.md`, and `LICENSE` (MIT) files and commit them to the repo. Reply which of those I should generate.

