// ============================================================================
// FILE        : weather.ts
// PROJECT     : LXC-Health
// PURPOSE     : Weather client for the Hostinger-backed weather API. Uses the
//               phone's coordinates when available and falls back to Dubai.
// ============================================================================

import {apiConfig} from '../common/api/config';

const DEFAULT_WEATHER_CITY = 'Dubai';

export type WeatherSummary = {
  requestedLocation: Record<string, unknown>;
  version: string;
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
  source: string;
};

type WeatherParams = {
  lat?: number;
  lon?: number;
  q?: string;
};

type WeatherApiCurrentResponse = {
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
  };
};

function getWeatherBaseUrl() {
  return apiConfig.baseUrl.replace(/\/$/, '');
}

export async function fetchWeather(params: WeatherParams = {}): Promise<WeatherSummary> {
  const url = new URL(`${getWeatherBaseUrl()}/weather/today`);

  if (params.q) {
    url.searchParams.set('q', params.q);
  } else if (typeof params.lat === 'number' && typeof params.lon === 'number') {
    url.searchParams.set('lat', String(params.lat));
    url.searchParams.set('lon', String(params.lon));
  } else {
    url.searchParams.set('city', DEFAULT_WEATHER_CITY);
  }

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
      ...(apiConfig.requestKey ? {'x-api-key': apiConfig.requestKey} : {}),
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Weather API request failed (${response.status}): ${body || response.statusText}`);
  }

  return (await response.json()) as WeatherSummary;
}

export async function fetchDeviceWeather(): Promise<WeatherSummary> {
  const coords = await getCurrentDeviceCoordinates();

  try {
    if (coords) {
      return await fetchWeather(coords);
    }

    return await fetchWeather({q: DEFAULT_WEATHER_CITY});
  } catch {
    return fetchWeatherDirectFromProvider(
      coords ? `${coords.lat},${coords.lon}` : DEFAULT_WEATHER_CITY,
    );
  }
}

async function fetchWeatherDirectFromProvider(q: string): Promise<WeatherSummary> {
  const url = new URL('https://api.weatherapi.com/v1/current.json');
  url.searchParams.set('key', apiConfig.weatherProviderDevKey);
  url.searchParams.set('q', q);
  url.searchParams.set('aqi', 'no');

  const response = await fetch(url.toString(), {
    headers: {
      accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`WeatherAPI fallback failed (${response.status})`);
  }

  const data = (await response.json()) as WeatherApiCurrentResponse;

  return {
    requestedLocation: {q},
    version: 'dev-provider-fallback',
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

function getCurrentDeviceCoordinates(): Promise<{lat: number; lon: number} | null> {
  const geo = (globalThis as typeof globalThis & {
    navigator?: {geolocation?: {getCurrentPosition: Function}};
  }).navigator?.geolocation;

  if (!geo?.getCurrentPosition) {
    return Promise.resolve(null);
  }

  return new Promise(resolve => {
    geo.getCurrentPosition(
      (position: {coords: {latitude: number; longitude: number}}) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      },
    );
  });
}
