# Firebase Setup Checklist

Use this guide to configure Firebase credentials for both the frontend (Vite) and backend (Express + firebase-admin).

## 1. Create / configure the Firebase project
1. In the [Firebase console](https://console.firebase.google.com/), create or open your project.
2. Go to **Build → Authentication → Sign-in method** and enable the providers you will support (Email/Password, Google, etc.).
3. Under **Project settings → General**, create a **Web App** (</> icon) if you don't already have one and copy the Firebase SDK snippet values.

## 2. Frontend environment file
1. Duplicate `frontend/.env.example` to `frontend/.env`.
2. Paste each value from the Firebase Web App:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID` (optional)
   - `VITE_API_BASE_URL` (e.g., `http://localhost:4000/api` for local Express)
3. Restart Vite so `import.meta.env` picks up the new variables. The helper in `src/lib/firebase.ts` will validate that none are missing and expose `auth` + `db`.

## 3. Backend environment file
1. Duplicate `backend/.env.example` to `backend/.env`.
2. Adjust values as needed:

| Variable | Description |
| --- | --- |
| `PORT` | API port for Express (default 4000) |
| `NODE_ENV` | `development`, `production`, or `test` |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Relative path to the Admin SDK JSON file you will download in the next step |
| `CORS_ORIGIN` | Allowed frontend origin (e.g., http://localhost:5173) |
| `RATE_LIMIT_WINDOW_MS` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX` | Max requests per window |

## 4. Firebase Admin service account
1. In the Firebase console, go to **Project settings → Service accounts**.
2. Click **Generate new private key** to download the Admin SDK JSON file.
3. Save the file inside `backend/` (for example `group5-grancanaria-firebase-adminsdk.json`).
4. Update `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env` to match this filename. The file is gitignored so it stays private.

## 5. Verify everything works
- Start the backend (`cd backend && npm run dev`). You should *not* see errors about missing environment variables or service accounts.
- Start the frontend (`cd frontend && npm run dev`). Open the browser console to confirm Firebase initializes only once.
- (Optional) Sign into Firebase using another client, grab an ID token, and call a protected backend route with `Authorization: Bearer <token>` to confirm `authenticate` accepts it.

Once these steps are complete, you can safely implement the UI login form and reuse the `auth` instance and backend token verification.
