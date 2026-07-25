# lxc-health-api

Hostinger-ready Node API for MyHealthHub.

This service acts as the private backend layer for weather integration:

- App calls this API
- This API calls WeatherAPI.com
- WeatherAPI key stays on the server

## Branch Context

- Created on the `weather-api-integration` branch and merged into `main` on 2026-07-25
- Intended to be deployed as a Node app on Hostinger
- First consumer: MyHealthHub home weather display
- Hostinger app deployment domain used during setup: `apis.lexvoraconsulting.com`

## Endpoints

- `GET /v1/health`
- `GET /v1/weather/today`
- `GET /openapi.json`
- `GET /docs`

`GET /v1/weather/today` accepts `?q=...` directly, or `?lat=...&lon=...`, and
falls back to `Dubai` automatically if the location lookup fails.

Mobile apps should prefer latitude/longitude because phones already have device
location:

```text
GET /v1/weather/today?lat=25.2048&lon=55.2708
```

## Environment

Copy `.env.example` to `.env` and set:

- `PORT`
- `DEFAULT_WEATHER_CITY`
- `HOSTINGER_API_TOKEN` only if you later automate Hostinger API actions
- `HOSTINGER_APP_ID` only if you later automate Hostinger API actions
- `WEATHER_WEATHERAPI_FORECASTV1_BASE_URL`
- `WEATHER_WEATHERAPI_FORECASTV1_API_KEY`

The Hostinger UI can import these from:

```text
publish/import.env
```

Replace placeholder secret values inside Hostinger's environment-variable UI.
Do not commit real production secrets.

## Runtime

This backend is a Node.js app and must be deployed to a Hostinger plan or
environment that supports Node.js execution.

Recommended runtime:

- Node.js 20 LTS

Hostinger hPanel showed support for Node.js 18.x, 20.x, 22.x, and 24.x. Use
20.x for this API unless a future dependency requires a newer runtime.

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
https://apis.lexvoraconsulting.com
```

## Hostinger deployment

Use manual upload when you want to control exactly when stable code goes live.
Do not use GitHub auto-connect unless you want deployments tied directly to
repository updates.

1. Generate a deploy bundle from the repo root:

   ```bash
   ./Executable/macos_healthapi_package.sh
   ```

2. Upload the generated `.tar` from:

   ```text
   lxc-health-api/publish/
   ```

3. In Hostinger Review Build Settings:
   - Framework preset: `Express`
   - Node version: `20.x`
   - Root directory: `./`
   - Build command: `npm run build`
   - Start command: `npm start`

4. Import or enter environment variables from:

   ```text
   lxc-health-api/publish/import.env
   ```

5. Replace `WEATHER_WEATHERAPI_FORECASTV1_API_KEY` with the real WeatherAPI.com
   key in Hostinger.

6. Deploy and verify:

   ```text
   https://apis.lexvoraconsulting.com/v1/health
   https://apis.lexvoraconsulting.com/docs
   https://apis.lexvoraconsulting.com/v1/weather/today?lat=25.2048&lon=55.2708
   ```

The root-level repo folder `publish/` is not used. Deployment archives must stay
under `lxc-health-api/publish/`.

## App Contract

The mobile app should call this backend, not WeatherAPI.com directly:

```text
GET /v1/weather/today
GET /v1/weather/today?q=25.2048,55.2708
GET /v1/weather/today?lat=25.2048&lon=55.2708
```

That keeps the WeatherAPI key private and gives us one place to add caching,
logging, or new weather fields later.

## Mobile dev fallback

The mobile app has a temporary dev fallback path for weather rendering while
Hostinger setup is still in progress:

- `lxc-myhealthhub-shared/src/api/config.ts`
- `lxc-myhealthhub-shared/src/api/weather.ts`
- env var: `WEATHER_PROVIDER_DEV_KEY`

This is not the production security model. Production should authenticate mobile
requests to this backend and keep provider keys server-side.
