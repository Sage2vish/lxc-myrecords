// Public shared domain surface for platform-specific app layers.
// Existing source will move under this folder incrementally without changing
// the mobile/tablet import boundary established by the entry points.
export {fetchDeviceWeather, type WeatherSummary} from '../api/weather';
export {useAppointments} from '../hooks/useHealthData';
export {colors} from '../theme/colors';
export {getHeroTheme} from '../theme/dayparts';
