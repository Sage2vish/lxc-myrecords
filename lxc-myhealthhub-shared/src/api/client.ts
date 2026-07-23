// ============================================================================
// FILE        : client.ts
// PROJECT     : LXC-Health
// AUTHOR      : Vishal Kumar
// UPDATED BY  : Vishal Kumar
// VERSION     : 1.0.0
// DATE-TIME   : 23-July-2026 | 20:39 Hrs
//
// PURPOSE     : Single shared Axios instance (apiClient) used for all API
//               calls. Base URL comes from react-native-config
//               (Config.API_BASE_URL), falling back to the production API.
// ============================================================================

import axios from 'axios';
import Config from 'react-native-config';

export const apiClient = axios.create({
  baseURL:
    Config.API_BASE_URL ?? 'https://lexvoraconsulting.com/api/v1/myhealthhub',
  timeout: 15000,
});
