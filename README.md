<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/NextJS-Dark.svg" width="60" alt="Next.js" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Prisma.svg" width="60" alt="Prisma" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/PostgreSQL-Dark.svg" width="60" alt="PostgreSQL" />

  <h1 align="center">Classroom — Attendance Manager</h1>
  <p align="center">
    <strong>A modern, per-user attendance tracking web application.</strong>
    <br />
    Built with Next.js 16, Auth.js v5, Prisma v7, and Azure PostgreSQL.
  </p>
</div>

<hr />

## 🌟 Overview

Classroom is a full-stack web application designed to help students track their attendance across multiple subjects seamlessly. With a beautifully crafted **Amethyst-Mint Harmony** UI, users get their own private, secure dashboard to monitor their classes, set custom danger thresholds, and log their daily attendance via an interactive calendar grid.

### ✨ Key Features

- **OAuth Authentication:** Secure, one-click sign-in via Google and GitHub using Auth.js v5.
- **Private Dashboards:** Each user gets an isolated workspace. No data sharing.
- **Visual Analytics:** Real-time progress rings and statistic cards.
- **Danger Zone Alerts:** Users can set a custom "danger threshold" (e.g. 75%) for each subject. If attendance drops below it, the system throws an alert!
- **Interactive Calendar:** A monthly grid view with color-coded dots representing attended, missed, and partially attended classes.
- **Dark Mode Support:** A sleek, glassmorphic UI that automatically adapts to system preferences.
- **Responsive Design:** Works flawlessly on desktop, tablet, and mobile.

---

## 📸 Visual Tour

### The Dashboard
Get a quick glance at your overall attendance, total subjects, and any subjects currently at risk.
> *Features glassmorphic statistic cards and dynamic SVG progress rings.*

### The Calendar
A bird's-eye view of your entire month. Click any day to quickly add or edit an attendance record.
> *Color-coded dots allow you to instantly see which subjects you had classes for on any given day.*

### Subject Management
Add custom colors to subjects and adjust the danger threshold slider to fit your university's requirements.
> *Live preview cards update instantly as you adjust the threshold and color.*

---

## 🛠️ Tech Stack

This project leverages the modern web development ecosystem:

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router, React Server Components, Server Actions |
| **Authentication** | [Auth.js v5](https://authjs.dev/) | NextAuth Beta for Google & GitHub OAuth |
| **ORM** | [Prisma v7](https://www.prisma.io/) | Next-generation database toolkit with driver adapters |
| **Database** | [Azure PostgreSQL](https://azure.microsoft.com/) | Cloud-hosted relational database |
| **Styling** | Vanilla CSS | Custom design system using CSS Variables |
| **Hosting** | [Vercel](https://vercel.com/) | Edge-optimized global deployment |

---

## 🚀 Quick Start (Local Development)

Want to run Classroom on your own machine? Follow these steps:

### 1. Prerequisites
- **Node.js** (v20 or newer)
- **Git**
- A **PostgreSQL** database (Local or Cloud like Azure/Supabase)

### 2. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/attendance-manager.git
cd attendance-manager
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` and configure your variables:
```env
# 1. Add your PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# 2. Generate an Auth Secret (run: openssl rand -base64 32)
AUTH_SECRET="your-random-32-char-string"
AUTH_URL="http://localhost:3000"

# 3. Add your OAuth Credentials (from Google/GitHub Developer Consoles)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"
```

### 4. Database Migration
Push the Prisma schema to your database to create the required tables:
```bash
npx prisma migrate dev --name init
```

### 5. Start the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. You're ready to go!

---

## 🌐 Deploying to Vercel

Deployment is fully optimized for Vercel.

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. In the Vercel deployment settings, add all the environment variables from your `.env` file.
   - **Crucial:** Change `AUTH_URL` to your production domain (e.g., `https://classes.yourdomain.com`).
4. Click **Deploy**. Vercel will automatically run `prisma generate` and build the Next.js app.

*(Don't forget to update your Google and GitHub OAuth callback URLs to match your new production domain!)*

---

## 📂 Project Structure

```text
attendance-manager/
├── prisma/
│   └── schema.prisma              # Database schema (Models)
├── src/
│   ├── auth.ts                    # Auth.js configuration
│   ├── proxy.ts                   # Next.js 16 route protection
│   ├── lib/
│   │   └── prisma.ts              # Prisma Client singleton
│   ├── app/
│   │   ├── layout.tsx             # Root Layout (Providers, Fonts)
│   │   ├── page.tsx               # Landing Page
│   │   ├── globals.css            # Complete UI Design System
│   │   ├── api/auth/              # NextAuth Route Handler
│   │   ├── actions/               # React Server Actions (DB logic)
│   │   └── (app)/                 # Protected Routes Group
│   │       ├── dashboard/         # Dashboard Page
│   │       ├── calendar/          # Calendar Page
│   │       └── subjects/          # Subject Management Pages
│   └── components/                # Reusable React Components
└── next.config.ts                 # Next.js Configuration
```

---

## 📜 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it!

<div align="center">
  <p>Built with ❤️ for students everywhere.</p>
</div>
