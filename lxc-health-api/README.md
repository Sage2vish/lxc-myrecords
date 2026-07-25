# lxc-health-api

Hostinger-ready Node API for MyHealthHub.

This service acts as the private backend layer for weather integration:

- App calls this API
- This API calls WeatherAPI.com
- WeatherAPI key stays on the server

## Branch Context

- Created on the `weather-api-integration` branch
- Intended to be deployed as a Node app on Hostinger
- First consumer: MyHealthHub Dubai temperature in the header area

## Endpoints

- `GET /v1/health`
- `GET /v1/weather/today`
- `GET /openapi.json`
- `GET /docs`

`GET /v1/weather/today` accepts `?q=...` directly, or `?lat=...&lon=...`, and
falls back to `Dubai` automatically if the location lookup fails.

## Environment

Copy `.env.example` to `.env` and set:

- `PORT`
- `DEFAULT_WEATHER_CITY`
- `HOSTINGER_API_TOKEN` only if you later automate Hostinger API actions
- `HOSTINGER_APP_ID` only if you later automate Hostinger API actions
- `WEATHER_WEATHERAPI_FORECASTV1_BASE_URL`
- `WEATHER_WEATHERAPI_FORECASTV1_API_KEY`

## Runtime

This backend is a Node.js app and must be deployed to a Hostinger plan or
environment that supports Node.js execution.

Recommended runtime:

- Node.js 20 LTS

If Hostinger asks for a startup command, use:

```bash
npm start
```

If Hostinger asks for build command, use:

```bash
npm run build
```

## Where to keep secrets

Best practice:

1. Keep tokens out of git
2. Put production secrets in Hostinger environment variables
3. Put local secrets in your local `.env`

For code organization, the API registry lives in
[`src/config/apis.ts`](./src/config/apis.ts) and follows this structure:

```text
apis.weather.weatherapi.forecastv1
```

That keeps provider URLs and keys in one place, while the weather service reads
from the registry instead of scattering env lookups across files.

## Weather flow

The `GET /v1/weather/today` endpoint calls:

- `https://api.weatherapi.com/v1/current.json`

It returns a compact JSON payload with:

- requestedLocation
- city
- region
- country
- tempC
- feelsLikeC
- condition
- conditionCode
- icon
- isDay
- localtime

If the phone location request fails or WeatherAPI cannot resolve the current
location, the backend retries using Dubai as the default city.

## Working Standard

Date: July 25, 2026

This is the documented working response standard for the backend weather
integration as of this date:

```json
{
  "location": {
    "name": "New York",
    "region": "New York",
    "country": "United States of America",
    "lat": 40.71,
    "lon": -74.01,
    "tz_id": "America/New_York",
    "localtime_epoch": 1658522976,
    "localtime": "2022-07-22 16:49"
  },
  "current": {
    "last_updated_epoch": 1658522700,
    "last_updated": "2022-07-22 16:45",
    "temp_c": 34.4,
    "temp_f": 93.9,
    "is_day": 1,
    "condition": {
      "text": "Partly cloudy",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": 1003
    },
    "wind_mph": 16.1,
    "wind_kph": 25.9,
    "wind_degree": 180,
    "wind_dir": "S",
    "pressure_mb": 1011,
    "pressure_in": 29.85,
    "precip_mm": 0,
    "precip_in": 0,
    "humidity": 31,
    "cloud": 75,
    "feelslike_c": 37,
    "feelslike_f": 98.6,
    "vis_km": 16,
    "vis_miles": 9,
    "uv": 8,
    "gust_mph": 11.6,
    "gust_kph": 18.7,
    "air_quality": {
      "co": 293.70001220703125,
      "no2": 18.5,
      "o3": 234.60000610351562,
      "so2": 12,
      "pm2_5": 13.600000381469727,
      "pm10": 15,
      "us-epa-index": 1,
      "gb-defra-index": 2
    }
  }
}
```

The backend should normalize that raw provider payload into the app-friendly
response that exposes:

- requestedLocation
- version
- city
- region
- country
- tempC
- feelsLikeC
- condition
- conditionCode
- icon
- isDay
- localtime
- source

## Local run

```bash
npm install
npm run build
npm start
```

## Swagger / testing online

Open the Swagger UI at:

```text
http://localhost:3000/docs
```

The raw OpenAPI spec is available at:

```text
http://localhost:3000/openapi.json
```

In production, replace `localhost` with:

```text
https://api.lexvoraconsulting.com
```

## Hostinger deployment

1. Upload this folder to your Node app location on Hostinger
2. Set the environment variables in Hostinger
3. Make sure Node.js is enabled for the site/app in Hostinger
4. Run `npm install`
5. Run `npm run build`
6. Start the app with `npm start`

## App Contract

The mobile app should call this backend, not WeatherAPI.com directly:

```text
GET /v1/weather/today
GET /v1/weather/today?q=25.2048,55.2708
GET /v1/weather/today?lat=25.2048&lon=55.2708
```

That keeps the WeatherAPI key private and gives us one place to add caching,
logging, or new weather fields later.
