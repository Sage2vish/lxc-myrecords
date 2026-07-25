import {createApp} from './app.js';
import {assertEnv, env} from './config/env.js';

assertEnv();

const app = createApp();

app.listen(env.port, () => {
  console.log(`lxc-health-api running on port ${env.port}`);
});
