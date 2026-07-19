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
