# Pastebin Lite

A simple Pastebin-like web application where users can create text pastes
and share a link to view them. Pastes can expire based on time or view count.

## Tech Stack
- Backend: NestJS, Prisma, PostgreSQL (Neon)
- Frontend: Next.js (App Router), Tailwind CSS
- Deployment: Render (backend), Vercel (frontend)

## Live URLs
- Frontend: https://pastebin-assessment-frontend.vercel.app
- Backend API: https://assessment-backend-n6jj.onrender.com

## Running Locally

### Backend
```bash
git clone https://github.com/venkatatrinadh4444/assessment_backend.git
cd assessment_backend
npm install
npm run start:dev

.env 
DATABASE_URL=postgresql://neondb_owner:npg_txOqRoYW5av8@ep-plain-feather-adk7s3og-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

PORT=8000

APP_URL=https://pastebin-assessment-frontend.vercel.app/
TEST_MODE=1
