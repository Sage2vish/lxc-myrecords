// ============================================================================
// FILE        : appointmentsData.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 26-July-2026 | 00:00 Hrs
//
// PURPOSE     : Shared appointments content model used by the Home screen and
//               the dedicated Appointments screen. Keeping the data here lets
//               both surfaces stay in sync while the UI remains split across
//               small feature files.
// ============================================================================

import {colors} from '../../theme/colors';
import type {Appointment as HealthAppointment} from '../../types/health';

export type AppointmentPreview = {
  name: string;
  role: string;
  gender: 'female' | 'male';
  calendarMonth: string;
  calendarDay: string;
  calendarWeekday: string;
  date: string;
  time: string;
  location: string;
};

export type AppointmentStat = {
  key: string;
  label: string;
  value: string;
  tone: string;
  tint: string;
};

export type AppointmentQuickAction = {
  key: string;
  title: string;
  subtitle: string;
  tone: string;
  icon: string;
};

export const upcomingAppointmentsPreview: AppointmentPreview[] = [
  {
    name: 'Dr. Ananya Sharma',
    role: 'Cardiologist',
    gender: 'female',
    calendarMonth: 'MAY',
    calendarDay: '24',
    calendarWeekday: 'SAT',
    date: '24 May 2025, Sat',
    time: '11:30 AM',
    location: 'HealthPlus Clinic, Bengaluru',
  },
  {
    name: 'Dr. Mehul Joshi',
    role: 'Orthopedist',
    gender: 'male',
    calendarMonth: 'MAY',
    calendarDay: '30',
    calendarWeekday: 'FRI',
    date: '30 May 2025, Fri',
    time: '04:00 PM',
    location: 'Apollo Specialty Hospital',
  },
  {
    name: 'Dr. Kavya Rao',
    role: 'Pediatrician',
    gender: 'female',
    calendarMonth: 'JUN',
    calendarDay: '02',
    calendarWeekday: 'MON',
    date: '02 Jun 2025, Mon',
    time: '09:00 AM',
    location: 'Motherhood Hospital',
  },
];

export const appointmentStats: AppointmentStat[] = [
  {key: 'total', label: 'Total Appointments', value: '5', tone: colors.primary, tint: colors.primarySoft},
  {key: 'completed', label: 'Completed', value: '2', tone: '#1E9A45', tint: '#ECFAEF'},
  {key: 'upcoming', label: 'Upcoming', value: '2', tone: '#FF8A00', tint: '#FFF6EA'},
  {key: 'follow-ups', label: 'Follow-ups Due', value: '1', tone: '#C04FC4', tint: '#FBEEF9'},
  {key: 'wait-time', label: 'Avg. Wait Time', value: '12 min', tone: '#7E57C2', tint: '#F3EDFF'},
];

export const appointmentQuickActions: AppointmentQuickAction[] = [
  {
    key: 'book',
    title: 'Book Appointment',
    subtitle: 'Schedule a new visit',
    tone: colors.primarySoft,
    icon: '📅',
  },
  {
    key: 'teleconsult',
    title: 'Teleconsultation',
    subtitle: 'Connect with doctor online',
    tone: '#F3ECFF',
    icon: '🎥',
  },
  {
    key: 'prescription',
    title: 'Upload Prescription',
    subtitle: 'Add files to records',
    tone: '#EAF9F0',
    icon: '⬆',
  },
  {
    key: 'directions',
    title: 'Clinic Directions',
    subtitle: 'Find the right route',
    tone: '#FFEAF4',
    icon: '📍',
  },
  {
    key: 'reminders',
    title: 'Reminders',
    subtitle: 'Keep follow-ups in view',
    tone: '#FFF4E6',
    icon: '🔔',
  },
];

export const followUpBanner = {
  title: "Don’t miss a follow-up!",
  body: 'You have 2 follow-up appointments due this month.',
  cta: 'View Follow-ups',
};

function formatDateParts(dateText: string) {
  const isoLikeMatch = dateText.trim().match(/^(\d{4}-\d{2}-\d{2})(?:\s+(.*))?$/);

  if (!isoLikeMatch) {
    return null;
  }

  const parsed = new Date(`${isoLikeMatch[1]}T00:00:00`);

  if (Number.isNaN(parsed.valueOf())) {
    return null;
  }

  return {
    calendarMonth: parsed.toLocaleDateString('en-US', {month: 'short'}).toUpperCase(),
    calendarDay: String(parsed.getDate()).padStart(2, '0'),
    calendarWeekday: parsed.toLocaleDateString('en-US', {weekday: 'short'}).toUpperCase(),
    dateLabel: `${parsed.getDate()} ${parsed.toLocaleDateString('en-US', {month: 'short'})} ${parsed.getFullYear()}`,
    timeLabel: isoLikeMatch[2] ?? '11:30 AM',
  };
}

export function mapHealthAppointmentToPreview(
  appointment: HealthAppointment,
  index: number,
): AppointmentPreview {
  const dateParts = formatDateParts(appointment.date);

  if (dateParts) {
    return {
      name: appointment.doctor,
      role: appointment.specialty,
      gender: (index % 2 === 0 ? 'female' : 'male') as 'female' | 'male',
      calendarMonth: dateParts.calendarMonth,
      calendarDay: dateParts.calendarDay,
      calendarWeekday: dateParts.calendarWeekday,
      date: `${dateParts.dateLabel}, ${dateParts.timeLabel}`.trim(),
      time: dateParts.timeLabel,
      location: appointment.location,
    };
  }

  return {
    name: appointment.doctor,
    role: appointment.specialty,
    gender: (index % 2 === 0 ? 'female' : 'male') as 'female' | 'male',
    calendarMonth: 'APT',
    calendarDay: '--',
    calendarWeekday: '---',
    date: appointment.date,
    time: '11:30 AM',
    location: appointment.location,
  };
}
