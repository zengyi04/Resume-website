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

## Backend Environment

Backend environment variables are read from `backend/.env`.

Required key:

- `MONGODB_URI`

The app currently auto-seeds the MongoDB collections from frontend mock data on startup through `POST /api/seed`.
