<h1 id="lxc-api" align="center">🔌 lxc-api</h1>

<p align="center">
  <a href="https://lexvoraconsulting.com" target="_blank"><strong>lexvoraconsulting.com</strong></a>
</p>

<p align="center">
    <img src="https://img.shields.io/badge/status-active-brightgreen" alt="Status">
    <img src="https://img.shields.io/badge/service-API-4B5563" alt="Service">
    <img src="https://img.shields.io/badge/Node.js-20.x-339933" alt="Node.js">
    <img src="https://img.shields.io/badge/Framework-Express-000000" alt="Express">
    <img src="https://img.shields.io/badge/Database-MySQL-4479A1" alt="MySQL">
    <img src="https://img.shields.io/badge/Deploy-Hostinger-4B5563" alt="Hostinger">
</p>

---

Hostinger-ready Node API for Lexvora Consulting APIs & Databases.

This service is the private backend layer for weather and future API
capabilities. It is the API itself — [`lxc-apim`](../lxc-apim/) is the
separate, differently-coded management/showcase layer built on top of it.

<table>
  <tr>
    <td align="center"><strong>App</strong><br/>Calls this API, never the provider directly</td>
    <td align="center"><strong>lxc-api</strong><br/>Talks to WeatherAPI.com / future backend services</td>
    <td align="center"><strong>Provider keys</strong><br/>Stay server-side, never shipped to the app</td>
  </tr>
</table>

## 📍 Branch Context

| | |
|---|---|
| Origin | Created on `weather-api-integration`, merged into `main` on 2026-07-25 |
| Target | Node app on Hostinger |
| First consumer | MyHealthHub home weather display |
| Hostinger domain | `apis.lexvoraconsulting.com` |

## 🌐 Endpoints

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/health` | Liveness check |
| `GET` | `/v1/doctors/search` | Search doctors by name, specialization, or location |
| `GET` | `/v1/doctors/{doctorId}/profile` | Retrieve a single doctor profile |
| `GET` | `/v1/doctors/{doctorId}/availability` | Check appointment availability for a doctor |
| `GET` | `/v1/weather/today` | Accepts `?q=...` or `?lat=...&lon=...`; falls back to `Dubai` automatically |
| `GET` | `/openapi.json` | Raw OpenAPI spec |
| `GET` | `/docs` | Swagger UI |

Mobile apps should prefer latitude/longitude because phones already have device
location:

```text
GET /v1/weather/today?lat=25.2048&lon=55.2708
```

## ⚙️ Environment

Copy `.env.example` to `.env` and set:

| Variable | Purpose |
|---|---|
| `PORT` | Local server port |
| `DEFAULT_WEATHER_CITY` | Fallback city (Dubai) |
| `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` | Hostinger MySQL connection, shared with `lxc-apim` |
| `HOSTINGER_API_TOKEN` / `HOSTINGER_APP_ID` | Only if automating Hostinger API actions later |
| `WEATHER_WEATHERAPI_FORECASTV1_BASE_URL` / `WEATHER_WEATHERAPI_FORECASTV1_API_KEY` | Weather provider registry |

The Hostinger UI can import these from `publish/import.env`. Replace
placeholder secret values inside Hostinger's environment-variable UI — do not
commit real production secrets.

## 🚀 Runtime

Recommended runtime: **Node.js 20 LTS**. Hostinger hPanel showed support for
Node.js 18.x, 20.x, 22.x, and 24.x — use 20.x unless a future dependency
requires newer.

| Hostinger prompt | Command |
|---|---|
| Startup command | `npm start` |
| Build command | `npm run build` |

## 🔐 Where to keep secrets

1. Keep tokens out of git
2. Put production secrets in Hostinger environment variables
3. Put local secrets in your local `.env`

The API registry lives in [`src/config/apis.ts`](./src/config/apis.ts) and
follows this structure, keeping provider URLs/keys in one place instead of
scattered env lookups:

```text
apis.weather.weatherapi.forecastv1
```

The doctor REST surface now lives in [`src/routes/doctors.ts`](./src/routes/doctors.ts)
with a small in-memory service layer in
[`src/services/doctors.ts`](./src/services/doctors.ts). `lxc-apim` reads those
routes from this service's OpenAPI document so the catalog can mirror the
actual API surface instead of a hardcoded list.

## 🗄️ Database connection notes

This is the same MySQL database shared with `lxc-apim` — see
[`DB_CONNECTION.md`](./DB_CONNECTION.md) for the full workflow, or
[`../lxc-databases/api-apimgmt-db`](../lxc-databases/api-apimgmt-db/) for the
`api_*`/`apim_*` prefixed-table schema plan.

```text
Host: srv1878.hstgr.io
Port: 3306
Database: u450600831_lxc_hlthapi_db
Username: u450600831_lxc_hapi_admin
```

Recommended workflow:

1. Store the password only in your local `.env` or SQL client.
2. Use [`scripts/mysql-connect.sh`](./scripts/mysql-connect.sh) for a
   repeatable terminal workflow.
3. Use Hostinger phpMyAdmin for quick admin work from the panel.
4. Add migrations and schema files here as `lxc-api`'s own `api_*` tables grow.

## ☁️ Weather flow

`GET /v1/weather/today` calls `https://api.weatherapi.com/v1/current.json` and
returns a compact JSON payload:

