// ============================================================================
// FILE        : health.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Shared TypeScript types for the Appointment, MedicalRecord,
//               Prescription, and Vital domain objects used across the app.
// ============================================================================

export type Appointment = {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  location: string;
  status: 'Confirmed' | 'Pending' | 'Completed';
};

export type MedicalRecord = {
  id: string;
  title: string;
  provider: string;
  date: string;
  summary: string;
};

export type Prescription = {
  id: string;
  medicine: string;
  dosage: string;
  schedule: string;
  until: string;
};

export type Vital = {
  id: string;
  label: string;
  value: string;
  trend: 'Stable' | 'Improving' | 'Watch';
  recordedAt: string;
};
