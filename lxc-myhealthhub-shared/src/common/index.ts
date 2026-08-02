// Public shared domain surface for platform-specific app layers.
// Existing source will move under this folder incrementally without changing
// the mobile/tablet import boundary established by the entry points.
export {apiClient} from './api/client';
export {apiConfig} from './api/config';
export {fetchDeviceWeather, fetchWeather, type WeatherSummary} from './api/weather';
export {getAppointments, getPrescriptions, getRecords, getVitals} from './api/healthService';
export {useAppointments, usePrescriptions, useRecords, useVitals} from './hooks/useHealthData';
export {colors} from '../theme/colors';
export {getHeroTheme} from '../theme/dayparts';
export type {Appointment, MedicalRecord, Prescription, Vital} from './types/health';
