export const hostingerEnv = {
  apiToken: process.env.HOSTINGER_API_TOKEN ?? '',
  appId: process.env.HOSTINGER_APP_ID ?? '',
};

export function assertHostingerEnv() {
  if (!hostingerEnv.apiToken) {
    throw new Error('HOSTINGER_API_TOKEN is required for Hostinger API actions');
  }

  if (!hostingerEnv.appId) {
    throw new Error('HOSTINGER_APP_ID is required for Hostinger API actions');
  }
}
