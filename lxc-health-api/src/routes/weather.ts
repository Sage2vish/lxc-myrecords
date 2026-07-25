import {Router} from 'express';
import {env} from '../config/env.js';
import {fetchCurrentWeather} from '../services/weatherapi.js';

export const weatherRouter = Router();

weatherRouter.get('/today', async (req, res, next) => {
  try {
    const city = typeof req.query.city === 'string' && req.query.city.trim() ? req.query.city.trim() : env.defaultWeatherCity;
    const weather = await fetchCurrentWeather(city);
    res.json({
      requestedCity: city,
      ...weather,
    });
  } catch (error) {
    next(error);
  }
});
