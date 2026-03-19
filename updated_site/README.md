TradingView-style Website (Frontend + Backend + MySQL + Login)

This package contains:

React/Vite frontend (port 3000)

Node/Express backend (port 5000)

MySQL database + phpMyAdmin via Docker

The Products (Calendar) page loads data from MySQL.
SymbolDetailView is private (Premium-only):

If you are not logged in → you are redirected to the Login modal

After login → you go to Home

After logout → you go to Home

What was implemented
1) Real authentication (backend)

Backend endpoints:

POST /api/auth/register (Email/Password)

POST /api/auth/login (Email/Password)

POST /api/auth/google (Google ID token verification)

GET /api/auth/me (session restore)

POST /api/auth/logout

Auth is stored in a HttpOnly cookie (works on localhost).

2) Premium gating (SymbolDetailView)

Only users with plan = 'premium' in MySQL can open SymbolDetailView.

Free users are redirected to Home with a message.

3) Database

Tables:

calendar_events (your calendar data)

users (accounts + plan free/premium)

1) Start the database (Docker)

In the project root:

docker compose up -d


phpMyAdmin:

http://localhost:8081

Server: mysql

User: root

Password: root

On first run, Docker automatically executes:

server/db/schema.sql

server/db/seed.sql

2) Configure Google Sign-In (OAuth)
Frontend (.env.local)

Set:

VITE_GOOGLE_CLIENT_ID=...

Backend (server/.env)

Set:

GOOGLE_CLIENT_ID=...

JWT_SECRET=... (anything)

Notes:

In Google Cloud Console (OAuth Client ID), keep:

Authorized JavaScript origins: http://localhost:3000

If VITE_GOOGLE_CLIENT_ID is empty, the Google button will be disabled.

3) Start the backend (Express)

In a terminal:

cd server
npm install
npm start


Backend:

http://localhost:5000

Test:

http://localhost:5000/api/health

http://localhost:5000/api/calendar

4) Start the frontend (React/Vite)

In a second terminal (project root):

npm install
npm run dev


Open:

http://localhost:3000

Make a user Premium (to unlock SymbolDetailView)
Option A: phpMyAdmin

Open phpMyAdmin (http://localhost:8081
)

Database: tv_app

Table: users

Edit your user row → set plan to premium

Option B: SQL
USE tv_app;
UPDATE users SET plan='premium' WHERE email='YOUR_EMAIL_HERE';

What happens in the UI (SymbolDetailView privacy)

You click a symbol in Markets.

If you are not logged in:

Login modal opens (Google or Email)

After successful login → you are redirected to Home

If you are logged in but Free:

You are redirected to Home

You see a message: Premium required

If you are logged in and Premium:

SymbolDetailView opens normally

When you press Logout:

Session is cleared

You go to Home

Notes

Put your Gemini key in .env.local (GEMINI_API_KEY=...) if you use the Gemini feature.

If you already created a MySQL volume before, and schema changed, reset it with:

docker compose down -v
docker compose up -d