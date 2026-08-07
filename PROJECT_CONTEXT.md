# Missions Clinic - Project Context

This document provides a comprehensive overview of the Missions Clinic application to assist AI models and developers in understanding the codebase, architecture, and current state of the project.

## 1. Project Overview

**Name**: Missions Clinic (formerly ZoeMissionHMs)
**Purpose**: A comprehensive patient-flow, consultation, and pharmacy management system designed specifically for humanitarian medical teams operating in the field.
**Stack**: 
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, React Router DOM, Phosphor Icons / Lucide React.
- **Backend**: Node.js, Express (migrated from a legacy Python FastAPI backend).
- **Architecture**: Full-stack application. The `server.ts` file acts as both the API backend and the static file server (or Vite middleware in development) for the React SPA.

## 2. Core Features & Workflows

The application tracks the complete lifecycle of a patient visit during a medical mission:
1. **Registration**: Creating new patient profiles and assigning them to the clinic queue.
2. **Triage & Vitals**: Recording initial vitals (blood pressure, temperature, weight, etc.) and assessing priority.
3. **Consultation**: Doctors record subjective complaints, objective findings, assessments, and plans (SOAP notes).
4. **Prescription**: Doctors prescribe medications from an available inventory.
5. **Dispensing / Pharmacy**: Pharmacists fulfill prescriptions, provide instructions, and mark medications as dispensed.

### Role-Based Access Control (RBAC)
The application enforces access controls based on staff roles:
- `admin`: Full system access, staff management, settings.
- `registration`: Can register patients and manage the initial queue.
- `triage`: Can record vitals and manage the triage queue.
- `doctor`: Can conduct consultations, prescribe medications, and view full patient histories.
- `pharmacy`: Can view prescriptions, manage medication inventory, and dispense drugs.

## 3. System Architecture & File Structure

```text
/
âââ package.json         # Project dependencies and NPM scripts (dev, build, start)
âââ vite.config.ts       # Vite configuration with React and Tailwind plugins
âââ tsconfig.json        # TypeScript configuration
âââ tailwind.config.js   # (Handled via Vite/v4 in modern setups, configured via CSS)
âââ server.ts            # Express backend containing API routes and Vite middleware
âââ src/                 # Frontend React Application
    âââ api/             # API client services (fetch wrappers)
    âââ components/      # Reusable UI components (Layout, Navbar, Sidebar, Badges)
    âââ context/         # React Contexts (AuthContext, ToastContext)
    âââ pages/           # Application views organized by domain (Patients, Vitals, etc.)
    âââ types.ts         # Global TypeScript interfaces and domain models
    âââ App.tsx          # Main React component defining routing and protected routes
    âââ main.tsx         # React DOM entry point
    âââ index.css        # Global styles and Tailwind configuration
```

## 4. API Endpoints (`server.ts`)

The Express backend serves the following RESTful API routes (prefixed with `/api`):

- **Auth**: `POST /auth/login`, `GET /auth/me`
- **Staff**: `GET /staff`, `POST /staff`, `PATCH /staff/:id`
- **Patients**: `GET /patients`, `POST /patients`, `GET /patients/:id`
- **Encounters**: `GET /encounters`, `POST /encounters`, `GET /encounters/:id`, `PATCH /encounters/:id`
- **Vitals**: `GET /vitals`, `POST /vitals`
- **Consultations**: `GET /consultations`, `POST /consultations`, `GET /consultations/:id`, `PATCH /consultations/:id`
- **Medications**: `GET /medications`, `POST /medications`, `PATCH /medications/:id`
- **Prescriptions**: `GET /prescriptions`, `POST /prescriptions`
- **Dispensing**: `POST /dispensing`

*Note: The backend currently uses in-memory or file-based mock databases to ensure the application runs smoothly in a contained Node.js environment without external dependencies.*

## 5. Styling & Design System

The app uses **Tailwind CSS** with a custom color palette tailored for a calm, professional, and accessible medical environment.

**CSS Variables (`src/index.css`)**:
- **Cream** (`--color-cream`): `#FBF7EC` (Backgrounds)
- **Emerald** (`--color-emerald-*`): Primary brand colors for actions, success states, and headers.
- **Gold** (`--color-gold-*`): Warning states, highlights, and secondary accents.
- **Ink** (`--color-ink`): Text and typography.

**Typography**:
- **Headings**: `Fraunces` (Serif)
- **Body**: `Public Sans` (Sans-serif)

## 6. Key Considerations for AI Edits

When prompting an AI to edit or add features to this codebase, keep the following in mind:

1. **Maintain SPA routing**: Use `react-router-dom` for client-side navigation.
2. **Respect RBAC**: If adding a new page, ensure it is wrapped in `<ProtectedRoute>` with appropriate `allowedRoles` in `App.tsx`.
3. **Types & Interfaces**: Update `src/types.ts` when modifying data structures, and ensure `server.ts` returns payloads matching these types.
4. **Backend Sync**: Any new feature requiring data persistence must have its corresponding Express route added to `server.ts` and the API client function added to `src/api/client.ts`.
5. **Styling**: Stick to the Tailwind utility classes and the custom theme variables. Do not introduce inline styles or CSS-in-JS.
6. **No HMR**: Hot Module Replacement is disabled in this environment. The preview reloads after code generation is complete.

## 7. Migration Notes
This project was migrated from a Python (FastAPI) backend. The `App/`, `test/`, and `Dockerfile` directories were removed, and the backend logic was rewritten into `server.ts` to support a cohesive Node.js full-stack deployment.
