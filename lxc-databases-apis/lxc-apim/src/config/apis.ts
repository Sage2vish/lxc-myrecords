type WeatherForecastV1Config = {
  baseUrl: string;
  apiKey: string;
};

type ApiRegistry = {
  weather: {
    weatherapi: {
      forecastv1: WeatherForecastV1Config;
    };
  };
};

export const apis: ApiRegistry = {
  weather: {
    weatherapi: {
      forecastv1: {
        baseUrl: process.env.WEATHER_WEATHERAPI_FORECASTV1_BASE_URL ?? 'https://api.weatherapi.com/v1',
        apiKey: process.env.WEATHER_WEATHERAPI_FORECASTV1_API_KEY ?? '',
      },
    },
  },
};

export function assertApiConfig() {
  const {baseUrl, apiKey} = apis.weather.weatherapi.forecastv1;

  if (!baseUrl) {
    throw new Error('WEATHER_WEATHERAPI_FORECASTV1_BASE_URL is required');
  }

  if (!apiKey) {
    throw new Error('WEATHER_WEATHERAPI_FORECASTV1_API_KEY is required');
  }
}
