export type Doctor = {
  doctorId: string;
  name: string;
  specialization: string;
  location: string;
  yearsOfExperience: number;
  profile: string;
  available: boolean;
  nextAvailableSlot: string;
};

const doctors: Doctor[] = [
  {
    doctorId: 'DOC-1001',
    name: 'Dr. Amina Rahman',
    specialization: 'Cardiology',
    location: 'Dubai',
    yearsOfExperience: 12,
    profile: 'Senior cardiologist focused on preventive heart care and patient education.',
    available: true,
    nextAvailableSlot: '2026-08-03T10:30:00+04:00',
  },
  {
    doctorId: 'DOC-1002',
    name: 'Dr. Imran Malik',
    specialization: 'Orthopedics',
    location: 'Abu Dhabi',
    yearsOfExperience: 9,
    profile: 'Orthopedic specialist handling joint pain, fractures, and rehabilitation.',
    available: true,
    nextAvailableSlot: '2026-08-03T14:00:00+04:00',
  },
  {
    doctorId: 'DOC-1003',
    name: 'Dr. Sana Yusuf',
    specialization: 'Pediatrics',
    location: 'Sharjah',
    yearsOfExperience: 7,
    profile: 'Pediatric care for children, wellness checks, and family guidance.',
    available: false,
    nextAvailableSlot: '2026-08-04T09:00:00+04:00',
  },
];

type DoctorSearchQuery = {
  name?: string;
  specialization?: string;
  location?: string;
};

export function listDoctors(query: DoctorSearchQuery = {}) {
  const name = query.name?.trim().toLowerCase();
  const specialization = query.specialization?.trim().toLowerCase();
  const location = query.location?.trim().toLowerCase();

  return doctors.filter((doctor) => {
    const matchesName = !name || doctor.name.toLowerCase().includes(name);
    const matchesSpecialization = !specialization || doctor.specialization.toLowerCase().includes(specialization);
    const matchesLocation = !location || doctor.location.toLowerCase().includes(location);
    return matchesName && matchesSpecialization && matchesLocation;
  });
}

export function getDoctorProfile(doctorId: string) {
  return doctors.find((doctor) => doctor.doctorId === doctorId);
}

export function getDoctorAvailability(doctorId: string) {
  const doctor = getDoctorProfile(doctorId);
  if (!doctor) {
    return null;
  }

  return {
    doctorId: doctor.doctorId,
    available: doctor.available,
    nextAvailableSlot: doctor.nextAvailableSlot,
    schedule: doctor.available ? ['10:00', '11:30', '14:00'] : ['09:00', '13:30'],
  };
}
