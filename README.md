# 🚗 Saarthi – Driver on Demand

> A full-stack web app connecting vehicle owners with verified on-demand drivers for emergency and scheduled situations.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Clone & Navigate
```bash
cd saarthi
```

### 2. Start the Backend API
```bash
cd server
npm install
npm run dev
```
> API runs at **http://localhost:5000**
> Health check: **http://localhost:5000/api/health**

### 3. Start the Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
> App runs at **http://localhost:5173**

---

## 📁 Project Structure

```
saarthi/
├── client/                   ← React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         ← Top navigation with branding
│   │   │   ├── BottomNav.jsx      ← Mobile tab navigation
│   │   │   └── RequestDriverFlow.jsx  ← 4-step driver request wizard
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    ← Splash / marketing page
│   │   │   ├── LoginPage.jsx      ← Authentication
│   │   │   ├── RegisterPage.jsx   ← Registration (owner/driver)
│   │   │   ├── CustomerHomePage.jsx  ← Main dashboard
│   │   │   ├── BookingsPage.jsx   ← Booking history
│   │   │   └── ProfilePage.jsx    ← User profile
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx     ← Shell with nav + bottom nav
│   │   ├── context/
│   │   │   └── AuthContext.jsx    ← Global auth state
│   │   ├── services/
│   │   │   └── api.js             ← REST API client
│   │   └── index.css              ← Design system (tokens + utilities)
│   └── package.json
│
├── server/                   ← Node.js + Express backend
│   ├── config/
│   │   └── db.js              ← MongoDB connection (graceful fallback)
│   ├── models/
│   │   ├── User.js
│   │   ├── Vehicle.js
│   │   ├── Booking.js
│   │   └── Driver.js
│   ├── controllers/
│   │   ├── authController.js  ← Login / register / me
│   │   ├── bookingController.js
│   │   └── vehicleController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── vehicles.js
│   │   └── drivers.js
│   ├── .env                   ← Environment variables
│   └── server.js              ← Express app entry point
│
└── README.md
```

---

## 🔑 Demo Login Accounts

| Name | Email | Password |
|------|-------|----------|
| Raj Sharma | raj@saarthi.in | demo123 |
| Priya Mehta | priya@saarthi.in | demo123 |

Or just click the **Quick Demo Login** buttons on the login screen.

---

## 📱 Pages & Features

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Marketing splash with features, how-it-works |
| Login | `/login` | Auth with demo accounts |
| Register | `/register` | 2-step: role → details |
| Home | `/home` | Dashboard: location, vehicles, bookings, request driver |
| Bookings | `/bookings` | Full booking history with status |
| Profile | `/profile` | User info, stats, settings |

---

## 🚨 Request Driver Flow (4 Steps)

1. **📍 Pickup Location** — Choose from suggestions or type an address
2. **🚗 Select Vehicle** — Pick from your registered vehicles
3. **⚡ Emergency / 📅 Scheduled** — Immediate request or pick date+time
4. **✅ Confirm** — Review summary & fare, confirm booking

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/bookings` | List bookings |
| POST | `/api/bookings` | Create booking |
| PATCH | `/api/bookings/:id/cancel` | Cancel booking |
| GET | `/api/vehicles` | List vehicles |
| POST | `/api/vehicles` | Add vehicle |
| GET | `/api/drivers/nearby` | Get nearby available drivers |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Styling | Vanilla CSS (custom design system) |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose (mock mode if offline) |
| Fonts | Plus Jakarta Sans, Inter (Google Fonts) |

---

## ⚠️ Current Limitations (V1 Foundation)

- **No real GPS** — Location is placeholder
- **No real payments** — Fare displayed only
- **No real authentication** — Mock JWT tokens
- **No MongoDB required** — All endpoints use mock data
- **No real-time tracking** — Driver match is simulated

> These features are planned for V2.

---

## 👨‍💻 Built With ❤️ in India for Saarthi
