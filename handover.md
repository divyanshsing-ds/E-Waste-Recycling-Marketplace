# E-Waste Recycling Marketplace — Development Handover

Welcome to the **E-Waste Recycling Marketplace**, a production-ready platform designed to connect environmentally conscious citizens with certified e-waste recyclers.

## 🚀 Quick Start Instructions

### 1. Backend (Django REST Framework)
The backend is set up with a split settings architecture for secure local and production deployment.

```powershell
cd backend
venv\Scripts\activate
# Start the API server
python manage.py runserver
```
*   **API Root**: `http://localhost:8000/api/`
*   **Swagger API Docs**: `http://localhost:8000/api/docs/`
*   **Admin Panel**: `http://localhost:8000/admin/`

### 2. Frontend (React + Vite + Tailwind)
Standard Vite setup with interactive dashboards for both Users and Vendors.

```powershell
cd frontend
npm run dev
```
*   **Developer URL**: `http://localhost:5173/`

---

## 🛠️ Tech Stack & Key Features

### Backend Highlights
- **Role-Based Access (RBAC)**: Custom permissions (`IsVendor`, `IsUser`, `IsOwner`) ensure data security.
- **JWT Authentication**: Secure login/session management via `SimpleJWT` with silent token refresh on the frontend.
- **Bidding Engine**: Atomically transitions listings from `open` to `closed` when a bid is accepted, automatically triggering an Order.
- **Trust System**: Vendors accrue a trust score based on user reviews, calculated via Django signals.
- **Infrastructure Ready**: Pre-configured with `Supabase` (DB), `Cloudinary` (Images), and `Whitenoise` (Static files).

### Frontend Highlights
- **Interactive Dashboards**: Role-specific views for Citizens (Listing items, Tracking) and Vendors (Bidding, Pickup Schedule).
- **Live GPS Tracking**: Integrated `useGPS` hook and Google Maps component for real-time pickup visualization.
- **State Management**: Using `Zustand` with persistence for auth and `React Query` for robust data fetching.
- **Premium UI**: Built with Tailwind CSS, Framer Motion for animations, and HeadlessUI for accessible interactions.

---

## 📦 Project Structure

```text
├── backend/
│   ├── apps/           # Core Logic (users, listings, bids, orders, reviews)
│   ├── config/         # Settings (base, development, production)
│   ├── utils/          # Helpers (Geo-Haversine, Cloudinary, Pagination)
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── api/        # Axios instances & endpoint helpers
    │   ├── components/ # Atomic UI & Layout components
    │   ├── hooks/      # Custom React Query & GPS hooks
    │   ├── pages/      # Route-level views
    │   └── store/      # Global state (Auth)
    └── tailwind.config.js
```

---

## 🏗️ Environment Variables (.env)

### Backend
- `SECRET_KEY`: Django security key.
- `DJANGO_SETTINGS_MODULE`: Set to `config.settings.development` for local or `config.settings.production` for deployment.
- `CLOUDINARY_URL`: Required for image uploads.
- `DATABASE_URL`: Required for production (Supabase/PostgreSQL).

---

## ✅ Ready for Deployment
The project is built for professional scale with secure code and a vibrant user interface.
