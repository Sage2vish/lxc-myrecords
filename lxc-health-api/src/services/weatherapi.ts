import {env} from '../config/env.js';

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

export async function fetchCurrentWeather(city: string): Promise<WeatherSummary> {
  const url = new URL('/current.json', env.weatherApiBaseUrl);
  url.searchParams.set('key', env.weatherApiKey);
  url.searchParams.set('q', city);
  url.searchParams.set('aqi', 'no');

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
