// ============================================================================
// FILE        : database.web.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Expo-web platform variant of database.js — same API surface
//               as the SQLite version but backed by localStorage, aliased
//               in webpack.config.js for the web build.
// ============================================================================

// Web implementation of database.js using localStorage instead of SQLite

const KEYS = {
  patients: 'dsa_patients',
  doctors: 'dsa_doctors',
  appointments: 'dsa_appointments',
  medical_records: 'dsa_medical_records',
  uploads: 'dsa_uploads',
  geo_visits: 'dsa_geo_visits',
  activity_log: 'dsa_activity_log',
};

const load = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const persist = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const getDB = async () => ({ ready: true });

// ─── PATIENTS ────────────────────────────────────────────────
export const getPatients = async (search = '') => {
  const patients = load(KEYS.patients);
  const doctors = load(KEYS.doctors);
  const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));
  let result = patients.map(p => ({
    ...p,
    doctor_name: doctorMap[p.assigned_doctor_id]?.name || null,
  }));
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(p =>
      p.name?.toLowerCase().includes(s) || p.phone?.toLowerCase().includes(s)
    );
  }
  return result.sort((a, b) => (b.updated_at || '') > (a.updated_at || '') ? 1 : -1);
};

export const getPatientById = async (id) => {
  const patients = load(KEYS.patients);
  const doctors = load(KEYS.doctors);
  const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));
  const p = patients.find(r => r.id === id) || null;
  if (!p) return null;
  return { ...p, doctor_name: doctorMap[p.assigned_doctor_id]?.name || null };
};

export const savePatient = async (patient) => {
  const patients = load(KEYS.patients);
  const now = new Date().toISOString();
  const id = patient.id || `P${Date.now()}`;
  const existing = patients.findIndex(r => r.id === id);
  const record = {
    ...patient,
    id,
    created_at: patient.created_at || now,
    updated_at: now,
    sync_status: 'pending',
  };
  if (existing >= 0) patients[existing] = record;
  else patients.push(record);
  persist(KEYS.patients, patients);
  await logActivity('SAVE', 'patient', id, `Patient ${patient.name} saved`);
  return id;
};

export const deletePatient = async (id) => {
  persist(KEYS.patients, load(KEYS.patients).filter(r => r.id !== id));
};

// ─── DOCTORS ─────────────────────────────────────────────────
export const getDoctors = async (search = '') => {
  let result = load(KEYS.doctors);
  if (search) {
    const s = search.toLowerCase();
    result = result.filter(d =>
      d.name?.toLowerCase().includes(s) || d.specialization?.toLowerCase().includes(s)
    );
  }
  return result.sort((a, b) => (b.updated_at || '') > (a.updated_at || '') ? 1 : -1);
};

export const getDoctorById = async (id) => {
  return load(KEYS.doctors).find(r => r.id === id) || null;
};

export const saveDoctor = async (doctor) => {
  const doctors = load(KEYS.doctors);
  const now = new Date().toISOString();
  const id = doctor.id || `D${Date.now()}`;
  const existing = doctors.findIndex(r => r.id === id);
  const record = {
    ...doctor,
    id,
    created_at: doctor.created_at || now,
    updated_at: now,
    sync_status: 'pending',
  };
  if (existing >= 0) doctors[existing] = record;
  else doctors.push(record);
  persist(KEYS.doctors, doctors);
  await logActivity('SAVE', 'doctor', id, `Doctor ${doctor.name} saved`);
  return id;
};

export const deleteDoctor = async (id) => {
  persist(KEYS.doctors, load(KEYS.doctors).filter(r => r.id !== id));
};

// ─── APPOINTMENTS ─────────────────────────────────────────────
export const getAppointments = async (filter = {}) => {
  let appts = load(KEYS.appointments);
  const patients = load(KEYS.patients);
  const doctors = load(KEYS.doctors);
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]));
  const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));
  if (filter.date) appts = appts.filter(a => a.date === filter.date);
  if (filter.status) appts = appts.filter(a => a.status === filter.status);
  if (filter.patient_id) appts = appts.filter(a => a.patient_id === filter.patient_id);
  return appts
    .map(a => ({
      ...a,
      patient_name: patientMap[a.patient_id]?.name || null,
      doctor_name: doctorMap[a.doctor_id]?.name || null,
    }))
    .sort((a, b) => {
      const da = `${b.date || ''}${b.time || ''}`;
      const db = `${a.date || ''}${a.time || ''}`;
      return da > db ? 1 : -1;
    });
};

export const saveAppointment = async (appt) => {
  const appts = load(KEYS.appointments);
  const now = new Date().toISOString();
  const id = appt.id || `A${Date.now()}`;
  const existing = appts.findIndex(r => r.id === id);
  const record = {
    ...appt,
    id,
    status: appt.status || 'scheduled',
    created_at: appt.created_at || now,
    updated_at: now,
    sync_status: 'pending',
  };
  if (existing >= 0) appts[existing] = record;
  else appts.push(record);
  persist(KEYS.appointments, appts);
  await logActivity('SAVE', 'appointment', id, 'Appointment saved');
  return id;
};

