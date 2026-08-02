INSERT INTO apim_products (slug, name, description, base_url, openapi_url, is_active) VALUES
  ('lxc-api', 'LXC API', 'Core Lexvora API service (weather today, future endpoints).',
   'https://apis.lexvoraconsulting.com', 'https://apis.lexvoraconsulting.com/openapi.json', 1),
  ('lxc-apim', 'LXC APIM', 'API management and showcase layer for Lexvora Consulting APIs.',
   'https://apim.lexvoraconsulting.com', 'https://apim.lexvoraconsulting.com/openapi.json', 1)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  base_url = VALUES(base_url),
  openapi_url = VALUES(openapi_url);
