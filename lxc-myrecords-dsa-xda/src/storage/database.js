// ============================================================================
// FILE        : database.js
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Entire local data layer for the DSA Tablet App — opens the
//               SQLite DB, defines the full schema (patients, doctors,
//               appointments, medical_records, uploads, geo_visits,
//               activity_log), and all CRUD. Offline-first: every table has
//               a sync_status column for a future backend sync pass.
// ============================================================================

import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

SQLite.enablePromise(true);

let db = null;

export const getDB = async () => {
  if (db) return db;
  db = await SQLite.openDatabase({ name: 'lexvora_dsa.db', location: 'default' });
  await initSchema();
  return db;
};

const initSchema = async () => {
  const database = db;
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      age INTEGER,
      gender TEXT,
      blood_group TEXT,
      assigned_doctor_id TEXT,
      medical_history TEXT,
      current_medications TEXT,
      allergies TEXT,
      latitude REAL,
      longitude REAL,
      created_at TEXT,
      updated_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialization TEXT,
      license_no TEXT,
      clinic TEXT,
      phone TEXT,
      available_days TEXT,
      latitude REAL,
      longitude REAL,
      created_at TEXT,
      updated_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      doctor_id TEXT,
      date TEXT,
      time TEXT,
      type TEXT,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at TEXT,
      updated_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS medical_records (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      doctor_id TEXT,
      record_date TEXT,
      diagnosis TEXT,
      treatment TEXT,
      prescription TEXT,
      follow_up_date TEXT,
      notes TEXT,
      created_at TEXT,
      updated_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS uploads (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      doctor_id TEXT,
      type TEXT,
      file_path TEXT,
      file_name TEXT,
      file_size INTEGER,
      mime_type TEXT,
      note TEXT,
      status TEXT DEFAULT 'pending',
      uploaded_by TEXT,
      created_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS geo_visits (
      id TEXT PRIMARY KEY,
      patient_id TEXT,
      doctor_id TEXT,
      latitude REAL,
      longitude REAL,
      address TEXT,
      visit_type TEXT,
      notes TEXT,
      visited_at TEXT,
      sync_status TEXT DEFAULT 'pending'
    );
  `);

  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id TEXT PRIMARY KEY,
      action TEXT,
      entity_type TEXT,
      entity_id TEXT,
      description TEXT,
      created_at TEXT
    );
  `);
};

// ─── PATIENTS ────────────────────────────────────────────────
export const getPatients = async (search = '') => {
  const database = await getDB();
  const query = search
    ? `SELECT p.*, d.name as doctor_name FROM patients p LEFT JOIN doctors d ON p.assigned_doctor_id = d.id WHERE p.name LIKE ? OR p.phone LIKE ? ORDER BY p.updated_at DESC`
    : `SELECT p.*, d.name as doctor_name FROM patients p LEFT JOIN doctors d ON p.assigned_doctor_id = d.id ORDER BY p.updated_at DESC`;
  const params = search ? [`%${search}%`, `%${search}%`] : [];
  const [results] = await database.executeSql(query, params);
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

export const getPatientById = async (id) => {
  const database = await getDB();
  const [results] = await database.executeSql(
    `SELECT p.*, d.name as doctor_name FROM patients p LEFT JOIN doctors d ON p.assigned_doctor_id = d.id WHERE p.id = ?`,
    [id]
  );
  return results.rows.length > 0 ? results.rows.item(0) : null;
};

export const savePatient = async (patient) => {
  const database = await getDB();
  const now = new Date().toISOString();
  const id = patient.id || `P${Date.now()}`;
  await database.executeSql(
    `INSERT OR REPLACE INTO patients (id, name, phone, address, age, gender, blood_group, assigned_doctor_id, medical_history, current_medications, allergies, latitude, longitude, created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, patient.name, patient.phone, patient.address, patient.age, patient.gender,
     patient.blood_group, patient.assigned_doctor_id, patient.medical_history,
     patient.current_medications, patient.allergies, patient.latitude, patient.longitude,
     patient.created_at || now, now]
  );
  await logActivity('SAVE', 'patient', id, `Patient ${patient.name} saved`);
  return id;
};

export const deletePatient = async (id) => {
  const database = await getDB();
  await database.executeSql(`DELETE FROM patients WHERE id = ?`, [id]);
};

// ─── DOCTORS ─────────────────────────────────────────────────
export const getDoctors = async (search = '') => {
  const database = await getDB();
  const query = search
    ? `SELECT * FROM doctors WHERE name LIKE ? OR specialization LIKE ? ORDER BY updated_at DESC`
    : `SELECT * FROM doctors ORDER BY updated_at DESC`;
  const params = search ? [`%${search}%`, `%${search}%`] : [];
  const [results] = await database.executeSql(query, params);
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

export const getDoctorById = async (id) => {
  const database = await getDB();
  const [results] = await database.executeSql(`SELECT * FROM doctors WHERE id = ?`, [id]);
  return results.rows.length > 0 ? results.rows.item(0) : null;
};

export const saveDoctor = async (doctor) => {
  const database = await getDB();
  const now = new Date().toISOString();
  const id = doctor.id || `D${Date.now()}`;
  await database.executeSql(
    `INSERT OR REPLACE INTO doctors (id, name, specialization, license_no, clinic, phone, available_days, latitude, longitude, created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, doctor.name, doctor.specialization, doctor.license_no, doctor.clinic, doctor.phone,
     doctor.available_days, doctor.latitude, doctor.longitude, doctor.created_at || now, now]
  );
  await logActivity('SAVE', 'doctor', id, `Doctor ${doctor.name} saved`);
  return id;
};

export const deleteDoctor = async (id) => {
  const database = await getDB();
  await database.executeSql(`DELETE FROM doctors WHERE id = ?`, [id]);
};

// ─── APPOINTMENTS ─────────────────────────────────────────────
export const getAppointments = async (filter = {}) => {
  const database = await getDB();
  let query = `SELECT a.*, p.name as patient_name, d.name as doctor_name
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN doctors d ON a.doctor_id = d.id`;
  const conditions = [];
  const params = [];
  if (filter.date) { conditions.push(`a.date = ?`); params.push(filter.date); }
  if (filter.status) { conditions.push(`a.status = ?`); params.push(filter.status); }
  if (filter.patient_id) { conditions.push(`a.patient_id = ?`); params.push(filter.patient_id); }
  if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
  query += ` ORDER BY a.date DESC, a.time DESC`;
  const [results] = await database.executeSql(query, params);
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

export const saveAppointment = async (appt) => {
  const database = await getDB();
  const now = new Date().toISOString();
  const id = appt.id || `A${Date.now()}`;
  await database.executeSql(
    `INSERT OR REPLACE INTO appointments (id, patient_id, doctor_id, date, time, type, status, notes, created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, appt.patient_id, appt.doctor_id, appt.date, appt.time, appt.type,
     appt.status || 'scheduled', appt.notes, appt.created_at || now, now]
  );
  await logActivity('SAVE', 'appointment', id, `Appointment saved`);
  return id;
};

export const deleteAppointment = async (id) => {
  const database = await getDB();
  await database.executeSql(`DELETE FROM appointments WHERE id = ?`, [id]);
};

// ─── MEDICAL RECORDS ──────────────────────────────────────────
export const getMedicalRecords = async (patient_id = null) => {
  const database = await getDB();
  const query = patient_id
    ? `SELECT r.*, p.name as patient_name, d.name as doctor_name FROM medical_records r LEFT JOIN patients p ON r.patient_id = p.id LEFT JOIN doctors d ON r.doctor_id = d.id WHERE r.patient_id = ? ORDER BY r.record_date DESC`
    : `SELECT r.*, p.name as patient_name, d.name as doctor_name FROM medical_records r LEFT JOIN patients p ON r.patient_id = p.id LEFT JOIN doctors d ON r.doctor_id = d.id ORDER BY r.record_date DESC`;
  const [results] = await database.executeSql(query, patient_id ? [patient_id] : []);
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

export const saveMedicalRecord = async (record) => {
  const database = await getDB();
  const now = new Date().toISOString();
  const id = record.id || `R${Date.now()}`;
  await database.executeSql(
    `INSERT OR REPLACE INTO medical_records (id, patient_id, doctor_id, record_date, diagnosis, treatment, prescription, follow_up_date, notes, created_at, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, record.patient_id, record.doctor_id, record.record_date, record.diagnosis,
     record.treatment, record.prescription, record.follow_up_date, record.notes,
     record.created_at || now, now]
  );
  return id;
};

// ─── UPLOADS ─────────────────────────────────────────────────
export const getUploads = async (patient_id = null) => {
  const database = await getDB();
  const query = patient_id
    ? `SELECT u.*, p.name as patient_name FROM uploads u LEFT JOIN patients p ON u.patient_id = p.id WHERE u.patient_id = ? ORDER BY u.created_at DESC`
    : `SELECT u.*, p.name as patient_name FROM uploads u LEFT JOIN patients p ON u.patient_id = p.id ORDER BY u.created_at DESC`;
  const [results] = await database.executeSql(query, patient_id ? [patient_id] : []);
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

export const saveUpload = async (upload) => {
  const database = await getDB();
  const now = new Date().toISOString();
  const id = upload.id || `U${Date.now()}`;
  await database.executeSql(
    `INSERT OR REPLACE INTO uploads (id, patient_id, doctor_id, type, file_path, file_name, file_size, mime_type, note, status, uploaded_by, created_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'DSA', ?, 'pending')`,
    [id, upload.patient_id, upload.doctor_id, upload.type, upload.file_path,
     upload.file_name, upload.file_size, upload.mime_type, upload.note, now]
  );
  await logActivity('UPLOAD', 'upload', id, `Document uploaded: ${upload.file_name}`);
  return id;
};

// ─── GEO VISITS ───────────────────────────────────────────────
export const saveGeoVisit = async (visit) => {
  const database = await getDB();
  const now = new Date().toISOString();
  const id = `G${Date.now()}`;
  await database.executeSql(
    `INSERT INTO geo_visits (id, patient_id, doctor_id, latitude, longitude, address, visit_type, notes, visited_at, sync_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [id, visit.patient_id, visit.doctor_id, visit.latitude, visit.longitude,
     visit.address, visit.visit_type, visit.notes, now]
  );
  return id;
};

export const getGeoVisits = async () => {
  const database = await getDB();
  const [results] = await database.executeSql(
    `SELECT g.*, p.name as patient_name, d.name as doctor_name FROM geo_visits g
     LEFT JOIN patients p ON g.patient_id = p.id
     LEFT JOIN doctors d ON g.doctor_id = d.id
     ORDER BY g.visited_at DESC LIMIT 100`
  );
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

// ─── STATS ────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const database = await getDB();
  const today = new Date().toISOString().split('T')[0];
  const [[p], [d], [a], [u]] = await Promise.all([
    database.executeSql(`SELECT COUNT(*) as count FROM patients`),
    database.executeSql(`SELECT COUNT(*) as count FROM doctors`),
    database.executeSql(`SELECT COUNT(*) as count FROM appointments WHERE date = ?`, [today]),
    database.executeSql(`SELECT COUNT(*) as count FROM uploads WHERE sync_status = 'pending'`),
  ]);
  return {
    totalPatients: p.rows.item(0).count,
    totalDoctors: d.rows.item(0).count,
    todayAppointments: a.rows.item(0).count,
    pendingUploads: u.rows.item(0).count,
  };
};

// ─── ACTIVITY LOG ─────────────────────────────────────────────
export const logActivity = async (action, entityType, entityId, description) => {
  const database = await getDB();
  const id = `L${Date.now()}`;
  await database.executeSql(
    `INSERT INTO activity_log (id, action, entity_type, entity_id, description, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, action, entityType, entityId, description, new Date().toISOString()]
  );
};

export const getRecentActivity = async (limit = 20) => {
  const database = await getDB();
  const [results] = await database.executeSql(
    `SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ?`, [limit]
  );
  return Array.from({ length: results.rows.length }, (_, i) => results.rows.item(i));
};

// ─── PIN AUTH ─────────────────────────────────────────────────
export const savePin = async (pin) => {
  await AsyncStorage.setItem('dsa_pin', pin);
  await AsyncStorage.setItem('pin_setup_done', 'true');
};

export const verifyPin = async (pin) => {
  const stored = await AsyncStorage.getItem('dsa_pin');
  return stored === pin;
};

export const isPinSetup = async () => {
  const done = await AsyncStorage.getItem('pin_setup_done');
  return done === 'true';
};
