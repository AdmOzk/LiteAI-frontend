# LiteAI Frontend

AI-supported patient tracking UI built with **Angular 18+**. This frontend consumes the Lite backend at `https://localhost:7102/` and delivers a secure, clinician-focused workflow for authentication, patient management, history tracking, and AI-assisted insight display.

## 🎯 Project scope (Frontend)
- **JWT-based login and registration** via backend Auth endpoints; guards protect patient routes for signed-in users only.
- **Patient list** showing _Name, Surname, Birthdate_ with **View** and **Delete** actions plus an **Add New Patient** CTA.
- **Patient detail** page that surfaces doctor remarks, historical records, and an **AI-supported prediction** block (gracefully falls back to sample data if the AI endpoint is unavailable).
- **Patient creation** uses **Reactive Forms** to POST patient data and handles validation/feedback client-side.
- **HTTP security**: tokens stored in `localStorage` and attached through an interceptor for every API call.

## 🧭 Feature walkthrough
- **Authentication flow**: login/register requests hit `/api/Auth/login` and `/api/Auth/register`; successful auth stores the JWT, applies it through the HTTP interceptor, and activates route guards.
- **Protected navigation**: non-authenticated users are redirected to the login page when trying to reach patient routes.
- **Patient roster**: table view fetches `/api/Patients`, supports delete with `/api/Patients/{id}`, and routes to detail/creation views.
- **Patient details**: fetches `/api/Patients/{id}` (including `historyEntries`), displays doctor remarks, and pulls predictions from `/api/Prediction/{patientId}` with a static JSON fallback.
- **History management**: posting to `/api/Patients/{id}/history` adds new entries; surface list for quick review.

## 🛠️ Tech stack
- **Framework**: Angular 18, TypeScript
- **Forms**: Reactive Forms
- **State & data**: HttpClient with interceptors/guards
- **Styling**: Material-inspired components and Inter typography

## 🚀 Running the project
1. **Backend prerequisite**: ensure the ASP.NET Core API is reachable at `https://localhost:7102/` with CORS enabled.
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Start development server**
   ```bash
   npm start
   ```
4. Open `http://localhost:4200/` in your browser. Unauthenticated visitors will be redirected to the login page.

## 📂 Folder layout
```
src/app
├── core
│   ├── config
│   ├── guards
│   ├── interceptors
│   ├── models
│   └── services
├── features
│   ├── auth
│   └── patients
│       ├── patient-detail
│       ├── patient-form
│       └── patient-list
└── shared
```

## ℹ️ Notes & assumptions
- Backend already delivers **Swagger documentation**, **JWT AAA**, and **EF Core CRUD** for patients; this UI is aligned to those endpoints.
- All required features except **Dockerization** are implemented in the frontend.
- AI prediction uses a **fake/static response** when the dedicated endpoint is unavailable, keeping the UX stable during demos.
