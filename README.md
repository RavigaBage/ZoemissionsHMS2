# Clinic Queue & Encounter Management System

A clinic management system for managing patient registration, encounters, ticket issuance, queue progression, vitals, consultations, prescriptions, and pharmacy dispensing.

The system is designed around a deterministic patient-processing workflow where tickets are ranked according to their issuance order, allowing staff across different stations to consistently identify and process the next patient.

---

## Overview

The application manages the patient journey through the clinic:

```text
Patient Registration
        ↓
Encounter / Ticket Issued
        ↓
Queue
        ↓
Vitals / Triage
        ↓
Doctor Consultation
        ↓
   ┌────┴────┐
   │         │
Completed  Prescriptions
   │         │
   │      Pharmacy
   │         │
   └────┬────┘
        ↓
    Completed
```

A deterministic `ticket_rank` is assigned to encounters to ensure that patients are processed in the same order in which their tickets were issued.

---

## Key Features

* Patient registration and encounter creation
* Deterministic ticket numbering and ranking
* Queue management across clinic stations
* Patient queue ranking based on ticket issuance order
* Vitals and triage recording
* Doctor consultation management
* Prescription creation and tracking
* Pharmacy dispensing
* Automatic medication stock updates after dispensing
* Ability for doctors to complete consultations without sending patients to pharmacy
* Encounter status progression based on consultation and prescription state
* Consolidated queue API
* Health-check endpoint
* Staff PIN update endpoint
* Consultation-specific prescription filtering
* Client-side queue sorting by ticket rank
* Automatic check-in and ticket issuance for newly registered patients
* Improved display of patient phone numbers, vitals, recorder information, and queue rank

---

# Ticket & Queue Management

## Deterministic Ticket Ranking

Each encounter receives a `ticket_rank` that represents its position in the ticket issuance sequence.

This provides a stable ordering mechanism across the application and prevents queue ordering from depending on database insertion order or inconsistent client-side sorting.

For example:

```text
Ticket       Rank
------       ----
TIC-001       1
TIC-002       2
TIC-003       3
TIC-004       4
```

Patients are therefore processed according to their ticket issuance order.

Existing encounters are assigned ranks during initialization, while new encounters receive the next available rank.

### Ticket Helpers

The server provides helpers for generating deterministic ticket information:

* `nextTicketRank()`
* `nextTicketNumber()`
* `sortByTicketRank`

These helpers ensure that ticket generation and queue ordering remain consistent throughout the system.

---

# Patient Workflow

## 1. Patient Registration

A patient can be registered through the patient registration interface.

The system can optionally:

1. Create the patient
2. Automatically create an encounter
3. Issue a ticket
4. Add the patient to the queue
5. Navigate the patient to the next required station

---

## 2. Encounter Creation

An encounter represents a patient's visit to the clinic.

When an encounter is created:

* A deterministic `ticket_rank` is assigned.
* A predictable `ticket_number` is generated.
* The encounter enters the appropriate queue stage.
* The frontend navigates the patient into the next stage of the workflow.

Encounters returned from:

```http
GET /api/encounters
```

are ordered by `ticket_rank`.

---

## 3. Queue

The queue represents patients currently waiting for or being processed by a clinic station.

The consolidated queue endpoint is:

```http
GET /api/queue
```

Queue records contain ticket information and can be ordered using `ticket_rank`.

The frontend uses this ranking to ensure that the earliest issued tickets appear first.

Queue ordering is applied to:

* Queue page
* Dispensing page
* Encounter listings
* Other relevant patient-processing lists

---

## 4. Vitals / Triage

Patients proceed to vitals before consultation.

Vitals records include information such as:

* Blood pressure
* Pulse
* Temperature
* Weight
* Height
* Oxygen saturation
* Additional clinical fields
* Staff member who recorded the vitals

The `recorded_by` field is used consistently for authorization and audit purposes.

The vitals update authorization checks the current user's identity against the recorded staff member.

---

# Consultation Workflow

Doctors can complete a consultation in two ways.

## Standard Consultation

If the consultation produces prescriptions:

