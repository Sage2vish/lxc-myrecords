-- The API catalog: every product/service the auth API and Swagger showcase
-- are aware of. lxc-api registers itself here; lxc-apim reads this table to
-- build its multi-spec Swagger `urls` list and its product-scoped auth.
CREATE TABLE IF NOT EXISTS apim_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  description TEXT NULL,
  base_url VARCHAR(255) NULL,
  openapi_url VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
