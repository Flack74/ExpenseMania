# 💸 ExpenseMania

ExpenseMania is a full-stack personal finance application for tracking expenses, managing monthly budgets, reviewing spending patterns, and keeping everyday money decisions visible. It ships with a modern React dashboard, a production-ready Expo React Native mobile app, a Go/Fiber API, MongoDB persistence, secure authentication, theme preferences, CSV export, notifications, and password reset email support.

The application is designed as a production-ready split deployment: the frontend can run on Vercel, while the backend can run on Render, Docker, or any Go-compatible host.

## ✨ Features

- 📊 Responsive dashboard with income, expense, and savings KPIs, category summaries, and daily spending charts
- 💰 Expense and income creation, editing, deletion, and CSV export
- 🏷️ Custom, user-specific categories with emoji and color support
- 📚 Paginated expense history with search, filters, and sorting
- ⏱️ Render keep-alive workflow for scheduled uptime pings
- 🎯 Monthly budget tracking with category-level and overall budget support
- 🔁 Recurring budget configuration and alert thresholds
- 🔐 Email/password authentication with refresh-token support
- 📧 Forgot-password and reset-password flow through SMTP
- 🌓 Light, dark, and system theme preferences
- 📱 Mobile-first layouts for phones, smaller phones, tablets, and desktop screens
- ⚡ Optimistic UI updates powered by TanStack Query
- 🐳 Docker Compose stack with MongoDB, Redis, MailHog, and the backend API

## 🧱 Project Structure

```text
ExpenseMania/
├── expensemania-backend/       # Go + Fiber REST API
├── expensemania-frontend/      # React + TypeScript + Vite client
├── expensemania-mobile/        # Expo + React Native + TypeScript Android-first app
├── .github/workflows/keepalive.yml
├── docker-compose.yml          # Local infrastructure and backend service
└── README.md                   # Project documentation
```

## 🛠️ Tech Stack

### Frontend

- ⚛️ **React 18** for component-driven UI
- 🟦 **TypeScript** for safer application code
- ⚡ **Vite** for fast local development and optimized builds
- 🎨 **Tailwind CSS** for responsive utility-first styling
- 🧩 **shadcn/ui + Radix UI** primitives for accessible UI foundations
- 🎞️ **Framer Motion** for polished page and panel animations
- 🧭 **React Router** for client-side routing
- 🔄 **TanStack Query** for server state, caching, and invalidation
- 🧠 **Zustand** for lightweight auth and theme stores
- 📈 **Recharts** for dashboard charts
- 🔔 **Sonner** for toast notifications
- 🔗 **Axios** for API communication

### Mobile

- 📱 **Expo SDK 55 + React Native 0.83** for Android-first native builds
- 🟦 **TypeScript** for maintainable mobile architecture
- 🧭 **Expo Router** for file-based navigation and future iOS compatibility
- 🧠 **Zustand + MMKV** for fast, persistent UI preferences
- 🔄 **TanStack Query** for cached API data, retries, cancellation, and offline-friendly UX
- 🔐 **Expo Secure Store** for access and refresh tokens
- 🌐 **Axios** with interceptors, refresh-token rotation, request sanitization, retry handling, and timeouts
- 🎨 **NativeWind** configured for Tailwind-style utilities where useful
- 🎞️ **Reanimated + Gesture Handler** for smooth low-overhead interaction
- 🔔 **Expo Notifications** for local daily expense reminders
- 🧾 **React Hook Form + Zod** for validated mobile forms
- ⚡ **FlashList** for efficient expense, category, and recurring-expense lists

### Backend

- 🐹 **Go 1.22** for a fast, compiled API service
- 🚀 **Fiber** for HTTP routing and middleware
- 🍃 **MongoDB** for document persistence
- 🔑 **JWT access and refresh tokens** for authentication
- 🍪 **Secure cookies** for browser sessions
- 📬 **SMTP** for password reset emails
- 🧰 **Repository/service/handler layering** for maintainable backend structure
- 🧪 **Go test tooling** for backend verification

### Infrastructure

- 🐳 **Docker Compose** for local MongoDB, Redis, MailHog, and backend API
- ☁️ **Render** blueprint for backend deployment
- ▲ **Vercel** configuration for frontend deployment
- 📮 **MailHog** for local email testing

## 🚀 Deployment

### Frontend on Vercel

Deploy the `expensemania-frontend` directory as a separate Vercel project.

Set:

- Root Directory: `expensemania-frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL` set to the exact Render backend origin

The frontend already uses [`expensemania-frontend/public/spending.png`](expensemania-frontend/public/spending.png) as the browser icon.

### Backend on Render

Deploy the `expensemania-backend` directory as a Docker web service.

