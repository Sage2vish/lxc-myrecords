import {apis} from '../config/apis.js';

export type CurrentWeatherResponse = {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    feelslike_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    is_day: number;
    last_updated: string;
  };
};

export type WeatherSummary = {
  city: string;
  region: string;
  country: string;
  tempC: number;
  feelsLikeC: number;
  condition: string;
  conditionCode: number;
  icon: string;
  isDay: boolean;
  localtime: string;
  source: 'weatherapi.com';
};

type LocationQuery = {
  lat?: number;
  lon?: number;
  city?: string;
  q?: string;
};

export async function fetchCurrentWeather(location: LocationQuery): Promise<WeatherSummary> {
  const {baseUrl, apiKey} = apis.weather.weatherapi.forecastv1;
  const url = new URL('/current.json', baseUrl);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('aqi', 'no');

  if (location.q) {
    url.searchParams.set('q', location.q);
  } else if (typeof location.lat === 'number' && typeof location.lon === 'number') {
    url.searchParams.set('q', `${location.lat},${location.lon}`);
  } else if (location.city) {
    url.searchParams.set('q', location.city);
  } else {
    throw new Error('Either lat/lon or city is required');
  }

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`WeatherAPI request failed (${response.status}): ${text || response.statusText}`);
  }

  const data = (await response.json()) as CurrentWeatherResponse;

  return {
    city: data.location.name,
    region: data.location.region,
    country: data.location.country,
    tempC: data.current.temp_c,
    feelsLikeC: data.current.feelslike_c,
    condition: data.current.condition.text,
    conditionCode: data.current.condition.code,
    icon: data.current.condition.icon,
    isDay: data.current.is_day === 1,
    localtime: data.location.localtime,
    source: 'weatherapi.com',
  };
}
