# 💸 ExpenseMania

ExpenseMania is a full-stack personal finance application for tracking expenses, managing monthly budgets, reviewing spending patterns, and keeping everyday money decisions visible. It ships with a modern React dashboard, a Go/Fiber API, MongoDB persistence, secure authentication, theme preferences, CSV export, and password reset email support.

The application is designed as a production-ready split deployment: the frontend can run on Vercel, while the backend can run on Render, Docker, or any Go-compatible host.

## ✨ Features

- 📊 Responsive expense dashboard with monthly KPIs, category summaries, and daily spending charts
- 💰 Expense creation, editing, deletion, and CSV export
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
├── expensemania-frontend/      # React + TypeScript + Vite client
├── expensemania-backend/       # Go + Fiber REST API
├── docker-compose.yml          # Local infrastructure and backend service
├── render.yaml                 # Render backend deployment blueprint
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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm
- Go 1.22+
- Docker and Docker Compose, recommended for local infrastructure
- MongoDB, if you are not using Docker Compose

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
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080
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

Use the root `render.yaml` blueprint.

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
/api/v1/health
```

### Frontend on Vercel

Deploy the `expensemania-frontend/` directory.

Set:

```text
VITE_API_URL=https://your-backend-url.example.com
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

No license file is currently included. Add one before distributing or publishing the project publicly.
