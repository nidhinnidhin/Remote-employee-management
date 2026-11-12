<div align="center">

# 🏢 Stafflow — Employee Management System

**A comprehensive, production-ready Employee Management platform built with modern technologies.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-stafflow.nidhintech.site-2563eb?style=for-the-badge)](https://stafflow.nidhintech.site/)
[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?style=flat-square&logo=docker)](https://docs.docker.com/compose/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Redis](https://img.shields.io/badge/Redis-7-dc382d?style=flat-square&logo=redis)](https://redis.io/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Docker Setup](#-docker-setup)
- [API Documentation](#-api-documentation)
- [WebSocket Events](#-websocket-events)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🔍 Overview

**Stafflow** is a full-stack, multi-tenant employee management system designed for organizations of all sizes. It provides a centralized platform for managing employees, tracking attendance, handling leave requests, managing projects and tasks, real-time team communication, and much more — all through a beautiful, responsive dashboard.

The platform supports **three distinct user roles** — Super Admin, Company Admin, and Employee — each with role-specific dashboards and capabilities.

> **🌐 Live Demo:** [https://stafflow.nidhintech.site/](https://stafflow.nidhintech.site/)

---

## 🎯 Problem Statement

Managing employees across departments in growing organizations often involves fragmented tools — separate apps for attendance, leave management, project tracking, team communication, and HR documents. **Stafflow** solves this by consolidating everything into a single, unified platform that:

- Eliminates manual attendance tracking with real-time clock-in/clock-out
- Automates leave request workflows with approval/rejection flows
- Centralizes project management with sprints, stories, and tasks (Kanban boards)
- Provides real-time team communication with integrated chat
- Delivers actionable insights through analytics dashboards
- Handles employee onboarding with invite-based registration

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with access & refresh tokens (HttpOnly cookies)
- Email OTP verification via Resend SMTP
- Social login (Google, GitHub, Facebook) via NextAuth.js
- Role-Based Access Control (RBAC): **Super Admin**, **Company Admin**, **Employee**
- Secure password reset flow with OTP verification

### 👥 Employee Management
- Invite employees via email with secure invite links
- Employee profiles with personal info, skills, and documents
- Block/unblock employees with automated email notifications
- Department assignment and team management
- Employee onboarding workflow

### ⏰ Attendance & Time Tracking
- Real-time clock-in / clock-out system
- Late clock-in request and approval workflow
- Early clock-out with admin approval
- Break tracking with break request system
- Attendance history and detailed logs
- Monthly/weekly attendance analytics

### 📅 Leave Management
- Apply for leave with date range and reason
- Admin approval/rejection with remarks
- Leave balance tracking by leave type
- Leave history and logs
- Email notifications on leave decisions

### 📊 Project Management
- Create and manage projects with team assignments
- Sprint planning and management
- User stories with story points
- Task management with **Kanban board** (drag & drop)
- Task time logging (log hours worked)
- Project comments and collaboration

### 💬 Real-Time Chat
- One-on-one messaging between employees
- Group chat with create/manage groups
- Real-time message delivery via WebSocket (Socket.IO)
- Emoji picker support
- Online presence indicators

### 🔔 Notifications
- Real-time in-app notifications via WebSocket
- Notification for attendance requests, leave decisions, task assignments, etc.

### 📋 Company Administration
- Company onboarding with multi-step setup
- Department creation and management
- Company policy configuration (working hours, leave policies)
- Audit logs for all admin actions
- Discussion forums (company-wide)

### 🛡️ Super Admin Panel
- Multi-company management
- Company activation/suspension
- Subscription plan management (Razorpay integration)
- System-wide activity logs
- Support ticket management

### 📹 Video Meetings
- Create and schedule meetings
- Real-time meeting management via WebSocket

### 🎫 Support Tickets
- Raise support tickets
- Ticket tracking and resolution

### 📄 Document Management
- Upload and manage employee documents (ID proofs, certificates)
- Cloudinary-powered media storage
- Document categorization

---

## 🛠️ Tech Stack

### Backend

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **NestJS** | 11.x | Node.js framework (modular, scalable) |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **MongoDB** | Atlas | NoSQL database (via Mongoose 8.x) |
| **Redis** | 7 | Caching, session store, pending registrations |
| **Socket.IO** | 4.8 | Real-time WebSocket communication |
| **JWT** | 9.x | Authentication tokens |
| **Nodemailer** | 7.x | Email delivery (Resend SMTP) |
| **Cloudinary** | 2.x | Image/document cloud storage |
| **Razorpay** | 2.x | Payment gateway (subscriptions) |
| **bcrypt** | 6.x | Password hashing |
| **class-validator** | 0.14 | DTO validation |

### Frontend

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | 16.x | React framework (App Router, SSR) |
| **React** | 19.x | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **Zustand** | 5.x | Lightweight state management |
| **Redux Toolkit** | 2.x | Global state management |
| **React Hook Form** | 7.x | Form handling & validation |
| **Zod** | 4.x | Schema validation |
| **Framer Motion** | 12.x | Animations |
| **Recharts** | 3.x | Data visualization charts |
| **Socket.IO Client** | 4.8 | Real-time WebSocket client |
| **NextAuth.js** | 4.x | Social authentication |
| **iron-session** | 8.x | Encrypted session cookies |
| **Lucide React** | 0.562 | Icon library |
| **Headless UI** | 2.x | Accessible UI primitives |
| **Hello Pangea DnD** | 18.x | Drag and drop (Kanban boards) |

### DevOps & Infrastructure

| Technology | Purpose |
| :--- | :--- |
| **Docker** & **Docker Compose** | Containerization |
| **AWS EC2** | Cloud hosting |
| **GitHub Actions** | CI/CD pipelines |
| **Hostinger** | Domain & DNS management |
| **pnpm** | Fast, efficient package manager |

---

## 🏗️ Architecture

The project follows **Clean Architecture** principles with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│                     Next.js 16 (App Router)                  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP / WebSocket
┌────────────────────────────▼────────────────────────────────┐
│                     API GATEWAY (NestJS)                      │
│              Controllers → Use Cases → Repositories          │
├──────────────────────────────────────────────────────────────┤
│  Presentation Layer   │  Application Layer  │  Domain Layer  │
│  ─────────────────    │  ─────────────────  │  ────────────  │
│  Controllers          │  Use Cases (CQRS)   │  Entities      │
│  Gateways (WS)        │  DTOs               │  Repositories  │
│  Guards               │  Mappers            │  (Interfaces)  │
│  Decorators           │  Interfaces         │                │
├──────────────────────────────────────────────────────────────┤
│               Infrastructure Layer                            │
│  ─────────────────────────────────                            │
│  MongoDB Repositories (Mongoose)                              │
│  Redis Cache Repositories                                     │
│  External Services (Cloudinary, Resend, Razorpay)            │
└──────────────────────────────────────────────────────────────┘
```

### Backend Module Pattern
Each backend module follows a **4-layer architecture**:
```
module/
├── domain/           # Entities, repository interfaces
├── application/      # Use cases, DTOs, mappers, interfaces
├── infrastructure/   # Database schemas, repository implementations, cache
└── presentation/     # Controllers, WebSocket gateways
```

---

## 📁 Folder Structure

```
employee-management-app/
├── .github/
│   └── workflows/
│       ├── backend.yml              # Backend CI/CD pipeline
│       └── frontend.yml             # Frontend CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── activity-logs/       # Audit trail & activity logging
│   │   │   ├── attendance/          # Clock-in/out, breaks, late requests
│   │   │   ├── auth/                # Registration, login, OTP, password reset
│   │   │   ├── chat/                # Real-time messaging (1:1 & group)
│   │   │   ├── company-admin/       # Company policies & admin operations
│   │   │   ├── department/          # Department CRUD & employee assignment
│   │   │   ├── employees/           # Employee management (invite, block, list)
│   │   │   ├── leave/               # Leave applications & approvals
│   │   │   ├── meeting/             # Video meeting management
│   │   │   ├── notification/        # Real-time notifications
│   │   │   ├── project/             # Projects, sprints, stories, tasks
│   │   │   ├── subscription/        # Razorpay subscription plans
│   │   │   ├── super-admin/         # Multi-company management
│   │   │   └── ticket/              # Support ticket system
│   │   ├── shared/
│   │   │   ├── config/              # App configuration (cookies, etc.)
│   │   │   ├── constants/           # Messages, paths, OTP config
│   │   │   ├── decorators/          # Custom NestJS decorators
│   │   │   ├── enums/               # Enumerations
│   │   │   ├── guards/              # JWT auth guard
│   │   │   ├── repositories/        # Shared repository interfaces
│   │   │   ├── services/            # Auth, email, cloudinary, payment, redis
│   │   │   ├── types/               # Shared TypeScript types
│   │   │   └── utils/               # Utility functions
│   │   ├── app.module.ts            # Root NestJS module
│   │   └── main.ts                  # Application entry point
│   ├── test/                        # E2E tests
│   ├── dockerfile                   # Backend Docker image
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── tsconfig.json
│   └── .env                         # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── auth/                # Login, register, verify, onboarding
│   │   │   ├── admin/               # Company admin dashboard pages
│   │   │   ├── company-admin/       # Company admin operations
│   │   │   ├── employee/            # Employee dashboard pages
│   │   │   ├── super-admin/         # Super admin pages
│   │   │   ├── attendance/          # Attendance page
│   │   │   └── chats/               # Chat page
│   │   ├── components/              # React components
│   │   │   ├── company/             # Company admin components
│   │   │   ├── employees/           # Employee-facing components
│   │   │   └── ui/                  # Reusable UI components
│   │   ├── services/                # API service layer (Axios)
│   │   ├── store/                   # State management (Zustand stores)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── actions/                 # Server actions
│   │   ├── shared/                  # Shared types, enums, constants
│   │   ├── lib/                     # Utility libraries
│   │   └── proxy.ts                 # Auth proxy middleware
│   ├── public/                      # Static assets
│   ├── dockerfile                   # Frontend Docker image
│   ├── package.json
│   ├── pnpm-lock.yaml
│   └── .env                         # Frontend environment variables
├── docker-compose.yml               # Production Docker Compose
├── docker-compose.local.yml         # Local dev overrides (hot-reload)
└── README.md
```

---

## 📋 Prerequisites

Ensure the following are installed on your system:

| Tool | Version | Download |
| :--- | :--- | :--- |
| **Docker** | 20.x+ | [docker.com](https://www.docker.com/products/docker-desktop/) |
| **Docker Compose** | 2.x+ | Included with Docker Desktop |
| **Node.js** (optional, for non-Docker dev) | 20.x+ | [nodejs.org](https://nodejs.org/) |
| **pnpm** (optional, for non-Docker dev) | 10.x+ | [pnpm.io](https://pnpm.io/) |
| **Git** | 2.x+ | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/employee-management-app.git
cd employee-management-app
```

### 2. Set Up Environment Variables

Create `.env` files for both backend and frontend:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend (create manually — see Environment Variables section below)
```

### 3. Start with Docker (Recommended)

```bash
docker compose up --build
```

That's it! The app will be running at:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `PORT` | Backend server port | `4000` |
| `FRONTEND_URL` | Frontend URL (CORS) | `http://localhost:3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB_NAME` | Database name | `employee_management` |
| `JWT_ACCESS_SECRET` | JWT access token secret | `your_access_secret` |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `your_refresh_secret` |
| `SUPER_ADMIN_EMAIL` | Super admin login email | `admin@gmail.com` |
| `SUPER_ADMIN_PASSWORD` | Super admin login password | `your_password` |
| `REDIS_URL` | Redis connection URL | `redis://redis:6379` |
| `RESEND_API_KEY` | Resend email API key | `re_xxxxxxxxxxxx` |
| `RESEND_FROM_EMAIL` | Sender email address | `Portal Support <noreply@yourdomain.com>` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `RAZORPAY_KEY_ID` | Razorpay key ID | `rzp_test_xxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret | `your_razorpay_secret` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
| :--- | :--- | :--- |
| `API_URL_INTERNAL` | Internal API URL (Docker network) | `http://backend:4000/api` |
| `NEXT_PUBLIC_API_URL` | Public API URL (browser) | `http://localhost:4000/api` |
| `LOCAL_DEV` | Enable local dev mode (lax cookies) | `true` |
| `SESSION_SECRET` | Iron session encryption secret (32+ chars) | `your_session_secret_32_chars_long` |
| `NEXTAUTH_SECRET` | NextAuth.js secret | `your_nextauth_secret` |
| `NEXTAUTH_URL` | NextAuth.js base URL | `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | `GOCSPX-xxxx` |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | `Ov23xxxxxxxx` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | `your_github_secret` |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_test_xxxx` |

> **⚠️ Important:** Never commit `.env` files to version control. Add them to `.gitignore`.

---

## ▶️ Running the Project

### Using Docker (Recommended)

#### Local Development (with hot-reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.local.yml up --build
```

This starts:
- Frontend in **dev mode** with live reload (source files mounted)
- Backend in production mode
- Redis 7 Alpine

#### Production Build (locally)

```bash
docker compose up --build
```

#### Run in Background (detached)

```bash
docker compose up --build -d
```

#### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

#### Stop the Project

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers + volumes
docker compose down -v
```

### Without Docker (Manual Setup)

#### Backend

```bash
cd backend
pnpm install
pnpm run start:dev      # Development (watch mode)
# or
pnpm run build && pnpm run start   # Production
```

#### Frontend

```bash
cd frontend
pnpm install
pnpm run dev             # Development
# or
pnpm run build && pnpm run start   # Production
```

> **Note:** When running without Docker, you need a separate Redis instance running on `localhost:6379`.

---

## 🐳 Docker Setup

### Services Overview

| Service | Image | Port | Description |
| :--- | :--- | :--- | :--- |
| `frontend` | `nidhintech/nexus-frontend` | `3000` | Next.js frontend app |
| `backend` | `nidhintech/nexus-backend` | `4000` | NestJS API server |
| `redis` | `redis:7-alpine` | `6379` | Redis cache server |

### Docker Compose Files

| File | Purpose |
| :--- | :--- |
| `docker-compose.yml` | Production configuration |
| `docker-compose.local.yml` | Local dev overrides (hot-reload, volume mounts) |

### Dockerfiles

Both services use **multi-stage builds** for optimized images:

- **Backend** (`backend/dockerfile`): `base` → `deps` → `build` → `production`
- **Frontend** (`frontend/dockerfile`): `base` → `deps` → `build` → `production`

### Useful Docker Commands

```bash
# Check running containers
docker compose ps

# Restart a specific service
docker compose restart backend

# Rebuild a specific service
docker compose up --build backend

# Enter a running container
docker compose exec backend sh

# Remove all stopped containers and unused images
docker system prune -a
```

---

## 📡 API Documentation

### Base URL

- **Local:** `http://localhost:4000/api`
- **Production:** `https://stafflow-api.nidhintech.site/api`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | ❌ | Register a new company admin |
| `POST` | `/auth/login` | ❌ | Login with email & password |
| `POST` | `/auth/social-login` | ❌ | Social login (Google/GitHub) |
| `POST` | `/auth/onboard` | ❌ | Complete company onboarding |
| `POST` | `/auth/refresh` | 🍪 | Refresh access token |
| `POST` | `/auth/logout` | ✅ | Logout and clear cookies |

### OTP & Password Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/otp/verify` | ❌ | Verify email OTP |
| `POST` | `/otp/resend` | ❌ | Resend OTP |
| `POST` | `/password/forgot` | ❌ | Request password reset |
| `POST` | `/password/verify-reset-otp` | ❌ | Verify reset OTP |
| `POST` | `/password/reset` | ❌ | Reset password |

### Employee Management Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/employees/invite` | ✅ | Invite employee via email |
| `GET` | `/employees/list` | ✅ | List all employees |
| `PATCH` | `/employees/block` | ✅ | Block/unblock an employee |
| `POST` | `/employees/verify-invite` | ❌ | Verify invite token |
| `POST` | `/employees/set-password` | ❌ | Set password for invited employee |

### Attendance Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/attendance/clock-in` | ✅ | Clock in |
| `POST` | `/attendance/clock-out` | ✅ | Clock out |
| `POST` | `/attendance/break/start` | ✅ | Start a break |
| `POST` | `/attendance/break/end` | ✅ | End a break |
| `GET` | `/attendance/history` | ✅ | Get attendance history |
| `POST` | `/attendance/late-request` | ✅ | Submit late clock-in request |

### Leave Management Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/leave/apply` | ✅ | Apply for leave |
| `GET` | `/leave/balance` | ✅ | Get leave balance |
| `GET` | `/leave/history` | ✅ | Get leave history |
| `PATCH` | `/leave/approve` | ✅ | Approve/reject leave (admin) |

### Project Management Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/projects` | ✅ | Create a project |
| `GET` | `/projects` | ✅ | List projects |
| `GET` | `/projects/:id` | ✅ | Get project details |
| `POST` | `/sprints` | ✅ | Create a sprint |
| `POST` | `/stories` | ✅ | Create a user story |
| `POST` | `/tasks` | ✅ | Create a task |
| `PATCH` | `/tasks/:id` | ✅ | Update task (status, assignee) |
| `POST` | `/comments` | ✅ | Add a comment |

### Department Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/departments` | ✅ | Create a department |
| `GET` | `/departments` | ✅ | List departments |
| `PATCH` | `/departments/:id` | ✅ | Update a department |
| `POST` | `/departments/assign` | ✅ | Assign employee to department |

### Other Endpoints

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/profile` | ✅ | Get user profile |
| `PATCH` | `/profile` | ✅ | Update user profile |
| `POST` | `/profile/upload-image` | ✅ | Upload profile image |
| `POST` | `/documents/upload` | ✅ | Upload a document |
| `GET` | `/notifications` | ✅ | Get notifications |
| `POST` | `/chat/send` | ✅ | Send a chat message |
| `GET` | `/chat/conversations` | ✅ | Get chat conversations |
| `POST` | `/meetings` | ✅ | Create a meeting |
| `POST` | `/tickets` | ✅ | Create a support ticket |
| `GET` | `/subscriptions/plans` | ✅ | Get subscription plans |
| `POST` | `/subscriptions/create` | ✅ | Create a subscription |
| `GET` | `/activity-logs` | ✅ | Get activity logs |

> **Auth Legend:** ✅ = JWT required (HttpOnly cookie) · ❌ = Public · 🍪 = Refresh token cookie required

---

## 🔌 WebSocket Events

The application uses **Socket.IO** for real-time features:

### Chat Gateway (`/chat`)
| Event | Direction | Description |
| :--- | :--- | :--- |
| `sendMessage` | Client → Server | Send a message |
| `newMessage` | Server → Client | Receive a new message |
| `joinRoom` | Client → Server | Join a chat room |
| `typing` | Bidirectional | Typing indicator |

### Notification Gateway (`/notifications`)
| Event | Direction | Description |
| :--- | :--- | :--- |
| `notification` | Server → Client | Receive a notification |
| `subscribe` | Client → Server | Subscribe to notifications |

### Meeting Gateway (`/meetings`)
| Event | Direction | Description |
| :--- | :--- | :--- |
| `joinMeeting` | Client → Server | Join a meeting room |
| `meetingUpdate` | Server → Client | Meeting state updates |

---

## 🌐 Deployment

### Live Application

The application is deployed and accessible at:

| Service | URL |
| :--- | :--- |
| **Frontend** | [https://stafflow.nidhintech.site](https://stafflow.nidhintech.site/) |
| **Backend API** | [https://stafflow-api.nidhintech.site](https://stafflow-api.nidhintech.site/) |

### Infrastructure

- **Hosting:** AWS EC2
- **Domain & DNS:** Hostinger
- **Database:** MongoDB Atlas (cloud)
- **Email:** Resend SMTP
- **Media Storage:** Cloudinary
- **CI/CD:** GitHub Actions

### Deploy to Your Own Server

```bash
# 1. SSH into your server
ssh user@your-server-ip

# 2. Clone the repository
git clone https://github.com/your-username/employee-management-app.git
cd employee-management-app

# 3. Configure environment variables
nano backend/.env    # Add production values
nano frontend/.env   # Add production values

# 4. Build and start
docker compose up --build -d

# 5. Verify
docker compose ps
docker compose logs -f
```

### CI/CD

GitHub Actions workflows are configured for automated deployment:
- `backend.yml` — Builds and deploys the backend on push
- `frontend.yml` — Builds and deploys the frontend on push

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

<div align="center">

**Built with ❤️ by [Nidhin](https://nidhintech.site)**

</div>