```text
Consultation
     ↓
Prescription
     ↓
Pharmacy
     ↓
Completed
```

The encounter is moved to the `pharmacy` stage.

## Completed Consultation

A doctor can mark a consultation as completed using the `completed` flag.

```text
Consultation
     ↓
Completed
```

This allows patients who do not require medication to bypass the pharmacy stage.

The `completed` flag is supported by:

```http
POST /api/consultations
```

and:

```http
PATCH /api/consultations/:id
```

The encounter status is determined using the consultation's completion state and associated prescriptions.

---

# Prescriptions

Prescriptions can be created as part of the consultation workflow.

The prescription API supports filtering by consultation:

```http
GET /api/prescriptions?consultation_id={id}
```

This allows the frontend to retrieve prescriptions belonging specifically to a consultation.

Prescription responses include associated medication information where applicable.

This is used by the pharmacy interface to determine what medication needs to be dispensed.

---

# Pharmacy & Dispensing

The dispensing workflow retrieves prescriptions awaiting fulfillment.

After a prescription is dispensed:

1. The prescription is removed from the active dispensing queue.
2. The dispensing API returns the updated medication information.
3. The frontend updates its local medication stock using the response.
4. The patient's dispensing workflow is updated accordingly.

This prevents the pharmacy interface from displaying stale medication stock after a successful dispensing operation.

---

# Encounter Status Progression

The encounter status follows the patient's current stage.

A simplified progression is:

```text
Registration
     ↓
Vitals
     ↓
Consultation
     ↓
   ┌─┴──────────────┐
   │                │
Completed       Pharmacy
                    ↓
                Completed
```

A consultation marked as `completed` can bypass pharmacy.

A consultation with prescriptions advances the encounter to pharmacy.

Once pharmacy processing is complete, the encounter can move to completed.

---

# API Endpoints

## Health Check

```http
GET /api/health
```

Provides a lightweight endpoint for checking whether the API is available.

Example:

```json
{
  "status": "ok"
}
```

---

## Queue

```http
GET /api/queue
```

Returns the consolidated clinic queue.

Queue records are ordered using `ticket_rank` to maintain deterministic processing order.

---

## Encounters

```http
GET /api/encounters
POST /api/encounters
```

The encounter listing is sorted by `ticket_rank`.

New encounters receive:

* `ticket_number`
* `ticket_rank`

---

## Consultations

```http
POST /api/consultations
PATCH /api/consultations/:id
```

Consultation creation and updates support the `completed` flag.

The consultation workflow can:

* Create prescriptions
* Return associated prescriptions
* Move an encounter to pharmacy
* Mark an encounter as completed
* Skip pharmacy when appropriate

---

## Prescriptions

```http
GET /api/prescriptions
```

Supports consultation filtering:

```http
GET /api/prescriptions?consultation_id={id}
```

This retrieves prescriptions associated with a specific consultation.

---

## Staff PIN

```http
PATCH /api/staff/:id/pin
```

Allows an authorized user to update a staff member's PIN.

---

# Frontend Improvements

The frontend has been updated to expose more useful operational information and maintain consistent ordering.

## Ticket Card

`TicketCard` now supports displaying:

* Ticket number
* Queue rank
* Relevant patient information

Example:

```text
Ticket: TIC-004
Queue Rank: 4
```

---

## Consultation Interface

The consultation interface now surfaces:

* Patient phone number
* Additional vitals information
* Vitals recorder
* Other relevant patient information
* Consultation completion option

Doctors can select the completion option when the patient does not require pharmacy processing.

---

## Queue Ordering

The following frontend views sort records using `ticket_rank`:

* Queue
* Dispensing
* Encounters

This ensures that the frontend and backend use the same ordering principle.

---

## New Patient Flow

When registering a new patient, the system can optionally automatically:

```text
Create Patient
     ↓
Create Encounter
     ↓
Issue Ticket
     ↓
Check In
     ↓
Navigate to Vitals
```

This reduces the number of manual steps required by registration staff.

---

## New Encounter Flow

New encounters are created using:

