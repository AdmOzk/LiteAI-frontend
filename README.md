# LiteAI Frontend

AI-supported patient tracking UI built with **Angular 18+**. This frontend consumes the Lite backend at config `API_BASE_URL` and delivers a secure, clinician-focused workflow for authentication, patient management, history tracking, and AI-assisted insight display.

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

## Project structure 

<p align="center">
<img width="722" height="400" alt="image" src="https://github.com/user-attachments/assets/a5db93d4-3378-451e-b4b6-f273148e822d" />
</p>

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
- Please don't forget to change API_BASE_URL with your actual url in the api.config.ts file.

## Screen Shuts

<img width="1918" height="958" alt="image" src="https://github.com/user-attachments/assets/8d42b298-0b53-40e3-8ecb-ddc8bd0bb35b" />

<img width="1918" height="913" alt="image" src="https://github.com/user-attachments/assets/e7ebec71-a642-429c-8456-acf1c117a07a" />

<img width="1918" height="901" alt="image" src="https://github.com/user-attachments/assets/94f55df3-0597-40a5-9c7a-dabf9e43aaf8" />

<img width="1912" height="917" alt="image" src="https://github.com/user-attachments/assets/370957e4-b9d9-4f0b-a3df-079dae3c9494" />

<img width="1918" height="902" alt="image" src="https://github.com/user-attachments/assets/423cf127-2f67-4c8f-8b59-7bd9519406bb" />

<img width="1917" height="892" alt="image" src="https://github.com/user-attachments/assets/2d719855-2e67-44a4-a7a4-43ae51f1ceb2" />

<img width="1918" height="915" alt="image" src="https://github.com/user-attachments/assets/ef60cd28-5b59-4946-a6f1-bd4669fd3414" />
