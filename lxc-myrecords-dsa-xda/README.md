# LXC MyRecords — DSA Tablet App (XDA)

**Lexvora Consulting | Field Agent DSA Application**
Android Tablet APK | React Native | SQLite Local Storage

---

## 🕘 History

This folder was originally named `lxc-myrecords-dsaapp-xda`; it was renamed to
`lxc-myrecords-dsa-xda` on 2026-07-21 for naming consistency with the rest of the
repo. Git history was preserved as a rename — no source files changed. This app is
Android-only today; an iPadOS build is a possible future addition once the platform
priority calls for it, at which point it would get its own native folder the same way
MyHealthHub's `lxc-myhealthhub-ios` was added, without needing to restructure this
app's JS source.

## 📱 App Overview

This is the **DSA (Direct Sales Agent) tablet app** for Lexvora's MyRecords healthcare platform.

### Features
- 🔐 **PIN Authentication** (4-6 digit, device-locked)
- 👤 **Patient Management** — profiles, medical history, doctor assignment
- 🩺 **Doctor Management** — specialization, schedule, patient assignment
- 📅 **Appointments** — booking, status tracking, consultation types
- 📎 **Document Uploads** — camera, file picker, document scanner
- 📍 **Geo Tracking** — GPS tracking, visit logging with patient/doctor links
- 📋 **Medical Records** — diagnosis, treatment, prescriptions, follow-ups
- 🌐 **English + Hindi** UI (switchable)
- 💾 **100% Offline** — SQLite local storage, sync-ready when backend is live

---

## 🗂️ Folder Structure

```
lxc-myrecords-dsa-xda/
├── App.js                          ← Root: PIN gate → Navigator
├── package.json
├── src/
│   ├── theme/index.js              ← Colors, typography, spacing
│   ├── localization/index.js       ← EN + HI strings
│   ├── storage/database.js         ← SQLite schema + all CRUD
│   ├── navigation/AppNavigator.js  ← Tab + stack navigation
│   └── screens/
│       ├── Auth/PinScreen.js       ← PIN setup & login
│       ├── Dashboard/              ← Stats, activity, quick actions
│       ├── Patients/               ← Patient list, add, edit, detail
│       ├── Doctors/                ← Doctor list, add, edit, patients
│       ├── Appointments/           ← Booking, status, filter
│       ├── Uploads/                ← Camera, file, scan uploads
│       ├── GeoTracking/            ← GPS tracking, visit logging
│       └── Records/                ← Medical records CRUD
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- Java JDK 17
- Android Studio + Android SDK
- React Native CLI

```bash
npm install -g react-native-cli
```

### 1. Install Dependencies

```bash
cd lxc-myrecords-dsa-xda
npm install
```

### 2. Android Permissions

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE" />
```

### 3. Run on Android

```bash
# Start Metro bundler
npx react-native start

# Run on connected tablet
npx react-native run-android
```

### 4. Build Release APK

```bash
cd android
./gradlew assembleRelease
# APK output: android/app/build/outputs/apk/release/app-release.apk
```

---

## 📦 Key Dependencies

| Package | Purpose |
|---|---|
| `react-native-sqlite-storage` | Local database |
| `@react-native-async-storage/async-storage` | PIN + settings |
| `react-native-image-picker` | Camera + gallery |
| `react-native-document-picker` | File picker |
| `react-native-geolocation-service` | GPS tracking |
| `react-native-maps` | Map view |
| `@react-navigation/bottom-tabs` | Tab navigation |
| `i18n-js` | EN/HI localization |
| `moment` | Date formatting |

---

## 🔧 Enabling Native Features

After `npm install`, link native modules:

```bash
# For camera / image picker
npx react-native-permissions setup android --feature=Camera
npx react-native-permissions setup android --feature=PhotoLibrary

# For geo location
# Follow: https://github.com/Agontuk/react-native-geolocation-service#installation

# For SQLite
# Follow: https://github.com/andpor/react-native-sqlite-storage#installation
```

---

## 🏥 Database Schema

| Table | Key Fields |
|---|---|
| `patients` | id, name, phone, age, gender, blood_group, assigned_doctor_id, geo, medical_history |
| `doctors` | id, name, specialization, license_no, clinic, available_days, geo |
| `appointments` | id, patient_id, doctor_id, date, time, type, status |
| `medical_records` | id, patient_id, doctor_id, diagnosis, treatment, prescription |
| `uploads` | id, patient_id, type, file_path, status (pending/approved/rejected) |
| `geo_visits` | id, patient_id, latitude, longitude, visit_type |
| `activity_log` | id, action, entity_type, description |

---

## 🔐 Security Notes

- PIN stored in AsyncStorage (encrypt with `react-native-keychain` for production)
- All data local until backend sync is ready
- `sync_status` field tracks what needs to push to backend
- Hostinger backend URL: `https://lexvoraconsulting.com/api/v1`

---

## 🌐 Backend Sync (Future)

When Hostinger backend (FastAPI) is ready, implement sync in `src/storage/syncService.js`:

```js
// Push pending records to backend
const pendingPatients = await db.executeSql(`SELECT * FROM patients WHERE sync_status = 'pending'`);
// POST to https://lexvoraconsulting.com/api/v1/patients
// On success: UPDATE patients SET sync_status = 'synced' WHERE id = ?
```

---

## 📞 Support
**Lexvora Consulting** | lexvoraconsulting.com