export const deleteAppointment = async (id) => {
  persist(KEYS.appointments, load(KEYS.appointments).filter(r => r.id !== id));
};

// ─── MEDICAL RECORDS ──────────────────────────────────────────
export const getMedicalRecords = async (patient_id = null) => {
  let records = load(KEYS.medical_records);
  const patients = load(KEYS.patients);
  const doctors = load(KEYS.doctors);
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]));
  const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));
  if (patient_id) records = records.filter(r => r.patient_id === patient_id);
  return records
    .map(r => ({
      ...r,
      patient_name: patientMap[r.patient_id]?.name || null,
      doctor_name: doctorMap[r.doctor_id]?.name || null,
    }))
    .sort((a, b) => (b.record_date || '') > (a.record_date || '') ? 1 : -1);
};

export const saveMedicalRecord = async (record) => {
  const records = load(KEYS.medical_records);
  const now = new Date().toISOString();
  const id = record.id || `R${Date.now()}`;
  const existing = records.findIndex(r => r.id === id);
  const entry = {
    ...record,
    id,
    created_at: record.created_at || now,
    updated_at: now,
    sync_status: 'pending',
  };
  if (existing >= 0) records[existing] = entry;
  else records.push(entry);
  persist(KEYS.medical_records, records);
  return id;
};

// ─── UPLOADS ─────────────────────────────────────────────────
export const getUploads = async (patient_id = null) => {
  let uploads = load(KEYS.uploads);
  const patients = load(KEYS.patients);
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]));
  if (patient_id) uploads = uploads.filter(u => u.patient_id === patient_id);
  return uploads
    .map(u => ({ ...u, patient_name: patientMap[u.patient_id]?.name || null }))
    .sort((a, b) => (b.created_at || '') > (a.created_at || '') ? 1 : -1);
};

export const saveUpload = async (upload) => {
  const uploads = load(KEYS.uploads);
  const now = new Date().toISOString();
  const id = upload.id || `U${Date.now()}`;
  const existing = uploads.findIndex(u => u.id === id);
  const entry = {
    ...upload,
    id,
    status: 'pending',
    uploaded_by: 'DSA',
    created_at: now,
    sync_status: 'pending',
  };
  if (existing >= 0) uploads[existing] = entry;
  else uploads.push(entry);
  persist(KEYS.uploads, uploads);
  await logActivity('UPLOAD', 'upload', id, `Document uploaded: ${upload.file_name}`);
  return id;
};

// ─── GEO VISITS ───────────────────────────────────────────────
export const saveGeoVisit = async (visit) => {
  const visits = load(KEYS.geo_visits);
  const now = new Date().toISOString();
  const id = `G${Date.now()}`;
  visits.push({ ...visit, id, visited_at: now, sync_status: 'pending' });
  persist(KEYS.geo_visits, visits);
  return id;
};

export const getGeoVisits = async () => {
  const visits = load(KEYS.geo_visits);
  const patients = load(KEYS.patients);
  const doctors = load(KEYS.doctors);
  const patientMap = Object.fromEntries(patients.map(p => [p.id, p]));
  const doctorMap = Object.fromEntries(doctors.map(d => [d.id, d]));
  return visits
    .map(g => ({
      ...g,
      patient_name: patientMap[g.patient_id]?.name || null,
      doctor_name: doctorMap[g.doctor_id]?.name || null,
    }))
    .sort((a, b) => (b.visited_at || '') > (a.visited_at || '') ? 1 : -1)
    .slice(0, 100);
};

// ─── STATS ────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const today = new Date().toISOString().split('T')[0];
  return {
    totalPatients: load(KEYS.patients).length,
    totalDoctors: load(KEYS.doctors).length,
    todayAppointments: load(KEYS.appointments).filter(a => a.date === today).length,
    pendingUploads: load(KEYS.uploads).filter(u => u.sync_status === 'pending').length,
  };
};

// ─── ACTIVITY LOG ─────────────────────────────────────────────
export const logActivity = async (action, entityType, entityId, description) => {
  const log = load(KEYS.activity_log);
  log.push({
    id: `L${Date.now()}`,
    action,
    entity_type: entityType,
    entity_id: entityId,
    description,
    created_at: new Date().toISOString(),
  });
  persist(KEYS.activity_log, log);
};

export const getRecentActivity = async (limit = 20) => {
  return load(KEYS.activity_log)
    .sort((a, b) => (b.created_at || '') > (a.created_at || '') ? 1 : -1)
    .slice(0, limit);
};

// ─── PIN AUTH ─────────────────────────────────────────────────
export const savePin = async (pin) => {
  localStorage.setItem('dsa_pin', pin);
  localStorage.setItem('pin_setup_done', 'true');
};

export const verifyPin = async (pin) => {
  return localStorage.getItem('dsa_pin') === pin;
};

export const isPinSetup = async () => {
  return localStorage.getItem('pin_setup_done') === 'true';
};
