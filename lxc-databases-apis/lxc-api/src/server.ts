import {createApp} from './app.js';
import {assertApiConfig} from './config/apis.js';
import {env} from './config/env.js';

assertApiConfig();

const app = createApp();

app.listen(env.port, () => {
  const weatherConfig = process.env.WEATHER_WEATHERAPI_FORECASTV1_BASE_URL ? 'set' : 'missing';
  const weatherKey = process.env.WEATHER_WEATHERAPI_FORECASTV1_API_KEY ? 'set' : 'missing';

  console.log('========================================');
  console.log('lxc-api is ready');
  console.log(`port: ${env.port}`);
  console.log('routes: /docs, /openapi.json, /v1/health, /v1/weather/today');
  console.log(`weather provider url: ${weatherConfig}`);
  console.log(`weather api key: ${weatherKey}`);
  console.log('========================================');
});
