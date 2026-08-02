// Localhost overrides for the catalog when env.apimEnv === 'local'. Keyed by
// apim_products.slug. Only lxc-api and lxc-apim are known services today;
// this stays a small hardcoded map rather than new DB columns until there
// are enough products to justify a data-driven version.
export const LOCAL_PRODUCT_URLS: Record<string, {baseUrl: string; openapiUrl: string}> = {
  'lxc-api': {
    baseUrl: 'http://localhost:3000',
    openapiUrl: 'http://localhost:3000/openapi.json',
  },
  'lxc-apim': {
    baseUrl: 'http://localhost:3100',
    openapiUrl: 'http://localhost:3100/openapi.json',
  },
};
