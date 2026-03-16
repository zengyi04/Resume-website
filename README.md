# Resume Website

This repository now contains:

- `frontend`: Vite + React portfolio app
- `backend`: Express + MongoDB API for `home`, `experience`, `committee`, `achievements`, and `education`

## Quick Start

Prerequisite: Node.js 20+

1. Install root tooling:
   - `npm install`
2. Install frontend dependencies:
   - `npm --prefix frontend install`
3. Install backend dependencies:
   - `npm --prefix backend install`
4. Run both services:
   - `npm run dev`

Frontend runs on `http://localhost:3000`.
Backend runs on `http://localhost:5000`.

Optional frontend env for development:

- `VITE_API_BASE_URL` (optional override; by default frontend uses same-origin `/api`)
- `VITE_API_PROXY_TARGET` (optional Vite dev proxy target, default `http://127.0.0.1:5000`)

## Backend Environment

Backend environment variables are read from `backend/.env`.

Required key:

- `MONGODB_URI` in production

For local development, if `MONGODB_URI` is not set, the backend falls back to `mongodb://127.0.0.1:27017` and uses the `resume_website` database name.

The app currently auto-seeds the MongoDB collections from frontend mock data on startup through `POST /api/seed`.

## Vercel Deployment

This repository is configured to deploy from the repository root on Vercel.

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `frontend/dist`

The frontend is deployed as the static site and the backend is deployed together as a Vercel serverless function at `/api/*`.

Behavior in production:

- Frontend routes fallback to `index.html` (SPA routing)
- Backend API is served from `api/[...route].ts`

Set this environment variable in Vercel before deploying:

- `MONGODB_URI`

Optional environment variable:

- `FRONTEND_ORIGIN` (comma-separated list of additional allowed origins for CORS)

## Render Deployment

This repository can also deploy to Render as a single Web Service from the repository root.

- Build command: `npm install && npm run build`
- Start command: `npm start`

Required environment variable:

- `MONGODB_URI`

Optional environment variable:

- `FRONTEND_ORIGIN` (set this to your Render service URL if you want to explicitly allow that origin)
