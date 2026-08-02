export const env = {
  port: Number(process.env.PORT ?? 3000),
  defaultWeatherCity: process.env.DEFAULT_WEATHER_CITY ?? 'Dubai',
};
