import {Router} from 'express';
import {env} from '../config/env.js';
import {fetchCurrentWeather} from '../services/weatherapi.js';

export const weatherRouter = Router();

weatherRouter.get('/today', async (req, res, next) => {
  try {
    const q = typeof req.query.q === 'string' && req.query.q.trim() ? req.query.q.trim() : undefined;
    const lat = typeof req.query.lat === 'string' ? Number(req.query.lat) : undefined;
    const lon = typeof req.query.lon === 'string' ? Number(req.query.lon) : undefined;
    const city = typeof req.query.city === 'string' && req.query.city.trim() ? req.query.city.trim() : env.defaultWeatherCity;
    const primaryLocation = {
      q,
      lat: Number.isFinite(lat) ? lat : undefined,
      lon: Number.isFinite(lon) ? lon : undefined,
      city,
    };
    let requestedLocation: Record<string, unknown> = q ? {q} : Number.isFinite(lat) && Number.isFinite(lon) ? {lat, lon} : {city};
    let weather;

    try {
      weather = await fetchCurrentWeather(primaryLocation);
    } catch (primaryError) {
      if (requestedLocation.city === city && city === env.defaultWeatherCity) {
        throw primaryError;
      }

      weather = await fetchCurrentWeather({city: env.defaultWeatherCity});
      requestedLocation = {city: env.defaultWeatherCity, fallbackFrom: requestedLocation};
    }

    res.json({
      requestedLocation,
      version: 'v1',
      ...weather,
    });
  } catch (error) {
    next(error);
  }
});