Create a Render Docker web service with:

- Service type: Web Service
- Environment: Docker
- Root Directory: `expensemania-backend`
- Dockerfile Path: `Dockerfile`
- Docker Context: `.`
- Health Check Path: `/api/v1/health`

Required backend environment variables:

- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `CORS_ALLOWED_ORIGINS`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM`
- `REDIS_URL` if you use Redis in production

If the Docker image builds but the service exits immediately on Render, check the
runtime logs for `database_connect_failed`. The API connects to MongoDB before it
starts listening, so a missing `MONGODB_URI`, an invalid connection string, or an
Atlas network access rule that blocks Render will fail the deploy.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19.4+ for Expo SDK 55 and React Native 0.83
- npm
- Go 1.22+
- Docker and Docker Compose, recommended for local infrastructure
- MongoDB, if you are not using Docker Compose
- Android Studio with Android SDK 36, Android Platform Tools, and an Android 10+ emulator or device
- EAS CLI for cloud APK/AAB builds: `npm install -g eas-cli`

## ⚙️ Environment Variables

### Frontend

Create a frontend environment file:

```bash
cd expensemania-frontend
cp .env.example .env.local
```

Set the backend origin:

```text
VITE_API_URL=http://localhost:8080
```

### Mobile

Create the mobile environment file:

```bash
cd expensemania-mobile
cp .env.example .env
```

For an Android emulator talking to a backend running on the same development machine:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1
```

For a physical Android phone on the same Wi-Fi network, use the computer LAN IP:

```text
EXPO_PUBLIC_API_URL=http://192.168.1.25:8080/api/v1
```

For a Render deployment, set `EXPO_PUBLIC_API_URL` to the exact Render service URL with `/api/v1`.

### Backend

Create a backend environment file:

```bash
cd expensemania-backend
cp .env.example .env
```

Important backend variables:

```text
APP_ENV=development
PORT=8080
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=expensemania
JWT_SECRET=replace-me
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,http://localhost:8081,http://127.0.0.1:8081,http://10.0.2.2:8081
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=no-reply@expensemania.local
REDIS_URL=redis://localhost:6379
DEFAULT_CURRENCY=INR
DEFAULT_TIMEZONE=Asia/Kolkata
```

Use strong, unique JWT secrets in production.

## 🧑‍💻 Local Development

### Option 1: Docker Infrastructure + Local Frontend

Start MongoDB, Redis, MailHog, and the backend:

```bash
docker compose up --build
```

Then start the frontend:

```bash
cd expensemania-frontend
npm install
npm run dev
```

Open the app:

```text
http://localhost:5173
```

### Option 2: Run Backend Manually

Start the backend:

```bash
cd expensemania-backend
go run ./cmd/api
```

Check the API health endpoint:

```bash
curl http://localhost:8080/api/v1/health
```

Start the frontend:

```bash
cd expensemania-frontend
npm install
npm run dev
```

### Mobile Development

Install mobile dependencies:

```bash
cd expensemania-mobile
npm install
```

Start Expo for Android:

```bash
npm run start
```

Then press `a` in the Expo terminal to open an Android emulator, or scan the QR code with Expo Go on a physical Android device. For a physical device, `EXPO_PUBLIC_API_URL` must use the computer LAN IP, not `localhost` or `10.0.2.2`.

Run quality checks:

```bash
npm run typecheck
npm run lint
```

The mobile app talks to:

```text
{EXPO_PUBLIC_API_URL}
```

The app expects this value to include `/api/v1`.

## 📱 Mobile Feature Map

Implemented mobile flows:

- Onboarding with theme selection and the required first-run daily-reminder prompt
- Login, register, forgot password, secure JWT storage, logout, and session hydration
- Dashboard with balance, spending, income, savings, trend chart, category breakdown, and recent expenses
- Expense creation with category chips and FlashList history
- Category creation and category list
- Monthly analytics with SVG trend visualization and category bars
- Recurring expense creation and scheduled recurring list
- Settings with theme selector, reminder toggle, reminder time picker, account links, app version, privacy policy, and logout
- Profile management with profile form and theme selector
- Four persisted mobile themes: Light Premium, Light Soft Stone, Light Green Minimal, and Dark Sage

Security and performance defaults:

- Tokens are stored only in Expo Secure Store
- MMKV stores non-sensitive preferences such as onboarding, reminders, and theme choice
- Axios uses bearer tokens, refresh-token recovery, request timeouts, request cancellation through React Query, sanitization of empty string fields, and GET retry handling
- TanStack Query caches dashboard, expense, category, analytics, and recurring data for offline-friendly reads
- FlashList is used for list-heavy screens
- Reanimated powers press feedback, skeletons, toasts, and banners without JS-heavy animation loops
- Android notification scheduling is local and battery-efficient; no 10-second polling exists