| Field | | |
|---|---|---|
| `requestedLocation` | `city` | `region` |
| `country` | `tempC` | `feelsLikeC` |
| `condition` | `conditionCode` | `icon` |
| `isDay` | `localtime` | |

If the phone location request fails or WeatherAPI cannot resolve the current
location, the backend retries using Dubai as the default city.

## 📄 Working Standard

Date: July 25, 2026 — the documented working response standard for the
backend weather integration as of this date:

<details>
<summary>Raw WeatherAPI.com response shape</summary>

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

</details>

The backend normalizes that raw provider payload into the app-friendly
response that exposes: `requestedLocation`, `version`, `city`, `region`,
`country`, `tempC`, `feelsLikeC`, `condition`, `conditionCode`, `icon`,
`isDay`, `localtime`, `source`.

## 🏃 Local run

```bash
npm install
npm run build
npm start
```

## 📖 Swagger / testing online

| Env | Docs | OpenAPI |
|---|---|---|
| Local | `http://localhost:3000/docs` | `http://localhost:3000/openapi.json` |
| Production | `https://apis.lexvoraconsulting.com/docs` | `https://apis.lexvoraconsulting.com/openapi.json` |

## 🗄️ Database access

The MySQL database behind this Hostinger site is reachable with the Hostinger
MySQL host, **not** the website domain.

```text
Host: srv1878.hstgr.io
Port: 3306
Database: u450600831_lxc_hlthapi_db
Username: u450600831_lxc_hapi_admin
```

Notes:

- `apis.lexvoraconsulting.com` is the app/domain URL, not the database host.
- Keep the password out of git — store it only in your local SQL client or
  secure environment variables.
- phpMyAdmin is always available from the Hostinger panel for admin work.
- If the host changes in Hostinger later, update this section so future DB
  work can reconnect quickly.

### Optional shell helper

```bash
export MYSQL_HOST=srv1878.hstgr.io
export MYSQL_PORT=3306
export MYSQL_DATABASE=u450600831_lxc_hlthapi_db
export MYSQL_USER=u450600831_lxc_hapi_admin
./scripts/mysql-connect.sh
```

## 🚢 Hostinger deployment

Use manual upload when you want to control exactly when stable code goes
live. Do not use GitHub auto-connect unless deployments should be tied
directly to repository updates.

1. Generate a deploy bundle from the repo root:

   ```bash
   ./Executable/macos_healthapi_package.sh
   ```

2. Upload the generated `.tar` from `lxc-databases-apis/lxc-api/publish/`.

3. In Hostinger Review Build Settings:

   | Setting | Value |
   |---|---|
   | Framework preset | `Express` |
   | Node version | `20.x` |
   | Root directory | `./` |
   | Build command | `npm run build` |
   | Start command | `npm start` |

4. Import or enter environment variables from
   `lxc-databases-apis/lxc-api/publish/import.env`.

5. Replace `WEATHER_WEATHERAPI_FORECASTV1_API_KEY` with the real
   WeatherAPI.com key in Hostinger.

6. Deploy and verify:

   ```text
   https://apis.lexvoraconsulting.com/v1/health
   https://apis.lexvoraconsulting.com/docs
   https://apis.lexvoraconsulting.com/v1/weather/today?lat=25.2048&lon=55.2708
   ```

The root-level repo folder `publish/` is not used. Deployment archives must
stay under `lxc-databases-apis/lxc-api/publish/`.

## 📱 App Contract

The mobile app should call this backend, not WeatherAPI.com directly:

```text
GET /v1/weather/today
GET /v1/weather/today?q=25.2048,55.2708
GET /v1/weather/today?lat=25.2048&lon=55.2708
```

That keeps the WeatherAPI key private and gives us one place to add caching,
logging, or new weather fields later.

## 🧪 Mobile dev fallback

The mobile app has a temporary dev fallback path for weather rendering while
Hostinger setup is still in progress:

- `lxc-myhealthhub-shared/src/api/config.ts`
- `lxc-myhealthhub-shared/src/api/weather.ts`
- env var: `WEATHER_PROVIDER_DEV_KEY`

This is not the production security model. Production should authenticate
mobile requests to this backend and keep provider keys server-side.
