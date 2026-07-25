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

- `GET /health`
- `GET /weather/today`

`GET /weather/today` accepts an optional `?city=...` query parameter.

## Environment

Copy `.env.example` to `.env` and set:

- `PORT`
- `WEATHER_API_KEY`
- `WEATHER_API_BASE_URL`
- `DEFAULT_WEATHER_CITY`

## Weather flow

The `GET /weather/today` endpoint calls:

- `https://api.weatherapi.com/v1/current.json`

It returns a compact JSON payload with:

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

## Local run

```bash
npm install
npm run build
npm start
```

## Hostinger deployment

1. Upload this folder to your Node app location on Hostinger
2. Set the environment variables in Hostinger
3. Run `npm install`
4. Run `npm run build`
5. Start the app with `npm start`

## App Contract

The mobile app should call this backend, not WeatherAPI.com directly:

```text
GET /weather/today
GET /weather/today?city=Dubai
```

That keeps the WeatherAPI key private and gives us one place to add caching,
logging, or new weather fields later.