## 🔔 Notification Setup

The reminder flow is intentionally permission-first:

1. Onboarding asks: `Would you like daily reminders to log your expenses?`
2. If accepted, the app requests OS notification permission through Expo Notifications.
3. If permission is denied, reminders remain disabled.
4. Settings lets the user enable, disable, and change reminder time later.

Android notes:

- Android 13+ requires `POST_NOTIFICATIONS`, already configured in `expensemania-mobile/app.config.ts`.
- Local reminders are scheduled once per day at the chosen local device time.
- The reminder body is: `Don't forget to log today's expenses 💸`

## 🤖 Android APK And AAB Builds

Upgrade Node before building:

```bash
node --version
```

Expo SDK 55 requires Node `20.19.4+`. With `nvm`:

```bash
nvm install 22
nvm use 22
```

Install EAS CLI:

```bash
npm install -g eas-cli
eas login
```

Configure the production API URL as an EAS secret:

```bash
cd expensemania-mobile
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "$EXPO_PUBLIC_API_URL"
```

Build an internal APK:

```bash
npm run build:apk
```

Build a Play Store-ready AAB:

```bash
npm run build:aab
```

Local APK builds require Android SDK, Java, Gradle support, and EAS local build support:

```bash
npm run build:local-apk
```

The Android package id is:

```text
com.expensemania.mobile
```

Production build settings are in:

```text
expensemania-mobile/app.config.ts
expensemania-mobile/eas.json
```

## 🌐 Mobile Backend Connectivity And CORS

React Native native requests do not use browser CORS, but Expo web, local tooling, and the existing React frontend do. The backend now exposes both:

```text
GET /health
GET /api/v1/health
```

Both return:

```json
{
  "status": "ok"
}
```

For Render production, set `CORS_ALLOWED_ORIGINS` to a comma-separated list of exact deployed origins. A typical setup uses the Vercel frontend origin and the Render backend origin:

```text
CORS_ALLOWED_ORIGINS=$VERCEL_FRONTEND_ORIGIN,$RENDER_BACKEND_URL
```

For local Expo/web development, include:

```text
http://localhost:8081,http://127.0.0.1:8081,http://10.0.2.2:8081
```

The backend also allows common local Expo origins in development mode.

## ⏱️ Render Keep-Alive

Render free services can sleep after inactivity. The repository includes:

```text
.github/workflows/keepalive.yml
```

It runs every 5 minutes and calls:

```text
GET {RENDER_BACKEND_URL}/health
```

Set `RENDER_BACKEND_URL` as a repository variable or secret using the exact backend origin shown in Render.

Do not ping every 10 seconds. The current 5-minute interval is the intended low-waste keep-alive cadence.

## 🐳 Docker Usage

Start backend, MongoDB, Redis, and MailHog:

```bash
docker compose up --build
```

The backend image uses a multi-stage Go build, a small Alpine runtime, non-root user, cached module/build layers, and a `/health` Docker healthcheck.

Compose services:

- `backend` on port `8080`
- `mongodb` on port `27017`
- `redis` on port `6379`
- `mailhog` on ports `1025` and `8025`

