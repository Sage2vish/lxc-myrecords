export const env = {
  port: Number(process.env.PORT ?? 3000),
  weatherApiKey: process.env.WEATHER_API_KEY ?? '',
  weatherApiBaseUrl: process.env.WEATHER_API_BASE_URL ?? 'https://api.weatherapi.com/v1',
  defaultWeatherCity: process.env.DEFAULT_WEATHER_CITY ?? 'Dubai',
};

export function assertEnv() {
  if (!env.weatherApiKey) {
    throw new Error('WEATHER_API_KEY is required');
  }
}
