// ============================================================================
// FILE        : config.ts
// PURPOSE     : Shared public API configuration for the mobile app. Private
//               secrets must stay server-side.
// ============================================================================

import Config from 'react-native-config';

export const apiConfig = {
  baseUrl:
    Config.WEATHER_API_BASE_URL ??
    Config.API_BASE_URL ??
    'https://apis.lexvoraconsulting.com/v1',
  requestKey: Config.WEATHER_API_REQUEST_KEY ?? '',
  weatherProviderDevKey:
    Config.WEATHER_PROVIDER_DEV_KEY ?? '2c116ec677ba4572ba365509262507',
};