Useful checks:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/v1/health
```

## ☁️ Render Backend Optimization

Use a Docker Web Service with root directory:

```text
expensemania-backend
```

Health check path:

```text
/health
```

Production environment guidance:

- Use strong unique values for `JWT_SECRET`, `JWT_ACCESS_SECRET`, and `JWT_REFRESH_SECRET`
- Use a production MongoDB URI with Render network access allowed
- Set `APP_ENV=production`
- Set `COOKIE_SECURE=true`
- Set `CORS_ALLOWED_ORIGINS` to exact deployed frontend origins
- Set `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW` for expected traffic
- Configure SMTP for password reset emails
- Keep `RENDER_BACKEND_URL` in GitHub Actions secrets or variables for keep-alive

## ✅ Production Checklist

- `go test ./...` passes for backend
- `npm run build` passes for `expensemania-frontend`
- `npm run typecheck` and `npm run lint` pass for `expensemania-mobile`
- Render `/health` returns `{ "status": "ok" }`
- Mobile `.env` or EAS secret points to the deployed `/api/v1`
- JWT login, refresh, logout, and profile hydration work on Android
- Notification permission flow is tested on Android 13+
- Reminder toggle and time picker schedule/cancel local notifications
- All four mobile themes switch instantly and persist after restart
- Dashboard, expenses, categories, analytics, recurring, settings, and profile screens work on a low-end Android emulator or device
- APK preview build installs and opens
- AAB production build is generated before Play Store submission
- Docker Compose stack starts and backend healthcheck passes

## 📜 Available Scripts

Frontend scripts:

```bash
npm run dev          # Start Vite development server
npm run build        # Create production build
npm run build:dev    # Create development-mode build
npm run lint         # Run ESLint
npm run test         # Run Vitest test suite
npm run preview      # Preview production build
```

Backend commands:

```bash
go run ./cmd/api     # Start API server
go test ./...        # Run backend tests
go mod tidy          # Clean dependency metadata
```

## 🔌 API Overview

The frontend communicates with the backend through:

```text
{VITE_API_URL}/api/v1
```

Core API areas:

- `/auth` for register, login, logout, refresh, forgot password, and reset password
- `/user` for profile and preferences
- `/expenses` for expense CRUD
- `/budgets` for budget CRUD
- `/analytics` for spending insights
- `/health` for service health checks

More backend details are available in:

```text
expensemania-backend/docs/API.md
```

## 📱 Responsive Design Notes

ExpenseMania is optimized for:

- Small mobile phones around 320px wide
- Modern mobile phones from 360px to 430px wide
- Tablets and foldable layouts
- Desktop dashboards with persistent sidebar navigation

Recent responsive improvements include:

- Mobile-safe auth and reset-password layouts
- Login page theme toggle moved into a clean top-right responsive bar
- Dashboard header truncation for long names and narrow screens
- Mobile-friendly KPI grids, category grids, and transaction rows
- Touch-visible edit actions for budgets and expenses
- Scrollable bottom-sheet dialogs with safer height limits
- Mobile form inputs sized to avoid iOS zoom behavior
- Better spacing, wrapping, and full-width actions on small screens

## 🐳 Docker Services

`docker-compose.yml` starts:

- Backend API: `http://localhost:8080`
- MongoDB: `mongodb://localhost:27017`
- Redis: `redis://localhost:6379`
- MailHog SMTP: `localhost:1025`
- MailHog UI: `http://localhost:8025`

MailHog is useful for testing password reset emails locally without sending real email.

## 📧 SMTP Setup

The backend supports any SMTP-compatible provider.

Common options:

- Gmail SMTP with an app password
- Brevo SMTP
- Mailtrap for development testing
- MailHog for local Docker testing

Required variables:

```text
SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM
FRONTEND_URL
```

Production recommendation: use a transactional email provider, set `COOKIE_SECURE=true`, and point `FRONTEND_URL` to the deployed frontend origin.

## ☁️ Deployment

### Backend on Render

Create a Render Docker web service for `expensemania-backend/`.

Set these variables in Render:

```text
MONGODB_URI
FRONTEND_URL
CORS_ALLOWED_ORIGINS
JWT_SECRET
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USERNAME
SMTP_PASSWORD
SMTP_FROM
REDIS_URL
COOKIE_SECURE=true
```

Health check path:

```text
/health
```

### Frontend on Vercel

Deploy the `expensemania-frontend/` directory.

Set:

```text
VITE_API_URL=$RENDER_BACKEND_URL
```

Build settings:

```text
Build command: npm run build
Output directory: dist
```

## ✅ Production Checklist

- ✅ `npm run build` passes in `expensemania-frontend/`
- ✅ `npm run lint` passes in `expensemania-frontend/`
- ✅ `go test ./...` passes in `expensemania-backend/`
- ✅ MongoDB connection string is configured
- ✅ JWT secrets are strong and unique
- ✅ `COOKIE_SECURE=true` in production
- ✅ `FRONTEND_URL` matches the deployed frontend
- ✅ `CORS_ALLOWED_ORIGINS` contains the deployed frontend origin
- ✅ SMTP credentials are configured and reset emails are tested
- ✅ Frontend `VITE_API_URL` points to the deployed backend
- ✅ Mobile and tablet layouts are checked before release

## 🧭 Suggested Workflow

1. Start infrastructure with Docker Compose.
2. Run the frontend locally with Vite.
3. Build features in small slices across frontend and backend.
4. Run frontend lint/build checks.
5. Run backend tests.
6. Deploy backend first, then deploy frontend with the public backend URL.

## 🩺 Troubleshooting

- **Frontend cannot reach backend:** verify `VITE_API_URL`, CORS origins, and backend health.
- **Login works locally but not in production:** check cookie security, HTTPS, and allowed origins.
- **Password reset email is missing:** verify SMTP settings and check MailHog or provider logs.
- **MongoDB errors on startup:** confirm `MONGODB_URI`, credentials, and network access.
- **Theme does not persist:** confirm browser localStorage is enabled.

## 📄 License

MIT License
