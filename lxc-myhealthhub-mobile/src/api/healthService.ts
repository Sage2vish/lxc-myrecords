import {Appointment, MedicalRecord, Prescription, Vital} from '../types/health';

export async function getAppointments(): Promise<Appointment[]> {
  return [
    {
      id: 'apt-001',
      doctor: 'Dr. Anika Rao',
      specialty: 'General Medicine',
      date: '2026-07-24 10:30 AM',
      location: 'Lexvora Health Clinic',
      status: 'Confirmed',
    },
    {
      id: 'apt-002',
      doctor: 'Dr. Sameer Khan',
      specialty: 'Cardiology',
      date: '2026-08-02 04:00 PM',
      location: 'Virtual consultation',
      status: 'Pending',
    },
  ];
}

export async function getRecords(): Promise<MedicalRecord[]> {
  return [
    {
      id: 'rec-001',
      title: 'Annual Wellness Check',
      provider: 'Lexvora Health Clinic',
      date: '2026-06-12',
      summary: 'Vitals normal. Suggested routine blood work follow-up.',
    },
    {
      id: 'rec-002',
      title: 'Lipid Panel',
      provider: 'City Diagnostics',
      date: '2026-05-18',
      summary: 'Cholesterol reviewed. Continue diet and activity plan.',
    },
  ];
}

export async function getPrescriptions(): Promise<Prescription[]> {
  return [
    {
      id: 'rx-001',
      medicine: 'Vitamin D3',
      dosage: '1000 IU',
      schedule: 'Once daily after breakfast',
      until: '2026-09-01',
    },
    {
      id: 'rx-002',
      medicine: 'Omega-3',
      dosage: '1 capsule',
      schedule: 'Once daily after dinner',
      until: 'Ongoing',
    },
  ];
}

export async function getVitals(): Promise<Vital[]> {
  return [
    {
      id: 'vital-001',
      label: 'Blood Pressure',
      value: '118/76 mmHg',
      trend: 'Stable',
      recordedAt: 'Today',
    },
    {
      id: 'vital-002',
      label: 'Glucose',
      value: '92 mg/dL',
      trend: 'Stable',
      recordedAt: 'Yesterday',
    },
    {
      id: 'vital-003',
      label: 'Weight',
      value: '72.4 kg',
      trend: 'Improving',
      recordedAt: '2 days ago',
    },
  ];
}
