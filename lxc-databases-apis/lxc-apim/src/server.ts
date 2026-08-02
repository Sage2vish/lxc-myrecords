import {createApp} from './app.js';
import {assertEnvConfig, env} from './config/env.js';

assertEnvConfig();

const app = createApp();

app.listen(env.port, () => {
  console.log('========================================');
  console.log('lxc-apim is ready');
  console.log(`port: ${env.port}`);
  console.log(`apim env: ${env.apimEnv}`);
  console.log('routes: /login, /dashboard, /catalog, /users/new, /change-password, /v1/health');
  console.log(`mysql host: ${env.mysql.host ? 'set' : 'missing'}`);
  console.log(`jwt secret: ${env.jwt.secret ? 'set' : 'missing'}`);
  console.log('========================================');
});
