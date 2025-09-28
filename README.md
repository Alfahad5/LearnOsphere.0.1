# LearnOSphere — Online Learning Platform 🎓🌐

A polished, production-ready learning marketplace connecting students and trainers with secure payments, live sessions, and rich profiles — built with React (TypeScript) frontend, Express.js backend, and MongoDB.

---

## 🔗 Live Project

**🔗 URL**: https://learn-osphere.vercel.app/ 

---

## 📂 Problem Statement

Students and trainers face friction when trying to connect and run paid live sessions:

* Hard to discover qualified trainers with rich profiles  
* Booking & payments workflows are tedious or insecure  
* Live teaching needs reliable, integrated video + receipts  
* Admins and trainers need analytics and earnings visibility

This leads to poor UX, lost conversions, and administrative overhead.

---

## ✅ Our Solution: LearnOSphere

**LearnOSphere** is a complete marketplace that solves the above by offering:

* Role-based access (Student / Trainer) and secure JWT authentication  
* Rich trainer profiles with demo videos, skills, availability, and reviews  
* Session booking with Stripe payments (plus a demo payment mode) and receipt generation  
* Jitsi-powered live sessions (session management + links)  
* Review & rating system with aggregated statistics for dashboards  
* Secure, validated REST API and real-time dashboard analytics

Result: a professional, secure, and scalable platform for teaching and learning online.

---

## 🏆 Core Features

### 🔐 Authentication & Authorization
* JWT-based auth with refresh token patterns
* Role-based access control: Student / Trainer
* Protected routes and secure password handling

### 🗂️ Backend (Express.js + MongoDB)
* MongoDB Schemas: Users, Trainers, Sessions, Reviews, Payments
* RESTful API design with clear status codes and error responses
* Validation and sanitization for all inputs
* Rate limiting, helmet, CORS, and other security middleware

### 💳 Payments
* Full Stripe integration for real charges
* Demo payment mode for testing flows without real payments
* Receipt generation (downloadable) after successful payments

### 📺 Sessions & Live Classes
* Jitsi integration for launching secure video meetings
* Booking lifecycle: request → payment → confirmation → session link
* Session attendance metadata and post-session actions

### ⭐ Reviews & Ratings
* Students can post reviews and star ratings
* Real-time aggregation of trainer ratings for dashboards

### 📊 Dashboards & Analytics
* Student dashboard: bookings, upcoming sessions, receipts
* Trainer dashboard: earnings, session history, student list
* Admin/metrics endpoints for real-time stats and KPIs

### 🧩 UX & Frontend (React + TypeScript + Tailwind)
* Beautiful responsive landing page with trust elements
* Role-aware registration & flows
* Advanced trainer filtering, search, and discovery
* Smooth Framer Motion animations and micro-interactions
* Robust loading & error states for great UX

---

## 🎨 Design System & Theme

* Custom color palette:
  * `#FBF5E5` (soft cream)
  * `#C890A7` (muted rose)
  * `#A35C7A` (deep accent)
  * `#212121` (dark base)
* Professional typography, spacing scale, and consistent micro-interactions

---

## 🚀 Quick Start (Local)

```bash
# Clone repository
git clone https://github.com/<yourusername>/LearnOSphere.git
cd LearnOSphere

# Backend
cd server
npm install
# create .env with required variables (see below)
npm run dev

# Frontend
cd ../client
npm install
npm run dev
```

### Typical .env (backend)
```
PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/learnosphere
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JITSI_BASE_URL=https://meet.jit.si
NODE_ENV=development
```

> Replace placeholders with real values (Stripe keys, Mongo URI, JWT secret).

---

## 🗺️ How It Works

### For Students
1. Register & verify account  
2. Browse/filter trainers by skill, rating, price, availability  
3. Book a session → pay via Stripe (or demo payment)  
4. Receive receipt and session/join link → attend via Jitsi  
5. Leave rating & review after session

### For Trainers
1. Sign up and complete profile (bio, skills, demo video, hourly rate)  
2. Manage availability and accept bookings  
3. Receive earnings reports and downloadable receipts  
4. View students, session stats, and aggregated ratings

---

## 📦 API Highlights (examples)

* `POST /api/auth/register` — register user (role-aware)  
* `POST /api/auth/login` — login, returns JWT  
* `GET /api/trainers` — list & filter trainers  
* `POST /api/sessions` — create booking (protected)  
* `POST /api/payments/create` — create Stripe payment intent  
* `POST /api/payments/webhook` — verify Stripe webhooks  
* `GET /api/dashboard/trainer` — trainer analytics (protected)

---

## 🛠️ Tech Stack

* **Frontend**: React + TypeScript + Tailwind CSS + Framer Motion  
* **Backend**: Node.js + Express.js  
* **Database**: MongoDB (Mongoose)  
* **Payments**: Stripe (with demo mode)  
* **Live Video**: Jitsi Meet integration  
* **Auth**: JWT tokens, role-based middleware

---

## ✅ Production Readiness Checklist

* Payment System: Full Stripe integration + demo option  
* Authentication: Secure JWT + protected routes  
* Database: MongoDB models with relationships and indexes  
* Session Management: Jitsi links + lifecycle handling  
* Review System: Star ratings & aggregated calculations  
* Security: Input validation, rate limiting, helmet, CORS  
* UX: Responsive UI, loading/error states, micro-interactions

---

## 📚 Contributors

Built with ❤️ by:

* **Mudadla Yogitha**  
  

---

## 📧 Contact

Have questions or want to collaborate?  
Email: `mudadlayogitha440@gmail.com`

---

Built with ❤️ by Mudadla Yogitha ✨
