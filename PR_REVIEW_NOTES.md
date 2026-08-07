# Missions Clinic - Architecture & PR Review Guide

This document provides a deep dive into the component architecture, API behavior, and data relationships of the Missions Clinic application. It is designed to help reviewers understand how the frontend and backend interact, how state is managed, and how the clinical workflow is enforced.

---

## 1. Core Data Relationships (The Clinical Workflow)

The system is built around a sequential clinical pipeline. Understanding these relationships is crucial for reviewing any feature changes:

1. **Patient**: The root entity. Represents a person receiving care.
2. **Encounter**: Represents a single visit or "ticket" for a Patient on a specific day. All subsequent clinical data is tied to the Encounter, not just the Patient.
3. **Vitals**: Linked to an Encounter. Recorded during the Triage phase (e.g., blood pressure, temperature, triage priority).
4. **Consultation (SOAP Note)**: Linked to an Encounter. Recorded by the Doctor. Contains Subjective, Objective, Assessment, and Plan data.
5. **Prescription**: Linked to a Consultation/Encounter. Orders for specific `Medications` (from inventory) created by the Doctor.
6. **Dispensing**: Linked to a Prescription. The record of the Pharmacist fulfilling the medication order.

**State Machine (Encounter Status)**:
An Encounter moves through statuses, which dictates which department dashboard it appears on:
`Registered` â†’ `Triaged` â†’ `Consulted` â†’ `Pharmacy` â†’ `Completed`

---

## 2. API Endpoints Breakdown (`server.ts`)

The backend is an Express server running in Node.js, serving a RESTful API.

### Authentication & Authorization
*   `POST /api/auth/login`: Accepts credentials, returns a JWT (or session token) and user details.
*   `GET /api/auth/me`: Validates the current token and returns the user's session data.

### Patients & Encounters (Registration)
*   `GET /api/patients`, `POST /api/patients`: Manages the patient registry.
*   `GET /api/patients/:id`: Retrieves patient history, including past encounters.
*   `POST /api/encounters`: Creates a new visit (ticket) for a patient. Sets status to `Registered`.
*   `GET /api/encounters`: Fetches the active queues. Often queried with query params (e.g., `?status=Triaged`) to populate specific department dashboards.
*   `PATCH /api/encounters/:id`: Used to advance the encounter through the state machine (e.g., updating status from `Registered` to `Triaged`).

### Clinical Data (Triage & Doctor)
*   `POST /api/vitals`: Submits triage data for an encounter. Typically followed immediately by a `PATCH` to the encounter status.
*   `POST /api/consultations`: Submits the doctor's SOAP notes. 

### Pharmacy System
*   `GET /api/medications`, `POST /api/medications`, `PATCH /api/medications/:id`: Manages the clinic's drug inventory (name, dosage, stock levels).
*   `POST /api/prescriptions`: Creates a medication order linked to an encounter.
*   `POST /api/dispensing`: Records the fulfillment of a prescription, which should decrement the stock of the associated `Medication`.

---

## 3. Frontend Architecture & Global State

The frontend is a React SPA built with Vite, TypeScript, and Tailwind CSS.

### Context Providers (`src/context/`)
*   **`AuthContext`**: The source of truth for the user's session. It stores the currently logged-in user object (including their role: `admin`, `doctor`, `triage`, `pharmacy`, `registration`). It handles the `login` and `logout` functions and provides this state to all child components.
*   **`ToastContext`**: A global notification system. Used extensively in API client calls to provide user feedback (e.g., "Patient registered successfully" or "Error saving vitals").

### Routing & Security (`src/App.tsx` & `src/components/ProtectedRoute.tsx`)
*   **`ProtectedRoute`**: A wrapper component for routes. It checks `AuthContext` to ensure the user is logged in. It also accepts an `allowedRoles` array prop. If a user (e.g., `triage`) tries to access a restricted route (e.g., `/consultations/new` meant for `doctor`), it redirects them to the dashboard.
*   **`AppLayout`**: The main shell for authenticated pages. It provides the visual structure, rendering the `Sidebar` on the left and the `Navbar` on top, with the specific page content passed as `children`.

---

## 4. Key Reusable Components (`src/components/`)

*   **`Sidebar`**: Reads the user's role from `AuthContext` and dynamically renders navigation links. A `triage` user won't see the "Pharmacy" link.
*   **`Navbar`**: Displays the current user's name/role and contains the logout action.
*   **`TriageBadge`**: A critical visual component. It takes a triage priority level (e.g., "Immediate", "Urgent", "Routine") and renders a consistent, color-coded badge (e.g., Red, Yellow, Green) used across all dashboards to help staff prioritize care.
*   **`ConnectionBanner`**: Monitors `window.navigator.onLine`. Given the humanitarian field context, internet can be spotty. This component alerts the user if they drop offline.

---

## 5. Page-Level Workflows (How Pages use APIs)

Here is how the components and APIs interact to fulfill the primary user journeys:

### Journey 1: Registration
1.  User navigates to `NewPatientPage`.
2.  Form submission calls `POST /api/patients` via the `api/client.ts` wrapper.
3.  On success, the UI immediately redirects to `NewEncounterPage` (or prompts to create an encounter) calling `POST /api/encounters`.

### Journey 2: Triage
1.  `DashboardPage` or `PatientsPage` fetches `GET /api/encounters?status=Registered`.
2.  Triage nurse selects a patient, navigating to `NewVitalsPage`.
3.  Form submission calls `POST /api/vitals`.
4.  The frontend subsequently calls `PATCH /api/encounters/:id` to change the status to `Triaged`.

### Journey 3: Doctor Consultation
1.  Doctor views their queue, fetching `GET /api/encounters?status=Triaged`.
2.  Doctor navigates to `NewConsultationPage`.
3.  The page fetches patient history (`GET /api/patients/:id`) and triage vitals (`GET /api/vitals?encounterId=...`) for context.
4.  Doctor submits notes calling `POST /api/consultations` and adds medications calling `POST /api/prescriptions`.
5.  Frontend calls `PATCH /api/encounters/:id` to change status to `Pharmacy` (or `Completed` if no drugs are prescribed).

### Journey 4: Pharmacy
1.  Pharmacist views `DispensingPage`, backed by `GET /api/encounters?status=Pharmacy`.
2.  They view pending orders via `GET /api/prescriptions?encounterId=...`.
3.  As they hand over drugs, they mark them dispensed, triggering `POST /api/dispensing`.
4.  Once all prescriptions are filled, the encounter is patched (`PATCH /api/encounters/:id`) to `Completed`.

---

## 6. Reviewer Checklist

When reviewing PRs against this architecture, ensure:
- **RBAC**: Do new routes have the correct `allowedRoles` in `App.tsx`?
- **State Machine**: If a new clinical step is added, does the Encounter status get patched correctly so the patient moves to the next queue?
- **Context Usage**: Are API errors being gracefully handled and shown via `ToastContext`?
- **Styling**: Are custom CSS variables being used for colors (e.g., `bg-emerald-700` instead of hex codes) to maintain the brand guidelines?
