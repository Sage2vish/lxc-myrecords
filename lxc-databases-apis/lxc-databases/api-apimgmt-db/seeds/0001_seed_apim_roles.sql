INSERT INTO apim_roles (slug, name, description) VALUES
  ('admin', 'Admin', 'Full access to manage products, users, and roles'),
  ('developer', 'Developer', 'Can view the catalog and manage own API tokens')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);
