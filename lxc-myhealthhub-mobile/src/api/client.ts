import axios from 'axios';
import Config from 'react-native-config';

export const apiClient = axios.create({
  baseURL:
    Config.API_BASE_URL ?? 'https://lexvoraconsulting.com/api/v1/myhealthhub',
  timeout: 15000,
});

apiClient.interceptors.request.use(config => {
  return config;
});