```http
POST /api/encounters
```

After successful creation, the user is directed to the vitals stage.

---

# UI and Routing Fixes

Several frontend issues were corrected, including:

* Incorrect template-string interpolation
* Incorrect API deletion routes
* Incorrect navigation links
* Consultation form submission route
* Dashboard filter mappings
* Status label mappings
* Triage badge usage
* Client-side queue filtering
* Formatting and display inconsistencies

These fixes improve consistency between frontend routes and backend API endpoints.

---

# Data Model Changes

The encounter model now includes:

```text
ticket_rank
```

The frontend `Encounter` and `Queue` types have also been extended to support ticket-related fields.

The additional ranking field allows both the server and client to consistently determine patient processing order.

---

# Queue Ordering Strategy

The system intentionally avoids relying on:

* Database insertion order
* Array order from an API response
* Frontend arrival order
* Ticket number string comparison alone

Instead, the application uses:

```text
ticket_rank
```

as the canonical ordering value.

This provides a stable numeric ordering:

```text
1 → 2 → 3 → 4 → 5 → ...
```

regardless of how records are subsequently retrieved or displayed.

---

# Development

## Install Dependencies

Install the project's dependencies using the package manager configured for the project.

For npm:

```bash
npm install
```

## Development Server

Start the development environment using the project's configured development command.

For example:

```bash
npm run dev
```

## Production Build

Build the frontend with:

```bash
npm run build
```

Type-check the project with:

```bash
tsc
```

---

# Testing

The implementation was validated through automated and manual checks.

## Type Checking

The TypeScript project was type-checked successfully:

```bash
tsc
```

No TypeScript type errors were reported.

## Production Build

The project build was executed successfully:

```bash
npm run build
```

## Automated Tests

The automated test suite was executed:

```bash
npm test
```

All available tests passed.

## API / Route Smoke Testing

API and route smoke tests were performed against the development server to verify:

* Queue ordering
* Encounter creation
* Ticket ranking
* Ticket number generation
* Consultation status transitions
* Consultation completion flow
* Prescription handling
* Pharmacy workflow
* Dispensing response handling
* Medication stock updates

The tested workflows completed successfully.

---

# Operational Flow

The complete system can be summarized as:

```text
┌─────────────────────┐
│ Patient Registration│
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Create Encounter    │
│ Ticket + Rank       │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│       Queue         │
│ Ordered by Rank     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Vitals / Triage     │
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│    Consultation     │
└──────────┬──────────┘
           ↓
      ┌────┴────┐
      │         │
      ↓         ↓
  Completed  Prescription
      │         │
      │         ↓
      │    ┌──────────┐
      │    │ Pharmacy │
      │    └────┬─────┘
      │         ↓
      └────→ Completed
```

---

# Design Principles

The current implementation is built around several operational principles:

### 1. Deterministic Queue Ordering

Patients should be processed according to ticket issuance order.

### 2. Explicit Workflow Transitions

Encounter status should reflect the patient's actual position in the clinic workflow.

### 3. Pharmacy Is Conditional

Not every consultation requires medication. Doctors can explicitly complete consultations and bypass pharmacy.

### 4. Backend as the Source of Truth

Ticket ranks, encounter statuses, prescriptions, and dispensing responses are determined by the server, while the frontend reflects and locally updates that state.

### 5. Consistent Client-Side Ordering

Frontend lists use `ticket_rank` to preserve the same ordering established by the backend.

### 6. Operational Visibility

Health checks, queue endpoints, richer patient information, and improved status displays make the system easier for clinic staff and administrators to monitor.

---

# Current Status

The queue, encounter, consultation, prescription, and dispensing workflows have been updated to support deterministic ticket ordering and improved patient progression.

The implementation includes:

* Deterministic ticket ranking
* Predictable ticket generation
* Queue sorting
* Consultation completion
* Pharmacy skipping
* Prescription filtering
* Medication stock synchronization
* Improved vitals information
* Staff PIN management
* Health monitoring
* Frontend routing and UI fixes
* Automated test and build validation

The system is ready for continued feature development and integration testing.
